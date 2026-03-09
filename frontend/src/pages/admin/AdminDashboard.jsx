import React from "react";
import AppLayout from "@/components/AppLayout";
import { mockPlacements, mockLogs, mockEvaluations, mockUsers, statusColors } from "@/data/mockData";
import { motion } from "framer-motion";
import { Users, Building2, FileText, Award, TrendingUp, AlertCircle, ArrowUpRight, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./AdminDashboard.css";


const AdminDashboard = () => {
    const totalStudents = mockUsers.filter((u) => u.role === "student").length;
    const activePlacements = mockPlacements.filter((p) => p.status === "active").length;
    const totalLogs = mockLogs.length;
    const pendingLogs = mockLogs.filter((l) => l.status === "submitted").length;
    const totalEvals = mockEvaluations.length;

    const stats = [
        { icon: Users, label: "Total Students", value: totalStudents, change: "+2 this month", color: "from-blue-500 to-cyan-400" },
        { icon: Building2, label: "Active Placements", value: activePlacements, change: `${mockPlacements.length} total`, color: "from-emerald-500 to-teal-400" },
        { icon: FileText, label: "Total Logs", value: totalLogs, change: `${pendingLogs} pending`, color: "from-violet-500 to-purple-400" },
        { icon: AlertCircle, label: "Pending Review", value: pendingLogs, change: "needs attention", color: "from-amber-500 to-orange-400" },
        { icon: Award, label: "Evaluations", value: totalEvals, change: "submitted", color: "from-rose-500 to-pink-400" },
        { icon: TrendingUp, label: "Completion Rate", value: "68%", change: "+5% vs last month", color: "from-teal-500 to-cyan-400" },
    ];

    const logStatusData = [
        { name: "Draft", value: mockLogs.filter((l) => l.status === "draft").length, color: "hsl(220 15% 55%)" },
        { name: "Submitted", value: mockLogs.filter((l) => l.status === "submitted").length, color: "hsl(217 91% 60%)" },
        { name: "Reviewed", value: mockLogs.filter((l) => l.status === "reviewed").length, color: "hsl(40 80% 50%)" },
        { name: "Approved", value: mockLogs.filter((l) => l.status === "approved").length, color: "hsl(160 84% 39%)" },
    ];

    const weeklyData = Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        submitted: mockLogs.filter((l) => l.weekNumber === i + 1 && l.status !== "draft").length,
        total: mockLogs.filter((l) => l.weekNumber === i + 1).length,
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
            <div className="admin-container">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="admin-header">
                    <div className="admin-panel-badge">
                        <Shield className="admin-panel-icon" />
                        <span className="admin-panel-text">Admin Panel</span>
                    </div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">System-wide overview and statistics</p>
                </motion.div>

                <div className="admin-stats-grid">
                    {stats.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="stat-card">
                            <div className="stat-header-row">
                                {/* Keep Tailwind background gradients here since the colors are dynamically injected */}
                                <div className={`stat-icon-container bg-gradient-to-br ${s.color}`}>
                                    <s.icon />
                                </div>
                                <ArrowUpRight className="stat-arrow" />
                            </div>
                            <p className="stat-value">{s.value}</p>
                            <p className="stat-label-text">{s.label}</p>
                            <p className="stat-change-text">{s.change}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="admin-charts-layout">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-premium chart-card-padding">
                        <h3 className="chart-header-title">Log Status Distribution</h3>
                        <p className="chart-header-subtitle">Breakdown by workflow state</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={logStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} strokeWidth={0}>
                                    {logStatusData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-legend-box">
                            {logStatusData.map((d) => (
                                <div key={d.name} className="chart-legend-item">
                                    <div className="chart-legend-color" style={{ backgroundColor: d.color }} />
                                    <span className="chart-legend-label">{d.name} ({d.value})</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-premium chart-card-padding">
                        <h3 className="chart-header-title">Weekly Submissions</h3>
                        <p className="chart-header-subtitle">Submissions vs total logs per week</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 14%)" />
                                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }} axisLine={false} tickLine={false} />
                                <Tooltip {...tooltipStyle} />
                                <Bar dataKey="submitted" fill="hsl(45 93% 58%)" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="total" fill="hsl(220 30% 22%)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Recent Placements Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card-premium">
                    <div className="table-header-box">
                        <div>
                            <h2 className="table-header-title">Recent Placements</h2>
                            <p className="table-header-subtitle">All internship assignments</p>
                        </div>
                        <span className="table-header-total">{mockPlacements.length} total</span>
                    </div>
                    <div className="table-scroll-container">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Company</th>
                                    <th>Duration</th>
                                    <th>Supervisor</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPlacements.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="student-row-content">
                                                <div className="student-avatar">
                                                    {p.studentName.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <span className="student-name-text">{p.studentName}</span>
                                            </div>
                                        </td>
                                        <td className="td-muted">{p.company}</td>
                                        <td className="td-muted-sm">{p.startDate} — {p.endDate}</td>
                                        <td className="td-muted">{p.workplaceSupervisor}</td>
                                        <td>
                                            <span className={`status-badge ${statusColors[p.status]?.bg} ${statusColors[p.status]?.text}`}>{p.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default AdminDashboard;
