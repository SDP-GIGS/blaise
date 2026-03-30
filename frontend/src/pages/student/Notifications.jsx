import AppLayout from "@/components/AppLayout";
import { Bell } from "lucide-react";



const mockStudentNotifications = [
  {
    id: 1,
    title: "Logbook Reviewed",
    message:
      "Your weekly logbook for Week 2 has been reviewed by your supervisor.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 2,
    title: "Placement Approved",
    message:
      "Your internship placement at TechNova Solutions has been approved.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 3,
    title: "Evaluation Score Released",
    message: "Your workplace evaluation score is now available.",
    time: "3 days ago",
    read: true,
  },
];

const StudentNotifications = () => (
  <AppLayout>
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-yellow-500" />
        <h1 className="text-2xl font-bold text-yellow-700">Notifications</h1>
      </div>
      <div className="space-y-4">
        {mockStudentNotifications.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            No notifications yet.
          </div>
        ) : (
          mockStudentNotifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl p-4 shadow bg-white/90 dark:bg-gray-900/80 border-l-4 ${
                n.read
                  ? "border-gray-200 dark:border-gray-700"
                  : "border-yellow-400 dark:border-yellow-600"
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

export default StudentNotifications;

