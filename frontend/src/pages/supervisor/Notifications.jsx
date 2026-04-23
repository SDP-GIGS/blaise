import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { Bell, AlertCircle, Loader } from "lucide-react";

const SUPERVISOR_NOTIFICATIONS_KEY = "supervisor_notifications_unread";

const mockNotifications = [
  {
    id: 1,
    title: "Weekly Logbook Submitted",
    message: "A student has submitted their weekly logbook for review.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Evaluation Due",
    message: "You have an evaluation due for a student.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    title: "Placement Approved",
    message: "A new placement has been approved for your student.",
    time: "3 days ago",
    read: true,
  },
];

const getNotificationTone = (type) => {
  switch (type) {
    case "success":
      return {
        container: "border-emerald-300 bg-emerald-50",
        title: "text-emerald-950",
        message: "text-emerald-900/80",
        time: "text-emerald-700",
      };
    case "warning":
      return {
        container: "border-amber-300 bg-amber-50",
        title: "text-amber-950",
        message: "text-amber-900/80",
        time: "text-amber-700",
      };
    default:
      return {
        container: "border-cyan-300 bg-cyan-50",
        title: "text-cyan-950",
        message: "text-cyan-900/80",
        time: "text-cyan-700",
      };
  }
};

const SupervisorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiClient.get("/notifications/");
        setNotifications(Array.isArray(data) ? data : mockNotifications);
      } catch (err) {
        setNotifications(mockNotifications);
        setError(
          err?.status === 404
            ? "Notifications endpoint is not available yet, so sample notifications are shown instead."
            : "Failed to load notifications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    localStorage.setItem(SUPERVISOR_NOTIFICATIONS_KEY, "0");
  }, []);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-cyan-700">Notifications</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 flex items-start gap-2 text-sm text-amber-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-cyan-600 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => {
              const tone = getNotificationTone(n.type);

              return (
              <div
                key={n.id}
                className={`rounded-xl p-4 shadow-sm border-l-4 border ${tone.container} ${n.read ? "opacity-80" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`font-semibold ${tone.title}`}>
                    {n.title}
                  </div>
                  <span className={`text-xs ${tone.time}`}>{n.time}</span>
                </div>
                <div className={`mt-1 ${tone.message}`}>
                  {n.message}
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SupervisorNotifications;
