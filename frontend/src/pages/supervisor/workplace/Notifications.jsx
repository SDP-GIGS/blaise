import AppLayout from "@/components/AppLayout";
import { Bell } from "lucide-react";

const WorkplaceNotifications = () => (
  <AppLayout>
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell className="w-6 h-6 text-yellow-500" /> Notifications
      </h1>
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-6">
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          View important alerts and notifications related to your students and
          log reviews.
        </p>
        {/* Notification list goes here */}
      </div>
    </div>
  </AppLayout>
);

export default WorkplaceNotifications;
