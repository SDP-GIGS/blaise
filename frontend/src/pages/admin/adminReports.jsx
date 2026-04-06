import AppLayout from "@/components/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart3, Download, Users, ClipboardList, Award, Briefcase,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { apiClient } from "@/lib/apiClient";

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0d1926", border: "1px solid #1e3a5f", borderRadius: "12px",
    color: "#e2e8f0", fontSize: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  labelStyle: { color: "#94a3b8", marginBottom: 4 },
  cursor: { fill: "rgba(56,189,248,0.05)" },
};

const AXIS_PROPS = {
  tick: { fontSize: 11, fill: "#475569" },
  axisLine: false, tickLine: false,
};

const GRID_PROPS = { strokeDasharray: "3 3", stroke: "#1a3050", vertical: false };

const COLORS = {
  sky: "#38bdf8", emerald: "#34d399", amber: "#fbbf24",
  violet: "#a78bfa", rose: "#fb7185",
};

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => {
  const cfg = {
    sky:     "bg-sky-500/10     border-sky-500/20     text-sky-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber:   "bg-amber-500/10   border-amber-500/20   text-amber-400",
    violet:  "bg-violet-500/10  border-violet-500/20  text-violet-400",
  };
  const parts = cfg[color].split(" ");
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`rounded-2xl ${parts[0]} border ${parts[1]} p-5 flex items-center gap-4`}>
      <div className={`p-2.5 rounded-xl ${parts[0]} border ${parts[1]} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${parts[2]}`} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${parts[2]}`}>{value}</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
};

const ChartCard = ({ title, description, children, className = "", delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden ${className}`}>
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523]">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AdminReports = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [usersData, logsData, placementsData, evalsData] = await Promise.all([
          apiClient.get('/users/'),
          apiClient.get('/logs/'),
          apiClient.get('/placements/'),
          apiClient.get('/evaluations/'),
        ]);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setEvaluations(Array.isArray(evalsData) ? evalsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const students = useMemo(() => users.filter((u) => u.role === 'student'), [users]);

  const placementStatus = useMemo(() => [
    { name: "Active",    value: placements.filter((p) => p.status === "active").length,    color: COLORS.emerald },
    { name: "Completed", value: placements.filter((p) => p.status === "completed").length, color: COLORS.sky },
    { name: "New",       value: placements.filter((p) => p.status === "new").length,       color: COLORS.amber },
  ], [placements]);

  const logStatusData = useMemo(() => [
    { name: "Submitted", value: logs.filter((l) => l.status === "submitted").length, color: COLORS.amber },
    { name: "Approved",  value: logs.filter((l) => l.status === "approved").length,  color: COLORS.emerald },
    { name: "Rejected",  value: logs.filter((l) => l.status === "rejected").length,  color: COLORS.rose },
    { name: "Draft",     value: logs.filter((l) => l.status === "draft").length,     color: COLORS.sky },
  ], [logs]);

  const weeklyTrend = useMemo(() => {
    const maxWeek = Math.max(...logs.map((l) => l.week_number ?? 0), 1);
    return Array.from({ length: maxWeek }, (_, i) => {
      const w = i + 1;
      const wLogs = logs.filter((l) => l.week_number === w);
      return {
        week: `W${w}`,
        logs: wLogs.length,
        approved: wLogs.filter((l) => l.status === "approved").length,
        submitted: wLogs.filter((l) => l.status === "submitted").length,
      };
    });
  }, [logs]);

  const studentSummary = useMemo(() =>
    students.map((u) => {
      const uLogs = logs.filter((l) => l.student === u.id);
      const approved = uLogs.filter((l) => l.status === "approved").length;
      const rate = uLogs.length ? Math.round((approved / uLogs.length) * 100) : 0;
      return { ...u, logCount: uLogs.length, approved, rate };
    }), [students, logs]);

  const evalScores = useMemo(() =>
    evaluations.map((e) => ({
      name: (e.student_name ?? "").split(" ")[0],
      score: e.score,
    })), [evaluations]);

  const approvalRate = logs.length
    ? Math.round((logs.filter((l) => l.status === "approved").length / logs.length) * 100) : 0;

  const handleExport = () => {
    const rows = [["Student", "Log Count", "Approved", "Approval Rate"],
      ...studentSummary.map((s) => [s.full_name, s.logCount, s.approved, `${s.rate}%`])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reports.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#07101f] flex items-center justify-center text-slate-400">
          Loading reports...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <BarChart3 className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                  <p className="text-sm text-slate-400 mt-0.5">Aggregated placement data and visualisations.</p>
                </div>
              </div>
              <button onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users}         label="Total Users"   value={users.length}        sub={`${students.length} students`}  color="sky"     delay={0.05} />
            <StatCard icon={Briefcase}     label="Placements"    value={placements.length}   sub={`${placements.filter(p=>p.status==="active").length} active`} color="emerald" delay={0.08} />
            <StatCard icon={ClipboardList} label="Log Entries"   value={logs.length}         sub={`${approvalRate}% approved`}    color="amber"   delay={0.11} />
            <StatCard icon={Award}         label="Evaluations"   value={evaluations.length}  sub="all types"                      color="violet"  delay={0.14} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard title="Placement Status" description="Distribution of placements by state" delay={0.1}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={placementStatus} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={58} outerRadius={90}
                    paddingAngle={3} strokeWidth={0} labelLine={false} label={PieLabel}>
                    {placementStatus.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-1">
                {placementStatus.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400">{d.name} <span className="font-semibold text-white">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Log Entry Status" description="Breakdown of submissions by review status" delay={0.13}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={logStatusData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                    paddingAngle={3} strokeWidth={0} label={PieLabel} labelLine={false}>
                    {logStatusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
                {logStatusData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400">{d.name} <span className="font-semibold text-white">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Weekly Activity Trend" description="Log submissions per week" delay={0.17}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="logsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.emerald} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={COLORS.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_PROPS} />
                <XAxis dataKey="week" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#64748b", paddingTop: 12 }} />
                <Area type="monotone" dataKey="logs" stroke={COLORS.amber} strokeWidth={2} fill="url(#logsGrad)" dot={{ r: 3.5, fill: COLORS.amber, strokeWidth: 0 }} name="Log Entries" />
                <Area type="monotone" dataKey="approved" stroke={COLORS.emerald} strokeWidth={2} fill="url(#approvedGrad)" dot={{ r: 3.5, fill: COLORS.emerald, strokeWidth: 0 }} name="Approved" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {evalScores.length > 0 && (
            <ChartCard title="Evaluation Scores" description="Scores per student" delay={0.22}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={evalScores} layout="vertical" margin={{ top: 0, right: 32, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3050" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} {...AXIS_PROPS} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" {...AXIS_PROPS} width={52} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}`, "Score"]} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {evalScores.map((d, i) => (
                      <Cell key={i} fill={d.score >= 80 ? COLORS.emerald : d.score >= 60 ? COLORS.sky : COLORS.amber} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          <ChartCard title="Student Summary" description="Per-student breakdown of logs and approval rate" delay={0.25}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a3050]">
                    {["Student", "Log Count", "Approved", "Approval Rate"].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#122030]">
                  {studentSummary.length === 0 ? (
                    <tr><td colSpan={4} className="py-10 text-center text-sm text-slate-600">No student data available.</td></tr>
                  ) : studentSummary.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 + i * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-300 flex-shrink-0">
                            {(u.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-white">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{u.logCount}</td>
                      <td className="py-3 px-3 text-slate-300">{u.approved}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${u.rate}%`, background: u.rate >= 80 ? COLORS.emerald : u.rate >= 50 ? COLORS.sky : COLORS.amber }} />
                          </div>
                          <span className={`text-xs font-semibold ${u.rate >= 80 ? "text-emerald-400" : u.rate >= 50 ? "text-sky-400" : "text-amber-400"}`}>
                            {u.rate}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
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