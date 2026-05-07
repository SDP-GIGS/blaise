import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { BarChart2, Users, Briefcase, Bell, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiClient.get('/dashboard/');
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-10 px-2 sm:px-6">
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

        {error && (
          <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-cyan-100 text-center py-12">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
                <Users className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-2xl font-bold text-cyan-100">{stats?.total_students || 0}</span>
                <span className="text-cyan-300 text-sm mt-1">Students</span>
              </div>
              <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
                <Briefcase className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-2xl font-bold text-cyan-100">{stats?.total_placements || 0}</span>
                <span className="text-cyan-300 text-sm mt-1">Placements</span>
              </div>
              <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
                <CheckCircle2 className="w-8 h-8 text-yellow-400 mb-2" />
                <span className="text-2xl font-bold text-cyan-100">{stats?.total_logs || 0}</span>
                <span className="text-cyan-300 text-sm mt-1">Total Logs</span>
              </div>
              <div className="rounded-2xl bg-[#0d1926] border border-cyan-900/30 p-6 flex flex-col items-center shadow">
                <Bell className="w-8 h-8 text-pink-400 mb-2" />
                <span className="text-2xl font-bold text-cyan-100">{stats?.pending_reviews || 0}</span>
                <span className="text-cyan-300 text-sm mt-1">Pending Reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Link to="/admin/users" className="rounded-xl bg-cyan-800/80 hover:bg-cyan-700/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg">
                <Users className="w-6 h-6" /> Manage Users
              </Link>
              <Link to="/admin/placements" className="rounded-xl bg-emerald-800/80 hover:bg-emerald-700/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg">
                <Briefcase className="w-6 h-6" /> Manage Placements
              </Link>
              <Link to="/admin/evaluations" className="rounded-xl bg-yellow-700/80 hover:bg-yellow-600/90 transition text-white font-semibold flex items-center gap-3 px-6 py-5 shadow-lg">
                <CheckCircle2 className="w-6 h-6" /> Manage Evaluations
              </Link>
            </div>

            <div className="rounded-3xl bg-[#0d1926] border border-cyan-900/30 p-8 shadow-xl">
              <h2 className="text-xl font-bold text-cyan-200 mb-4">System Activity</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-cyan-100 text-base">
                <li>Total Students: <span className="font-bold text-blue-400">{stats?.total_students || 0}</span></li>
                <li>Total Supervisors: <span className="font-bold text-cyan-400">{stats?.total_supervisors || 0}</span></li>
                <li>Total Placements: <span className="font-bold text-emerald-400">{stats?.total_placements || 0}</span></li>
                <li>Pending Reviews: <span className="font-bold text-yellow-400">{stats?.pending_reviews || 0}</span></li>
                <li>Total Logs: <span className="font-bold text-pink-400">{stats?.total_logs || 0}</span></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}