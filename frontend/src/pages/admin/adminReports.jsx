import AppLayout from "@/components/AppLayout";
import {
  mockLogs,
  mockPlacements,
  mockEvaluations,
  mockUsers,
} from "@/data/mockData";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const AdminReports = () => {
  const hoursData = mockUsers
    .filter((u) => u.role === "student")
    .map((u) => ({
      name: u.name.split(" ")[0],
      hours: mockLogs
        .filter((l) => l.studentId === u.id)
        .reduce((sum, l) => sum + l.hoursWorked, 0),
    }))
    .filter((d) => d.hours > 0);

  const placementStatus = [
    {
      name: "Active",
      value: mockPlacements.filter((p) => p.status === "active").length,
      color: "hsl(160 84% 39%)",
    },
    {
      name: "Completed",
      value: mockPlacements.filter((p) => p.status === "completed").length,
      color: "hsl(220 15% 55%)",
    },
    {
      name: "Pending",
      value: mockPlacements.filter((p) => p.status === "pending").length,
      color: "hsl(40 80% 50%)",
    },
  ];

  const weeklyTrend = Array.from({ length: 4 }, (_, i) => ({
    week: `Week ${i + 1}`,
    logs: mockLogs.filter((l) => l.weekNumber === i + 1).length,
    hours: mockLogs
      .filter((l) => l.weekNumber === i + 1)
      .reduce((s, l) => s + l.hoursWorked, 0),
  }));

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(222 47% 9%)",
      border: "1px solid hsl(220 30% 16%)",
      borderRadius: "12px",
      color: "hsl(210 40% 96%)",
      fontSize: "12px",
      boxShadow: "0 8px 32px hsl(0 0% 0% / 0.35)",
    },
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-[0.15em]">
              Reports
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 text-base">
            Aggregated data and visualizations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {/* Hours per student */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-6 flex flex-col"
          >
            <h3 className="text-base font-bold font-display text-foreground mb-1">
              Hours per Student
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Total logged hours comparison
            </p>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220 30% 14%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="hours"
                    fill="hsl(45 93% 58%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Placement status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-premium p-6 flex flex-col"
          >
            <h3 className="text-base font-bold font-display text-foreground mb-1">
              Placement Status
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Distribution across states
            </p>
            <div className="flex-1 min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {placementStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              {placementStatus.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium p-6 lg:col-span-2 flex flex-col"
          >
            <h3 className="text-base font-bold font-display text-foreground mb-1">
              Weekly Activity Trend
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Logs and hours per week
            </p>
            <div className="flex-1 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="logsGrad" x1="0" y1="0" x2="0" y2="1">
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
                    <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(217 91% 60%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(217 91% 60%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220 30% 14%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="logs"
                    stroke="hsl(45 93% 58%)"
                    strokeWidth={2.5}
                    fill="url(#logsGrad)"
                    dot={{ r: 4, fill: "hsl(45 93% 58%)", strokeWidth: 0 }}
                    name="Log Entries"
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2.5}
                    fill="url(#hoursGrad)"
                    dot={{ r: 4, fill: "hsl(217 91% 60%)", strokeWidth: 0 }}
                    name="Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium p-6 sm:p-8 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold font-display text-foreground mb-6">
              Quick Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { label: "Total Users", value: mockUsers.length },
                { label: "Placements", value: mockPlacements.length },
                { label: "Log Entries", value: mockLogs.length },
                { label: "Evaluations", value: mockEvaluations.length },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-gradient-gold font-display">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdminReports;
