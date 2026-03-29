import { useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockLogs, mockPlacements, statusColors } from "../../data/mockData";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const StudentDashboard = () => {
  const demoStudent = { id: 1, name: "John Student" };
  const user = demoStudent;

  const { logs, placement, approvedLogs, totalHours, pendingLogs, hoursChart } =
    useMemo(() => {
      const studentLogs = mockLogs.filter((l) => l.studentId === user.id);
      const studentPlacement = mockPlacements.find(
        (p) => p.studentId === user.id,
      );
      const approved = studentLogs.filter(
        (l) => l.status === "approved",
      ).length;
      const total = studentLogs.reduce((sum, l) => sum + l.hoursWorked, 0);
      const pending = studentLogs.filter(
        (l) => l.status === "submitted",
      ).length;
      const chart = studentLogs.map((l) => ({
        week: `W${l.weekNumber}`,
        hours: l.hoursWorked,
      }));
      return {
        logs: studentLogs,
        placement: studentPlacement,
        approvedLogs: approved,
        totalHours: total,
        pendingLogs: pending,
        hoursChart: chart,
      };
    }, []);

  const stats = [
    {
      icon: FileText,
      label: "Total Logs",
      value: logs.length,
      change: "+2 this week",
    },
    {
      icon: TrendingUp,
      label: "Approved",
      value: approvedLogs,
      change: `${logs.length > 0 ? Math.round((approvedLogs / logs.length) * 100) : 0}% rate`,
    },
    {
      icon: Clock,
      label: "Total Hours",
      value: totalHours,
      change: "avg 39h/week",
    },
    {
      icon: CalendarDays,
      label: "Pending Review",
      value: pendingLogs,
      change: "awaiting supervisor",
    },
  ];

  // Demo notification: next log deadline and feedback
  const nextDeadline =
    logs.length > 0 ? logs[logs.length - 1].endDate : "2026-01-09";
  const feedbackMsg =
    pendingLogs > 0
      ? `You have ${pendingLogs} log(s) pending supervisor review.`
      : "All logs reviewed.";

  return (
    <AppLayout>
      {/* Notification Bar */}
      <div className="w-full flex justify-center">
        <div className="max-w-3xl w-full mt-4 mb-2 px-4">
          <div className="rounded-xl bg-linear-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] px-6 py-3 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm font-semibold">
            <span>
              Next log deadline:{" "}
              <span className="font-bold">{nextDeadline}</span>
            </span>
            <span>{feedbackMsg}</span>
          </div>
        </div>
      </div>
      <div className="relative min-h-screen w-full bg-linear-to-br from-[#0f2027] via-[#2c5364] to-[#232526] py-12 px-2 flex flex-col items-center">
        {/* Glassy Card Container */}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
          {/* Header */}
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
                  Fintech Student Dashboard
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-2">
                Welcome,{" "}
                <span className="bg-linear-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0] || "Student"}
                </span>
              </h1>
              <p className="text-lg text-white/70 font-medium">
                Your internship performance at a glance
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-block rounded-full bg-linear-to-r from-yellow-400 via-emerald-400 to-cyan-400 px-4 py-1 text-xs font-bold text-[#232526] shadow">
                2026 Cohort
              </span>
              <span className="text-xs text-white/60">
                ILES Internship System
              </span>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.09 + 0.1 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-6 flex flex-col gap-2 hover:scale-[1.03] transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-linear-to-br from-yellow-300 via-emerald-300 to-cyan-300 text-[#232526] shadow-lg">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-yellow-200/60" />
                </div>
                <p className="text-3xl font-extrabold text-white drop-shadow">
                  {s.value}
                </p>
                <p className="text-sm text-white/80 font-medium">{s.label}</p>
                <p className="text-xs text-emerald-200 font-semibold">
                  {s.change}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chart & Placement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
            >
              <h2 className="text-xl font-bold text-white mb-1">Hours Trend</h2>
              <p className="text-xs text-white/70 mb-4">
                Weekly hours logged over time
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hoursChart}>
                  <defs>
                    <linearGradient
                      id="hoursGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#facc15"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "#e0e7ef" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#232526",
                      border: "1px solid #facc15",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#facc15"
                    strokeWidth={3}
                    fill="url(#hoursGradient)"
                    dot={{ r: 5, fill: "#facc15", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {placement && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
              >
                <h2 className="text-xl font-bold text-white mb-1">
                  Current Placement
                </h2>
                <p className="text-xs text-white/70 mb-4">
                  Active internship assignment
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-white/50">Company</p>
                    <p className="font-semibold text-white/90">
                      {placement.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Department</p>
                    <p className="font-semibold text-white/90">
                      {placement.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Duration</p>
                    <p className="font-semibold text-white/90">
                      {placement.startDate} — {placement.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}
                    >
                      {placement.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Recent Logs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl p-7"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Recent Log Entries
                </h2>
                <p className="text-xs text-white/70">
                  Your latest weekly submissions
                </p>
              </div>
              <span className="inline-block bg-linear-to-r from-yellow-400 via-emerald-400 to-cyan-400 text-[#232526] px-3 py-1 rounded-full text-xs font-bold shadow">
                {logs.length} total
              </span>
            </div>
            <div className="space-y-3">
              {logs.length === 0 ? (
                <p className="text-white/60 text-sm">No log entries yet.</p>
              ) : (
                logs.slice(0, 5).map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    className="flex items-center justify-between bg-white/10 backdrop-blur rounded-xl px-5 py-4 border border-white/20 shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-br from-yellow-300 via-emerald-300 to-cyan-300 text-[#232526] rounded-full px-3 py-1 text-xs font-bold shadow">
                        <span>W{log.weekNumber}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white/90">
                          Week {log.weekNumber}
                        </p>
                        <p className="text-xs text-white/60">
                          {log.startDate} — {log.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-white/90">
                        {log.hoursWorked}h
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
        {/* CTA Buttons at Bottom */}
        <div className="w-full flex justify-center gap-3 mt-12 mb-2">
          <a
            href="/student/logbook"
            className="px-4 py-2 text-sm rounded bg-yellow-100 text-[#232526] border border-yellow-300 hover:bg-yellow-200 transition font-bold shadow"
            style={{ textShadow: "0 1px 2px #fff, 0 0px 1px #facc15" }}
          >
            Log New Week
          </a>
          <a
            href="/student/placement"
            className="px-4 py-2 text-sm rounded bg-emerald-50 text-[#232526] border border-emerald-200 hover:bg-emerald-100 transition font-bold shadow"
            style={{ textShadow: "0 1px 2px #fff, 0 0px 1px #34d399" }}
          >
            View Placement
          </a>
          <a
            href="/student/scores"
            className="px-4 py-2 text-sm rounded bg-cyan-50 text-[#232526] border border-cyan-200 hover:bg-cyan-100 transition font-bold shadow"
            style={{ textShadow: "0 1px 2px #fff, 0 0px 1px #22d3ee" }}
          >
            View Scores
          </a>
        </div>
      </div>
      {/* Ambient Glow Effects */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[-10%] left-[-10%] w-100 h-100 bg-linear-to-br from-yellow-400 via-emerald-400 to-cyan-400 opacity-30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-linear-to-br from-cyan-400 via-emerald-400 to-yellow-400 opacity-20 blur-[120px] rounded-full" />
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

