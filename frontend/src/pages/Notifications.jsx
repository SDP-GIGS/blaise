import AppLayout from "@/components/AppLayout";
import { Bell } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "Weekly Logbook Submitted",
    message: "John Student has submitted their weekly logbook for review.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Evaluation Due",
    message: "You have an evaluation due for Jane Student.",
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

const Notifications = () => (
  <AppLayout>
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-cyan-600" />
        <h1 className="text-2xl font-bold text-cyan-700">Notifications</h1>
      </div>
      <div className="space-y-4">
        {mockNotifications.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            No notifications yet.
          </div>
        ) : (
          mockNotifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl p-4 shadow bg-white/90 dark:bg-gray-900/80 border-l-4 ${
                n.read
                  ? "border-gray-200 dark:border-gray-700"
                  : "border-cyan-400 dark:border-cyan-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {n.title}
                </div>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-200 mt-1">
                {n.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </AppLayout>
);

export default Notifications;








