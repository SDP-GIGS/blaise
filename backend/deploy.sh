#!/bin/bash
set -e

# =========================
# CLIENT CONFIGURATION
#
# IP ALLOCATION GUIDE:
#   10.0.4.2  → nginx-proxy-manager (fixed, never change)
#   10.0.4.3  → hostra-system (fixed, never change)
#   10.0.4.4  → kimera LIVE
#   10.0.4.5  → kimera BUILD
#   10.0.4.6  → blaise LIVE
#   10.0.4.7  → blaise BUILD
#   10.0.4.8  → pos LIVE
#   10.0.4.9  → pos BUILD
#   10.0.4.10 → next client LIVE
#   10.0.4.11 → next client BUILD
#   ... and so on (always LIVE = even, BUILD = odd)
#
# For a new client, only change these 3 variables:
# =========================
APP_NAME="blaise"
LIVE_IP="10.0.4.6"
BUILD_IP="10.0.4.7"

# =========================
# CONSTANTS (do not change)
# =========================
NETWORK="hostra"
OLD_CONTAINER="${APP_NAME}_old"
NEW_CONTAINER="${APP_NAME}_new"
BACKUP_CONTAINER="${OLD_CONTAINER}_backup"
PORT=8000
STARTUP_WAIT=6
HEALTH_RETRIES=8
HEALTH_INTERVAL=3

log()     { echo "[$(date '+%H:%M:%S')] $1"; }
success() { echo "[$(date '+%H:%M:%S')] ✅ $1"; }
fail()    { echo "[$(date '+%H:%M:%S')] ❌ $1"; exit 1; }

# =========================
# HEALTH CHECK
# Checks that gunicorn is responding inside the container
# =========================
health_check() {
    local container=$1
    local label=$2
    local retries=${3:-$HEALTH_RETRIES}
    log "🔍 Health check on $label (up to $retries attempts)..."
    for i in $(seq 1 $retries); do
        if docker exec "$container" python -c "
import urllib.request, urllib.error, sys
try:
    urllib.request.urlopen('http://127.0.0.1:${PORT}/')
    sys.exit(0)
except urllib.error.HTTPError:
    sys.exit(0)  # any HTTP response means gunicorn is alive
except Exception:
    sys.exit(1)
" 2>/dev/null; then
            success "Health check passed on attempt $i"
            return 0
        fi
        log "⏳ Attempt $i/$retries failed — retrying in ${HEALTH_INTERVAL}s..."
        sleep $HEALTH_INTERVAL
    done
    return 1
}

# =========================
# ROLLBACK
# Restores backup container to LIVE IP if something goes wrong
# =========================
rollback() {
    log "🔄 Rolling back to previous version..."
    docker network disconnect "$NETWORK" "$OLD_CONTAINER"     2>/dev/null || true
    docker start "$BACKUP_CONTAINER"                          2>/dev/null || true
    docker network connect --ip "$LIVE_IP" "$NETWORK" "$BACKUP_CONTAINER" 2>/dev/null || true
    docker rename "$OLD_CONTAINER" "${NEW_CONTAINER}_failed"  2>/dev/null || true
    docker rename "$BACKUP_CONTAINER" "$OLD_CONTAINER"        2>/dev/null || true
    docker rm -f "${NEW_CONTAINER}_failed"                    2>/dev/null || true
    success "Rollback complete — previous version restored on $LIVE_IP"
}

# =========================
# STEP 1 — BUILD IMAGE
# =========================
log "🐳 Deploying $APP_NAME..."
log "🔨 Building image..."
if ! docker build --no-cache -t "${APP_NAME}:new" .; then
    fail "Build failed"
fi
success "Image built"

# =========================
# STEP 2 — CLEAN LEFTOVER CONTAINERS
# =========================
log "🧹 Cleaning any leftover new/backup containers..."
docker stop "$NEW_CONTAINER"     2>/dev/null || true
docker rm -f "$NEW_CONTAINER"    2>/dev/null || true
docker stop "$BACKUP_CONTAINER"  2>/dev/null || true
docker rm -f "$BACKUP_CONTAINER" 2>/dev/null || true

# =========================
# STEP 3 — START NEW CONTAINER ON BUILD IP
# Traffic is NOT sent here yet (NPM only uses BUILD IP as backup)
# The new container warms up here safely without affecting live traffic
# =========================
log "🚀 Starting new container on BUILD IP ($BUILD_IP)..."
docker run -d \
  --network "$NETWORK" \
  --ip "$BUILD_IP" \
  --name "$NEW_CONTAINER" \
  --restart unless-stopped \
  "${APP_NAME}:new"

log "⏳ Waiting ${STARTUP_WAIT}s for startup..."
sleep $STARTUP_WAIT

# =========================
# STEP 4 — CONFIRM NEW CONTAINER IS RUNNING
# =========================
if ! docker ps --filter "name=^${NEW_CONTAINER}$" --filter "status=running" | grep -q "$NEW_CONTAINER"; then
    fail "New container crashed on startup — check: docker logs $NEW_CONTAINER"
fi

# =========================
# STEP 5 — HEALTH CHECK NEW CONTAINER
# Only promote to live if healthy
# =========================
if ! health_check "$NEW_CONTAINER" "new container on BUILD IP"; then
    fail "New container failed health check — aborting, old container still live"
fi
success "New container is healthy on BUILD IP ($BUILD_IP)"

# =========================
# STEP 6 — ZERO DOWNTIME SWAP
#
# Order matters:
#   1. Disconnect OLD from LIVE IP   → frees 10.0.4.x
#      (NPM falls back to BUILD IP automatically during this gap)
#   2. Disconnect NEW from BUILD IP  → frees BUILD IP
#   3. Connect NEW to LIVE IP        → NPM hits new container again
#
# The gap in step 1 is covered by NPM's backup upstream pointing
# to BUILD IP, so no requests are dropped
# =========================
log "🔁 Swapping containers..."

# 1. Free the LIVE IP from old container
# NPM automatically falls back to BUILD IP (new container) during this gap
log "🔌 Disconnecting old container from LIVE IP ($LIVE_IP)..."
docker network disconnect "$NETWORK" "$OLD_CONTAINER" 2>/dev/null || true

# 2. Free the BUILD IP from new container
docker network disconnect "$NETWORK" "$NEW_CONTAINER"

# 3. Assign LIVE IP to new container — now fully live
docker network connect --ip "$LIVE_IP" "$NETWORK" "$NEW_CONTAINER"
success "New container is now live on LIVE IP ($LIVE_IP)"

# 4. Rename containers
if docker ps -a --filter "name=^${OLD_CONTAINER}$" | grep -q "$OLD_CONTAINER"; then
    docker rename "$OLD_CONTAINER" "$BACKUP_CONTAINER"
fi
docker rename "$NEW_CONTAINER" "$OLD_CONTAINER"

# 5. Stop old container — it is no longer serving traffic
log "🛑 Stopping old container..."
docker stop "$BACKUP_CONTAINER" 2>/dev/null || true

# =========================
# STEP 7 — POST SWAP HEALTH CHECK
# Confirm new container is still healthy after promotion
# =========================
if ! health_check "$OLD_CONTAINER" "live container post-swap"; then
    fail "Live container failed post-swap health check"
    rollback
    exit 1
fi

# =========================
# STEP 8 — CLEAN UP
# =========================
log "🧹 Removing old container..."
docker rm -f "$BACKUP_CONTAINER" 2>/dev/null || true

log "🧹 Removing dangling images..."
docker image prune -f 2>/dev/null || true

success "🎉 Deployment of $APP_NAME complete! Live on $LIVE_IP"
