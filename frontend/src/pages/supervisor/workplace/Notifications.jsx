import AppLayout from "@/components/AppLayout";
import { Bell, CheckCircle2, AlertCircle, Info, User } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers, mockPlacements } from "@/data/mockData";

// Example mock notifications for workplace supervisor
const mockNotifications = [
  {
    id: 1,
    type: "log_review",
    title: "New Log Submitted",
    message: "John Doe has submitted a new weekly log for your review.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "evaluation_due",
    title: "Evaluation Due",
    message: "You have 2 pending student evaluations this week.",
    time: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "System Update",
    message: "A new feature has been added to the dashboard.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 4,
    type: "placement",
    title: "New Placement Assigned",
    message: "Jane Smith has been assigned to your supervision.",
    time: "5 days ago",
    read: true,
  },
];

const iconMap = {
  log_review: <Bell className="w-6 h-6 text-cyan-400" />,
  evaluation_due: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
  info: <Info className="w-6 h-6 text-blue-400" />,
  placement: <User className="w-6 h-6 text-yellow-400" />,
  alert: <AlertCircle className="w-6 h-6 text-red-400" />,
};

export default function WorkplaceNotifications() {
  const { user } = useAuth();
  // In a real app, filter notifications for this supervisor
  const notifications = useMemo(() => mockNotifications, []);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto py-10 px-2 sm:px-6">
        {/* Glassy Header */}
        <div className="mb-8 rounded-3xl overflow-hidden shadow-xl bg-linear-to-br from-[#0f172a]/90 via-[#334155]/80 to-[#0ea5e9]/80 backdrop-blur-xl border border-blue-900/30 px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-cyan-300 drop-shadow" />
              <span className="text-lg font-bold tracking-widest text-cyan-100 uppercase bg-cyan-900/30 px-3 py-1 rounded-xl shadow">
                Notifications
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg font-mono">
              Workplace Supervisor Alerts
            </h1>
            <p className="mt-2 text-cyan-100/90 text-lg font-medium max-w-xl">
              Stay up to date with student logs, evaluations, placements, and
              system updates.
            </p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-5">
          {notifications.length === 0 ? (
            <div className="text-center text-cyan-200 py-10 text-lg">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-2xl p-5 shadow border border-cyan-900/20 bg-[#0d1926] transition-all ${
                  n.read ? "opacity-70" : "bg-cyan-900/10 border-cyan-700/30"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {iconMap[n.type] || (
                    <Bell className="w-6 h-6 text-cyan-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-100 text-base">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-600/80 text-xs text-white font-semibold">
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-cyan-200 text-sm mt-1">{n.message}</div>
                  <div className="text-xs text-cyan-400 mt-2">{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
