import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { internshipService } from "@/services/internshipService";

const statusStyles = {
  new: "bg-slate-500/70 text-white",
  active: "bg-green-500/80 text-white",
  completed: "bg-cyan-400/80 text-[#232526]",
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [logsData, placementsData] = await Promise.all([
          internshipService.listLogs(),
          internshipService.listPlacements(),
        ]);
        setLogs(logsData);
        setPlacements(placementsData);
      } catch (loadError) {
        setError(loadError?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { approvedLogs, pendingLogs, submittedLogs, chartData, activePlacement } =
    useMemo(() => {
      const approved = logs.filter((log) => log.status === "approved").length;
      const pending = logs.filter((log) => ["submitted", "reviewed"].includes(log.status)).length;
      const submitted = logs.length;
      const chart = logs
        .slice()
        .sort((a, b) => a.week_number - b.week_number)
        .map((log) => ({ week: `W${log.week_number}`, entries: 1 }));

      const placement =
        placements.find((item) => item.status === "active") || placements[0] || null;

      return {
        approvedLogs: approved,
        pendingLogs: pending,
        submittedLogs: submitted,
        chartData: chart,
        activePlacement: placement,
      };
    }, [logs, placements]);

  const stats = [
    {
      icon: FileText,
      label: "Total Logs",
      value: logs.length,
      change: `${submittedLogs} submitted`,
    },
    {
      icon: TrendingUp,
      label: "Approved",
      value: approvedLogs,
      change: `${logs.length > 0 ? Math.round((approvedLogs / logs.length) * 100) : 0}% rate`,
    },
    {
      icon: CalendarDays,
      label: "Pending Review",
      value: pendingLogs,
      change: "awaiting supervisor",
    },
    {
      icon: Zap,
      label: "Placements",
      value: placements.length,
      change: activePlacement ? activePlacement.status : "none",
    },
  ];

  return (
    <AppLayout>
      <div className="relative min-h-screen w-full bg-linear-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-yellow-400 drop-shadow" />
                <span className="text-lg font-bold tracking-widest text-yellow-300 uppercase drop-shadow">
                  Student Dashboard
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
                Welcome, {user?.full_name?.split(" ")[0] || "Student"}
              </h1>
              <p className="text-lg text-white/70 font-medium">
                Your internship progress from live backend data
              </p>
            </div>
          </motion.div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl bg-white/10 border border-white/20 p-8 text-white/80">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.09 + 0.1 }}
                    className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-6 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-linear-to-br from-yellow-300 via-emerald-300 to-cyan-300 text-[#232526] shadow-lg">
                        <s.icon className="w-7 h-7" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-yellow-200/60" />
                    </div>
                    <p className="text-3xl font-extrabold text-white drop-shadow">{s.value}</p>
                    <p className="text-sm text-white/80 font-medium">{s.label}</p>
                    <p className="text-xs text-emerald-200 font-semibold">{s.change}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
                >
                  <h2 className="text-xl font-bold text-white mb-1">Submission Trend</h2>
                  <p className="text-xs text-white/70 mb-4">Weeks where logs were submitted</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="entriesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#facc15" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#e0e7ef" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#232526",
                          border: "1px solid #facc15",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      />
                      <Area type="stepAfter" dataKey="entries" stroke="#facc15" strokeWidth={3} fill="url(#entriesGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
                >
                  <h2 className="text-xl font-bold text-white mb-1">Current Placement</h2>
                  <p className="text-xs text-white/70 mb-4">Active internship assignment</p>
                  {activePlacement ? (
                    <div className="space-y-3 text-white/90">
                      <p><span className="text-white/60">Company:</span> {activePlacement.company}</p>
                      <p><span className="text-white/60">Duration:</span>{activePlacement.start_date} - {activePlacement.end_date}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[activePlacement.status] || statusStyles.new}`}>
                        {activePlacement.status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-white/70">No placement assigned yet.</p>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

