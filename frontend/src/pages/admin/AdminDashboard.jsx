import AppLayout from "@/components/AppLayout";
import {
  BarChart2,
  Users,
  Briefcase,
  Bell,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { mockUsers, mockPlacements, mockEvaluations } from "@/data/mockData";

export default function AdminDashboard() {
  const userCount = mockUsers.length;
  const placementCount = mockPlacements.length;
  const evaluationCount = mockEvaluations.length;
  const activePlacements = mockPlacements.filter(
    (p) => p.status === "active",
  ).length;
  const pendingEvaluations = mockEvaluations.filter((e) => !e.locked).length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
        {/* Glassy Header */}
        <div className="mb-8 rounded-3xl overflow-hidden shadow-xl bg-linear-to-br from-[#0f172a]/90 via-[#334155]/80 to-[#0ea5e9]/80 backdrop-blur-xl border border-blue-900/30 px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 className="w-8 h-8 text-cyan-300 drop-shadow" />
              <span className="text-lg font-bold tracking-widest text-cyan-100 uppercase bg-cyan-900/30 px-3 py-1 rounded-xl shadow">
                Admin Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg font-mono">
              System Overview
            </h1>
            <p className="mt-2 text-cyan-100/90 text-lg font-medium max-w-xl">
              Manage users, placements, evaluations, and view system analytics.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
            <Users className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-2xl font-bold text-cyan-100">
              {userCount}
            </span>
            <span className="text-cyan-300 text-sm mt-1">Total Users</span>
          </div>
          <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
            <Briefcase className="w-8 h-8 text-emerald-400 mb-2" />
            <span className="text-2xl font-bold text-cyan-100">
              {placementCount}
            </span>
            <span className="text-cyan-300 text-sm mt-1">Placements</span>
          </div>
          <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
            <CheckCircle2 className="w-8 h-8 text-yellow-400 mb-2" />
            <span className="text-2xl font-bold text-cyan-100">
              {evaluationCount}
            </span>
            <span className="text-cyan-300 text-sm mt-1">Evaluations</span>
          </div>
          <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
            <Bell className="w-8 h-8 text-pink-400 mb-2" />
            <span className="text-2xl font-bold text-cyan-100">
              {pendingEvaluations}
            </span>
            <span className="text-cyan-300 text-sm mt-1">
              Pending Evaluations
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a
            href="/admin/AdminUsers"
            className="rounded-xl bg-cyan-800/80 hover:bg-cyan-700/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg"
          >
            <Users className="w-6 h-6" /> Manage Users
          </a>
          <a
            href="/admin/AdminPlacementManagement"
            className="rounded-xl bg-emerald-800/80 hover:bg-emerald-700/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg"
          >
            <Briefcase className="w-6 h-6" /> Manage Placements
          </a>
          <a
            href="/admin/AdminEvaluations"
            className="rounded-xl bg-yellow-700/80 hover:bg-yellow-600/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg"
          >
            <CheckCircle2 className="w-6 h-6" /> Manage Evaluations
          </a>
        </div>

        {/* System Overview */}
        <div className="rounded-3xl bg-[#0d1926] border border-cyan-900/30 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-cyan-200 mb-4">
            System Activity
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-cyan-100 text-base">
            <li>
              Active Placements:{" "}
              <span className="font-bold text-emerald-400">
                {activePlacements}
              </span>
            </li>
            <li>
              Pending Evaluations:{" "}
              <span className="font-bold text-yellow-400">
                {pendingEvaluations}
              </span>
            </li>
            <li>
              Admins:{" "}
              <span className="font-bold text-pink-400">
                {mockUsers.filter((u) => u.role === "admin").length}
              </span>
            </li>
            <li>
              Supervisors:{" "}
              <span className="font-bold text-cyan-400">
                {mockUsers.filter((u) => u.role.includes("supervisor")).length}
              </span>
            </li>
            <li>
              Students:{" "}
              <span className="font-bold text-blue-400">
                {mockUsers.filter((u) => u.role === "student").length}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
