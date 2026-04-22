import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { Bell, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const mockAdminNotifications = [
  {
    id: 1,
    title: "New Placement Created",
    message: "A new internship placement has been created for student John Doe at TechCorp.",
    type: "info",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Evaluation Submitted",
    message: "Workplace supervisor has submitted evaluation for Jane Smith.",
    type: "success",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Low Participation Alert",
    message: "Student Alex Johnson has submitted only 2 logbooks this semester.",
    type: "warning",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    title: "System Report Generated",
    message: "Monthly system report has been generated. Available for download.",
    type: "success",
    time: "3 days ago",
    read: true,
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertCircle className="w-5 h-5 text-amber-400" />;
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    case "info":
    default:
      return <Bell className="w-5 h-5 text-cyan-400" />;
  }
};

const getNotificationStyle = (type, read) => {
  const baseStyle = `rounded-xl p-4 border-l-4 transition-all ${
    read ? "bg-white/5 opacity-70" : "bg-white/10 shadow-lg"
  }`;
  
  switch (type) {
    case "warning":
      return `${baseStyle} border-l-amber-400`;
    case "success":
      return `${baseStyle} border-l-emerald-400`;
    case "info":
    default:
      return `${baseStyle} border-l-cyan-400`;
  }
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        // TODO: Replace with real API call when endpoint is available
        // const data = await apiClient.get('/notifications/');
        // setNotifications(Array.isArray(data) ? data : []);
        
        // For now, use mock data
        setNotifications(mockAdminNotifications);
        setError("");
      } catch (err) {
        setError(err?.message || "Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a4a] to-[#0f2d4d] py-10 px-2 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="rounded-3xl overflow-hidden shadow-xl bg-linear-to-br from-[#0f172a]/90 via-[#334155]/80 to-[#0ea5e9]/80 backdrop-blur-xl border border-blue-900/30 px-8 py-7 flex items-center gap-3">
            <Bell className="w-8 h-8 text-cyan-300 drop-shadow" />
            <div>
              <span className="text-lg font-bold tracking-widest text-cyan-100 uppercase bg-cyan-900/30 px-3 py-1 rounded-xl shadow">
                Admin Notifications
              </span>
              <p className="text-sm text-cyan-100/70 mt-2">System alerts and activity updates</p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-spin" />
              <p className="text-white/60">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-12 flex flex-col items-center text-center">
              <Bell className="w-8 h-8 text-cyan-400/50 mb-3" />
              <h2 className="text-xl font-bold text-white/80 mb-1">No Notifications</h2>
              <p className="text-white/50">All caught up! No alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={getNotificationStyle(notification.type, notification.read)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${notification.read ? "text-white/60" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-white/40 flex-shrink-0">{notification.time}</span>
                      </div>
                      <p className={`text-sm ${notification.read ? "text-white/40" : "text-white/70"}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
