import AppLayout from "@/components/AppLayout";
import { Bell } from "lucide-react";

export default function AdminNotifications() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-10 px-2 sm:px-6">
        <div className="mb-8 rounded-3xl overflow-hidden shadow-xl bg-linear-to-br from-[#0f172a]/90 via-[#334155]/80 to-[#0ea5e9]/80 backdrop-blur-xl border border-blue-900/30 px-8 py-7 flex items-center gap-3">
          <Bell className="w-8 h-8 text-cyan-300 drop-shadow" />
          <span className="text-lg font-bold tracking-widest text-cyan-100 uppercase bg-cyan-900/30 px-3 py-1 rounded-xl shadow">
            Admin Notifications
          </span>
        </div>
        {/* Admin alerts, system notifications go here */}
      </div>
    </AppLayout>
  );
}
