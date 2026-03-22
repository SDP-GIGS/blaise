import AppLayout from "@/components/AppLayout";
import {
  mockLogs,
  mockPlacements,
  mockEvaluations,
  mockUsers,
} from "@/data/mockData";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  BarChart3, Download, TrendingUp, Users, ClipboardList,
  Award, Briefcase, Calendar, Filter, RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart,
  Area, Legend,
} from "recharts";

/* ─────────────────────────────────────────────
   Chart theme
───────────────────────────────────────────── */
const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0d1926",
    border: "1px solid #1e3a5f",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontSize: "12px",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  labelStyle: { color: "#94a3b8", marginBottom: 4 },
  itemStyle:  { color: "#e2e8f0" },
  cursor:     { fill: "rgba(56,189,248,0.05)" },
};

const AXIS_PROPS = {
  tick:     { fontSize: 11, fill: "#475569", fontFamily: "'DM Mono', monospace" },
  axisLine: false,
  tickLine: false,
};

const GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke:   "#1a3050",
  vertical: false,
};

const COLORS = {
  sky:     "#38bdf8",
  emerald: "#34d399",
  amber:   "#fbbf24",
  violet:  "#a78bfa",
  rose:    "#fb7185",
  slate:   "#64748b",
};

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => {
  const cfg = {
    sky:     "bg-sky-500/10     border-sky-500/20     text-sky-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber:   "bg-amber-500/10   border-amber-500/20   text-amber-400",
    violet:  "bg-violet-500/10  border-violet-500/20  text-violet-400",
  };
  const [bg, border, text] = cfg[color].split(" ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl ${bg} border ${border} p-5 flex items-center gap-4`}
    >
      <div className={`p-2.5 rounded-xl ${bg} border ${border} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${text}`} />
      </div>
      <div>
        <p className={`text-2xl font-bold ws-mono ${text}`}>{value}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Chart card wrapper
───────────────────────────────────────────── */
const ChartCard = ({ title, description, children, className = "", delay = 0, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden ${className}`}
  >
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523]">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Custom pie label
───────────────────────────────────────────── */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600} fontFamily="'DM Mono', monospace">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
const AdminReports = () => {
  const [weekRange, setWeekRange] = useState("all");

  /* ── Data derivations ── */
  const students = mockUsers.filter((u) => u.role === "student");

  const hoursData = useMemo(() =>
    students
      .map((u) => ({
        name:  u.name.split(" ")[0],
        hours: mockLogs.filter((l) => l.studentId === u.id).reduce((s, l) => s + l.hoursWorked, 0),
        logs:  mockLogs.filter((l) => l.studentId === u.id).length,
      }))
      .filter((d) => d.hours > 0)
      .sort((a, b) => b.hours - a.hours),
  []);

  const placementStatus = useMemo(() => [
    { name: "Active",    value: mockPlacements.filter((p) => p.status === "active").length,    color: COLORS.emerald },
    { name: "Completed", value: mockPlacements.filter((p) => p.status === "completed").length, color: COLORS.sky     },
    { name: "Pending",   value: mockPlacements.filter((p) => p.status === "pending").length,   color: COLORS.amber   },
  ], []);

  const logStatusData = useMemo(() => [
    { name: "Submitted", value: mockLogs.filter((l) => l.status === "submitted").length, color: COLORS.amber   },
    { name: "Reviewed",  value: mockLogs.filter((l) => l.status === "reviewed").length,  color: COLORS.sky     },
    { name: "Approved",  value: mockLogs.filter((l) => l.status === "approved").length,  color: COLORS.emerald },
  ], []);

  const maxWeek = useMemo(() => Math.max(...mockLogs.map((l) => l.weekNumber), 4), []);

  const weeklyTrend = useMemo(() => {
    const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);
    const filtered = weekRange === "all" ? weeks : weeks.slice(-Number(weekRange));
    return filtered.map((w) => {
      const wLogs = mockLogs.filter((l) => l.weekNumber === w);
      return {
        week:  `W${w}`,
        logs:  wLogs.length,
        hours: wLogs.reduce((s, l) => s + l.hoursWorked, 0),
        approved: wLogs.filter((l) => l.status === "approved").length,
      };
    });
  }, [maxWeek, weekRange]);

  const evalScores = useMemo(() =>
    mockEvaluations
      ?.filter((e) => e.type === "workplace" && e.totalScore != null)
      .map((e) => {
        const user = mockUsers.find((u) => u.id === e.studentId);
        return {
          name:  user?.name.split(" ")[0] ?? `#${e.studentId}`,
          score: e.totalScore,
          max:   e.maxTotal ?? 100,
          pct:   e.maxTotal ? Math.round((e.totalScore / e.maxTotal) * 100) : e.totalScore,
        };
      }) ?? [],
  []);

  /* ── Summary stats ── */
  const totalHours    = mockLogs.reduce((s, l) => s + l.hoursWorked, 0);
  const approvalRate  = mockLogs.length
    ? Math.round((mockLogs.filter((l) => l.status === "approved").length / mockLogs.length) * 100)
    : 0;
  const avgHours      = students.length
    ? Math.round(totalHours / students.length)
    : 0;

  const handleExport = () => {
    const rows = [
      ["Student", "Total Hours", "Log Count"],
      ...hoursData.map((d) => [d.name, d.hours, d.logs]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reports.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-reports { font-family: 'DM Sans', sans-serif; }
        .ws-mono    { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="ws-reports min-h-screen bg-[#07101f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]"
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "linear-gradient(#4a9fd4 1px,transparent 1px),linear-gradient(90deg,#4a9fd4 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <BarChart3 className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h1>
                  <p className="text-sm text-slate-400 mt-0.5">Aggregated placement data and visualisations.</p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition flex-shrink-0"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </motion.div>

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users}         label="Total Users"       value={mockUsers.length}        sub={`${students.length} students`}      color="sky"     delay={0.05} />
            <StatCard icon={Briefcase}     label="Placements"        value={mockPlacements.length}   sub={`${mockPlacements.filter(p=>p.status==="active").length} active`}   color="emerald" delay={0.08} />
            <StatCard icon={ClipboardList} label="Log Entries"       value={mockLogs.length}         sub={`${approvalRate}% approved`}        color="amber"   delay={0.11} />
            <StatCard icon={Award}         label="Evaluations"       value={mockEvaluations?.length ?? 0} sub={`avg ${avgHours}h / student`}  color="violet"  delay={0.14} />
          </div>

          {/* ── Row 1: Hours bar + Placement donut ── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Hours per student */}
            <ChartCard
              title="Hours per Student"
              description="Total logged internship hours by student"
              delay={0.1}
              action={
                <span className="text-xs text-slate-600 ws-mono">{hoursData.length} students</span>
              }
            >
              {hoursData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-sm text-slate-600">No data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={hoursData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis dataKey="name" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}h`, "Hours"]} />
                    <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                      {hoursData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? COLORS.sky : `rgba(56,189,248,${0.75 - i * 0.08})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Placement status donut */}
            <ChartCard
              title="Placement Status"
              description="Distribution of placements by current state"
              delay={0.13}
            >
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={placementStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={58} outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                    labelLine={false}
                    label={PieLabel}
                  >
                    {placementStatus.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-1">
                {placementStatus.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400">{d.name} <span className="ws-mono text-white font-semibold">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* ── Weekly trend ── */}
          <ChartCard
            title="Weekly Activity Trend"
            description="Log submissions and hours worked per week"
            delay={0.17}
            action={
              <select
                value={weekRange}
                onChange={(e) => setWeekRange(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-xs text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All weeks</option>
                <option value="4">Last 4</option>
                <option value="8">Last 8</option>
              </select>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="logsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={COLORS.amber} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={COLORS.sky} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS.sky} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={COLORS.emerald} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey="week" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend
                  iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans',sans-serif", paddingTop: 12 }}
                />
                <Area type="monotone" dataKey="hours"    stroke={COLORS.sky}     strokeWidth={2} fill="url(#hoursGrad)"    dot={{ r: 3.5, fill: COLORS.sky,     strokeWidth: 0 }} name="Hours" />
                <Area type="monotone" dataKey="logs"     stroke={COLORS.amber}   strokeWidth={2} fill="url(#logsGrad)"     dot={{ r: 3.5, fill: COLORS.amber,   strokeWidth: 0 }} name="Log Entries" />
                <Area type="monotone" dataKey="approved" stroke={COLORS.emerald} strokeWidth={2} fill="url(#approvedGrad)" dot={{ r: 3.5, fill: COLORS.emerald, strokeWidth: 0 }} name="Approved" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Row 3: Log status donut + Evaluation scores ── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Log status breakdown */}
            <ChartCard
              title="Log Entry Status"
              description="Breakdown of all log submissions by review status"
              delay={0.2}
            >
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={logStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={78}
                    paddingAngle={3}
                    strokeWidth={0}
                    label={PieLabel}
                    labelLine={false}
                  >
                    {logStatusData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-2">
                {logStatusData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400">{d.name} <span className="ws-mono text-white font-semibold">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Evaluation scores */}
            <ChartCard
              title="Evaluation Scores"
              description="Workplace evaluation percentages per student"
              delay={0.22}
            >
              {evalScores.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-sm text-slate-600">
                  No evaluations recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={evalScores} layout="vertical" margin={{ top: 0, right: 32, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" {...AXIS_PROPS} width={52} />
                    <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Score"]} />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                      {evalScores.map((d, i) => (
                        <Cell
                          key={i}
                          fill={d.pct >= 80 ? COLORS.emerald : d.pct >= 60 ? COLORS.sky : d.pct >= 40 ? COLORS.amber : COLORS.rose}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* ── Summary table ── */}
          <ChartCard
            title="Student Summary"
            description="Per-student breakdown of hours, logs and approval rate"
            delay={0.25}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a3050]">
                    {["Student", "Total Hours", "Log Count", "Approved", "Approval Rate"].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#122030]">
                  {students.map((u, i) => {
                    const uLogs     = mockLogs.filter((l) => l.studentId === u.id);
                    const hours     = uLogs.reduce((s, l) => s + l.hoursWorked, 0);
                    const approved  = uLogs.filter((l) => l.status === "approved").length;
                    const rate      = uLogs.length ? Math.round((approved / uLogs.length) * 100) : 0;
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.28 + i * 0.03 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-300 flex-shrink-0">
                              {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 ws-mono text-slate-300">{hours}h</td>
                        <td className="py-3 px-3 ws-mono text-slate-300">{uLogs.length}</td>
                        <td className="py-3 px-3 ws-mono text-slate-300">{approved}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${rate}%`,
                                  background: rate >= 80 ? COLORS.emerald : rate >= 50 ? COLORS.sky : COLORS.amber,
                                }}
                              />
                            </div>
                            <span className={`text-xs ws-mono font-semibold ${rate >= 80 ? "text-emerald-400" : rate >= 50 ? "text-sky-400" : "text-amber-400"}`}>
                              {rate}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-slate-600">No student data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartCard>

        </div>
      </div>
    </AppLayout>
  );
};

export default AdminReports;