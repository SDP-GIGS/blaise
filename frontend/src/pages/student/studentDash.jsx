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
  const { user } = useAuth();

  const { logs, placement, approvedLogs, totalHours, pendingLogs, hoursChart } =
    useMemo(() => {
      const studentLogs = mockLogs.filter((l) => l.studentId === user?.id);
      const studentPlacement = mockPlacements.find(
        (p) => p.studentId === user?.id,
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
    }, [user]);

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

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back,{" "}
              <span className="text-emerald-700 font-bold">
                {user?.name?.split(" ")[0] || "Student"}
              </span>
            </h1>
            <p className="text-gray-500 text-base">
              Here's your internship performance overview
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <s.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xs text-emerald-700 font-semibold">
                {s.change}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow p-6 border border-gray-100"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Hours Trend
            </h2>
            <p className="text-xs text-gray-500 mb-4">
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
                      stopColor="hsl(45 93% 58%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(45 93% 58%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222 47% 9%)",
                    border: "1px solid hsl(220 30% 16%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 96%)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(45 93% 58%)"
                  strokeWidth={2.5}
                  fill="url(#hoursGradient)"
                  dot={{
                    r: 4,
                    fill: "hsl(45 93% 58%)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {placement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-xl shadow p-6 border border-gray-100"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Current Placement
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Active internship assignment
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400">Company</p>
                  <p className="font-semibold text-gray-800">
                    {placement.company}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Department</p>
                  <p className="font-semibold text-gray-800">
                    {placement.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-800">
                    {placement.startDate} — {placement.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Recent Log Entries
              </h2>
              <p className="text-xs text-gray-500">
                Your latest weekly submissions
              </p>
            </div>
            <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              {logs.length} total
            </span>
          </div>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-gray-400 text-sm">No log entries yet.</p>
            ) : (
              logs.slice(0, 5).map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-1 text-xs font-bold">
                      <span>W{log.weekNumber}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Week {log.weekNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {log.startDate} — {log.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-700">
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
    </AppLayout>
  );
};

export default StudentDashboard;
