import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Users,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Save,
  RotateCcw,
  Globe,
  Moon,
  Sun,
  Sliders,
  Key,
  UserCog,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  Server,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Toast
───────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      type === "success"
        ? "bg-emerald-950 border-emerald-700 text-emerald-200"
        : type === "error"
        ? "bg-red-950 border-red-700 text-red-200"
        : "bg-[#111c30] border-[#1e3a5f] text-slate-200"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
    )}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Confirm Modal
───────────────────────────────────────────── */
const ConfirmModal = ({ open, title, description, onConfirm, onClose, danger }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-2xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <div className="px-6 pt-6 pb-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                <AlertCircle className={`w-5 h-5 ${danger ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              </div>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition ${danger ? "bg-red-600 hover:bg-red-500" : "bg-amber-600 hover:bg-amber-500"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────
   Toggle Switch
───────────────────────────────────────────── */
const Toggle = ({ value, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!value)}
    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${
      value ? "bg-sky-500" : "bg-[#1e3a5f]"
    } disabled:opacity-40 disabled:cursor-not-allowed`}
    style={{ height: "22px", width: "40px" }}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
        value ? "translate-x-[18px]" : "translate-x-0"
      }`}
    />
  </button>
);

/* ─────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────── */
const Section = ({ title, description, icon: Icon, iconColor = "sky", children, delay = 0 }) => {
  const colorMap = {
    sky:     "text-sky-400    bg-sky-500/10    border-sky-500/20",
    violet:  "text-violet-400 bg-violet-500/10 border-violet-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber:   "text-amber-400  bg-amber-500/10  border-amber-500/20",
    rose:    "text-rose-400   bg-rose-500/10   border-rose-500/20",
    indigo:  "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  };
  const [t, bg, border] = colorMap[iconColor].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden"
    >
      <div className="flex items-center gap-3.5 px-6 py-4 border-b border-[#1a3050] bg-[#0b1523]">
        <div className={`p-2 rounded-xl ${bg} border ${border}`}>
          <Icon className={`w-4 h-4 ${t}`} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Setting Row (label + control)
───────────────────────────────────────────── */
const SettingRow = ({ label, description, children, last }) => (
  <div className={`flex items-center justify-between gap-4 py-3.5 ${!last ? "border-b border-[#122030]" : ""}`}>
    <div className="min-w-0">
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   Nav tabs config
───────────────────────────────────────────── */
const TABS = [
  { id: "general",       label: "General",       icon: Sliders  },
  { id: "security",      label: "Security",      icon: Shield   },
  { id: "notifications", label: "Notifications", icon: Bell     },
  { id: "users",         label: "User Roles",    icon: Users    },
  { id: "system",        label: "System",        icon: Server   },
];

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  /* General settings */
  const [siteName,      setSiteName]      = useState("Internship Portal");
  const [siteUrl,       setSiteUrl]       = useState("https://portal.university.ac.ug");
  const [timezone,      setTimezone]      = useState("Africa/Kampala");
  const [dateFormat,    setDateFormat]    = useState("DD/MM/YYYY");
  const [darkMode,      setDarkMode]      = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  /* Security settings */
  const [twoFactor,     setTwoFactor]     = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [passwordMinLen, setPasswordMinLen] = useState("8");
  const [loginAttempts,  setLoginAttempts]  = useState("5");
  const [showApiKey,    setShowApiKey]    = useState(false);
  const [apiKey] = useState("sk-portal-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6");

  /* Notification settings */
  const [notifEmail,    setNotifEmail]    = useState(true);
  const [notifSms,      setNotifSms]      = useState(false);
  const [notifLogSubmit,  setNotifLogSubmit]  = useState(true);
  const [notifEvalDue,    setNotifEvalDue]    = useState(true);
  const [notifNewStudent, setNotifNewStudent] = useState(true);
  const [notifDigest,     setNotifDigest]     = useState(false);
  const [smtpHost,      setSmtpHost]      = useState("smtp.gmail.com");
  const [smtpPort,      setSmtpPort]      = useState("587");
  const [smtpUser,      setSmtpUser]      = useState("noreply@university.ac.ug");

  /* User roles */
  const [roles, setRoles] = useState([
    { id: 1, name: "Admin",                permissions: ["All access"],                     color: "rose"    },
    { id: 2, name: "University Supervisor", permissions: ["View reports", "Approve logs"],   color: "sky"     },
    { id: 3, name: "Workplace Supervisor",  permissions: ["Review logs", "Evaluate student"], color: "violet"  },
    { id: 4, name: "Student",              permissions: ["Submit logs", "View placements"],   color: "emerald" },
  ]);
  const [newRoleName, setNewRoleName] = useState("");

  /* System */
  const [backupFreq,    setBackupFreq]    = useState("daily");
  const [maxFileSize,   setMaxFileSize]   = useState("10");
  const [logRetention,  setLogRetention]  = useState("90");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  /* Helpers */
  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = (section) => showToast(`${section} settings saved.`);

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    setRoles((r) => [...r, { id: Date.now(), name: newRoleName.trim(), permissions: [], color: "slate" }]);
    setNewRoleName("");
    showToast("Role added.");
  };

  const handleDeleteRole = (id) => {
    setRoles((r) => r.filter((role) => role.id !== id));
    showToast("Role removed.");
  };

  const roleColors = {
    rose:    "bg-rose-500/10    text-rose-300    border-rose-500/25",
    sky:     "bg-sky-500/10     text-sky-300     border-sky-500/25",
    violet:  "bg-violet-500/10  text-violet-300  border-violet-500/25",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    slate:   "bg-slate-500/10   text-slate-300   border-slate-500/25",
  };

  /* ── Render tab content ── */
  const renderTab = () => {
    switch (activeTab) {

      /* ── GENERAL ── */
      case "general":
        return (
          <div className="space-y-5">
            <Section title="Site Identity" description="Basic information about the portal." icon={Globe} iconColor="sky" delay={0.05}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Site Name</label>
                  <input
                    value={siteName} onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Site URL</label>
                  <input
                    value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                      <option>Africa/Kampala</option>
                      <option>Africa/Nairobi</option>
                      <option>UTC</option>
                      <option>Europe/London</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Date Format</label>
                    <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Appearance & Access" description="Control display and portal availability." icon={Moon} iconColor="violet" delay={0.1}>
              <SettingRow label="Dark Mode" description="Use dark theme across the portal.">
                <Toggle value={darkMode} onChange={setDarkMode} />
              </SettingRow>
              <SettingRow label="Maintenance Mode" description="Temporarily disable access for non-admins." last>
                <Toggle value={maintenanceMode} onChange={(v) => {
                  if (v) {
                    setConfirm({
                      title: "Enable Maintenance Mode?",
                      description: "All non-admin users will be locked out until maintenance mode is disabled.",
                      onConfirm: () => { setMaintenanceMode(true); showToast("Maintenance mode enabled.", "error"); },
                    });
                  } else {
                    setMaintenanceMode(false);
                    showToast("Maintenance mode disabled.");
                  }
                }} />
              </SettingRow>
            </Section>

            <div className="flex justify-end">
              <button onClick={() => handleSave("General")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition shadow-lg shadow-sky-900/30">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        );

      /* ── SECURITY ── */
      case "security":
        return (
          <div className="space-y-5">
            <Section title="Authentication" description="Control how users log in and maintain sessions." icon={Lock} iconColor="rose" delay={0.05}>
              <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin accounts.">
                <Toggle value={twoFactor} onChange={setTwoFactor} />
              </SettingRow>
              <SettingRow label="Session Timeout" description="Minutes before an idle session expires.">
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {["15","30","60","120","240"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </SettingRow>
              <SettingRow label="Max Login Attempts" description="Lock account after this many failed attempts." last>
                <select value={loginAttempts} onChange={(e) => setLoginAttempts(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {["3","5","10"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </SettingRow>
            </Section>

            <Section title="Password Policy" description="Minimum requirements for user passwords." icon={Key} iconColor="amber" delay={0.1}>
              <SettingRow label="Minimum Password Length" description="Characters required for all passwords." last>
                <select value={passwordMinLen} onChange={(e) => setPasswordMinLen(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {["6","8","10","12","16"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </SettingRow>
            </Section>

            <Section title="API Key" description="Used for external system integrations." icon={Key} iconColor="indigo" delay={0.15}>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm ws-mono text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
                  {showApiKey ? apiKey : "•".repeat(36)}
                </div>
                <button onClick={() => setShowApiKey((v) => !v)}
                  className="p-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-slate-400 hover:text-white transition flex-shrink-0">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(apiKey); showToast("API key copied."); }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-slate-400 hover:text-white text-xs font-medium transition flex-shrink-0">
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2">Keep this key confidential. Regenerate if compromised.</p>
            </Section>

            <div className="flex justify-end">
              <button onClick={() => handleSave("Security")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        );

      /* ── NOTIFICATIONS ── */
      case "notifications":
        return (
          <div className="space-y-5">
            <Section title="Notification Channels" description="Choose how the system sends alerts." icon={Bell} iconColor="amber" delay={0.05}>
              <SettingRow label="Email Notifications" description="Send notifications via email.">
                <Toggle value={notifEmail} onChange={setNotifEmail} />
              </SettingRow>
              <SettingRow label="SMS Notifications" description="Send notifications via SMS." last>
                <Toggle value={notifSms} onChange={setNotifSms} />
              </SettingRow>
            </Section>

            <Section title="Event Triggers" description="Select which events send notifications." icon={Bell} iconColor="sky" delay={0.1}>
              <SettingRow label="Log Submitted" description="Alert when a student submits a weekly log.">
                <Toggle value={notifLogSubmit} onChange={setNotifLogSubmit} />
              </SettingRow>
              <SettingRow label="Evaluation Due" description="Remind supervisors before evaluation deadlines.">
                <Toggle value={notifEvalDue} onChange={setNotifEvalDue} />
              </SettingRow>
              <SettingRow label="New Student Assigned" description="Notify supervisors when students are assigned.">
                <Toggle value={notifNewStudent} onChange={setNotifNewStudent} />
              </SettingRow>
              <SettingRow label="Daily Digest" description="Send a daily summary email to admins." last>
                <Toggle value={notifDigest} onChange={setNotifDigest} />
              </SettingRow>
            </Section>

            <Section title="SMTP Configuration" description="Email server settings for outgoing mail." icon={Mail} iconColor="violet" delay={0.15}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">SMTP Host</label>
                    <input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/50 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Port</label>
                    <input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/50 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Sender Email</label>
                  <input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/50 transition" />
                </div>
                <button
                  onClick={() => showToast("Test email sent successfully.")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1523] border border-[#1e3a5f] hover:border-sky-500/40 text-slate-400 hover:text-white text-sm font-medium transition">
                  <Mail className="w-3.5 h-3.5" /> Send Test Email
                </button>
              </div>
            </Section>

            <div className="flex justify-end">
              <button onClick={() => handleSave("Notification")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        );

      /* ── USER ROLES ── */
      case "users":
        return (
          <div className="space-y-5">
            <Section title="Role Management" description="Define roles and their access permissions." icon={UserCog} iconColor="emerald" delay={0.05}>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0b1523] border border-[#1e3a5f] hover:border-slate-600 transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{role.name}</span>
                        {role.permissions.map((p) => (
                          <span key={p} className={`text-xs px-2 py-0.5 rounded-full border ${roleColors[role.color] || roleColors.slate}`}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    {role.name !== "Admin" && (
                      <button
                        onClick={() => setConfirm({
                          title: `Delete "${role.name}"?`,
                          description: "This role will be permanently removed. Users with this role will lose access.",
                          danger: true,
                          onConfirm: () => handleDeleteRole(role.id),
                        })}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add new role */}
              <div className="mt-4 flex gap-2">
                <input
                  placeholder="New role name…"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                />
                <button
                  onClick={handleAddRole}
                  disabled={!newRoleName.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" /> Add Role
                </button>
              </div>
            </Section>

            <Section title="Default Role Assignment" description="Role automatically assigned to new user registrations." icon={Users} iconColor="sky" delay={0.1}>
              <SettingRow label="Default role for new signups" last>
                <select className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {roles.map((r) => <option key={r.id}>{r.name}</option>)}
                </select>
              </SettingRow>
            </Section>

            <div className="flex justify-end">
              <button onClick={() => handleSave("Role")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        );

      /* ── SYSTEM ── */
      case "system":
        return (
          <div className="space-y-5">
            <Section title="Data & Backups" description="Configure automatic backup schedules." icon={Database} iconColor="sky" delay={0.05}>
              <SettingRow label="Backup Frequency" description="How often the system automatically backs up data.">
                <select value={backupFreq} onChange={(e) => setBackupFreq(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </SettingRow>
              <SettingRow label="Log Retention" description="Days to keep activity logs before auto-deletion." last>
                <select value={logRetention} onChange={(e) => setLogRetention(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {["30","60","90","180","365"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </SettingRow>
            </Section>

            <Section title="Storage & Files" description="Control file upload limits." icon={Server} iconColor="violet" delay={0.1}>
              <SettingRow label="Max File Upload Size (MB)" description="Maximum size allowed per uploaded file." last>
                <select value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition">
                  {["2","5","10","20","50"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </SettingRow>
            </Section>

            <Section title="Analytics" description="Usage tracking and reporting settings." icon={Sliders} iconColor="emerald" delay={0.15}>
              <SettingRow label="Enable Analytics" description="Collect anonymised usage data for reporting." last>
                <Toggle value={analyticsEnabled} onChange={setAnalyticsEnabled} />
              </SettingRow>
            </Section>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-[#0d1926] border border-red-500/20 overflow-hidden"
            >
              <div className="flex items-center gap-3.5 px-6 py-4 border-b border-red-500/15 bg-red-500/5">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-red-300">Danger Zone</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Irreversible actions — proceed with caution.</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Export All Data",     desc: "Download a full system data export as CSV.",         icon: Download, action: () => showToast("Export started. You'll receive an email when ready."), danger: false },
                  { label: "Clear Activity Logs", desc: "Permanently delete all activity logs from storage.",  icon: Trash2,   action: () => setConfirm({ title: "Clear All Logs?", description: "All activity logs will be permanently deleted. This cannot be undone.", danger: true, onConfirm: () => showToast("Activity logs cleared.") }), danger: true  },
                  { label: "Reset to Defaults",   desc: "Restore all settings to their factory defaults.",    icon: RotateCcw, action: () => setConfirm({ title: "Reset Settings?", description: "All your customisations will be lost and settings will be restored to defaults.", danger: true, onConfirm: () => showToast("Settings reset to defaults.") }), danger: true  },
                ].map(({ label, desc, icon: Icon, action, danger }) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-2">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <button
                      onClick={action}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition flex-shrink-0 ${
                        danger
                          ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400"
                          : "bg-[#0b1523] hover:bg-[#1a2e47] border-[#1e3a5f] text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-end">
              <button onClick={() => handleSave("System")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-settings { font-family: 'DM Sans', sans-serif; }
        .ws-mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="ws-settings min-h-screen bg-[#07101f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]"
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "linear-gradient(#4a9fd4 1px,transparent 1px),linear-gradient(90deg,#4a9fd4 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex items-center gap-4 px-7 py-6">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <Settings className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Manage portal configuration, security, notifications, and user roles.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Layout: sidebar + content ── */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">

            {/* Sidebar nav */}
            <motion.nav
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="sm:w-52 flex-shrink-0 rounded-2xl bg-[#0d1926] border border-[#1a3050] p-2"
            >
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 last:mb-0 ${
                      active
                        ? "bg-sky-500/15 text-sky-300 border border-sky-500/25"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-sky-400" : ""}`} />
                    {tab.label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-sky-500/60" />}
                  </button>
                );
              })}
            </motion.nav>

            {/* Content area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        description={confirm?.description}
        danger={confirm?.danger}
        onConfirm={confirm?.onConfirm || (() => {})}
        onClose={() => setConfirm(null)}
      />

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

