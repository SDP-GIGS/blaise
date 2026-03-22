{
  /* ── Recent Activity Feed ─────────────────────── */
}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-4">
  <div className="flex items-center gap-2 mb-2">
    <Star className="w-5 h-5 text-cyan-400" />
    <span className="font-semibold text-cyan-700 text-sm">Recent Activity</span>
  </div>
  <ol className="relative border-l border-cyan-100 ml-3">
    {/* Demo activity feed */}
    <li className="mb-6 ml-6">
      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-cyan-100 rounded-full ring-8 ring-white">
        <CheckCircle2 className="w-4 h-4 text-cyan-600" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          Evaluation submitted for John Student
        </span>
        <span className="text-xs text-gray-400">Today, 10:15 AM</span>
      </div>
    </li>
    <li className="mb-6 ml-6">
      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full ring-8 ring-white">
        <Bell className="w-4 h-4 text-yellow-500" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          Logbook overdue for Jane Student
        </span>
        <span className="text-xs text-gray-400">Yesterday, 4:30 PM</span>
      </div>
    </li>
    <li className="mb-6 ml-6">
      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full ring-8 ring-white">
        <Building2 className="w-4 h-4 text-emerald-600" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          Placement approved for John Student
        </span>
        <span className="text-xs text-gray-400">2 days ago</span>
      </div>
    </li>
    <li className="ml-6">
      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-8 ring-white">
        <ClipboardList className="w-4 h-4 text-gray-400" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          Weekly logbook reviewed for John Student
        </span>
        <span className="text-xs text-gray-400">3 days ago</span>
      </div>
    </li>
  </ol>
</div>;
{
  /* ── Quick Actions ────────────────────────────── */
}
<div className="flex flex-wrap gap-4 mb-4">
  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow transition">
    <CheckCircle2 className="w-4 h-4" /> Add Evaluation
  </button>
  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition">
    <Mail className="w-4 h-4" /> Message Student
  </button>
  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow transition">
    <BookOpen className="w-4 h-4" /> Export Data
  </button>
</div>;
import { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
// Assigned students for this supervisor
const assignedStudents = mockPlacements.filter(
  (p) => p.academicSupervisor === "Dr. Academic Supervisor",
);
// Demo chart data: logbook hours by week for all assigned students
const chartData = mockLogs
  .filter((l) => assignedStudents.some((p) => p.studentId === l.studentId))
  .map((l) => ({
    week: l.weekNumber ? `W${l.weekNumber}` : l.period || "-",
    hours: l.hoursWorked || 0,
  }));
{
  /* ── Student Progress Chart ───────────────────── */
}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 mb-4">
  <div className="flex items-center gap-2 mb-2">
    <BarChart3 className="w-5 h-5 text-emerald-400" />
    <span className="font-semibold text-emerald-700 text-sm">
      Student Progress (Logbook Hours by Week)
    </span>
  </div>
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart
      data={chartData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
      <YAxis stroke="#94a3b8" fontSize={12} width={30} />
      <Tooltip contentStyle={{ fontSize: 13 }} />
      <Area
        type="monotone"
        dataKey="hours"
        stroke="#06b6d4"
        fillOpacity={1}
        fill="url(#colorHours)"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>;
import AppLayout from "@/components/AppLayout";
import {
  mockPlacements,
  mockLogs,
  mockEvaluations,
  mockUsers,
} from "@/data/mockData";
import {
  UserCircle2,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  Building2,
  Mail,
  BadgeCheck,
  ChevronRight,
  BookOpen,
  Star,
  Bell,
  AlertCircle,
  BarChart3,
} from "lucide-react";
// Demo notifications for alerts section
const notifications = [
  {
    id: 1,
    title: "Evaluation Due",
    message: "You have an evaluation due for John Student.",
    time: "1 hour ago",
    urgent: true,
  },
  {
    id: 2,
    title: "Logbook Overdue",
    message: "Jane Student's logbook is overdue for review.",
    time: "3 hours ago",
    urgent: false,
  },
  {
    id: 3,
    title: "Placement Approved",
    message: "A new placement has been approved for your student.",
    time: "Yesterday",
    urgent: false,
  },
];

const totalPlacements = mockPlacements.length;
const pendingReviews = mockLogs.filter((l) => l.status === "submitted");
const overdueReviews = mockLogs.filter((l) => {
  if (l.status !== "submitted") return false;
  // Overdue if submitted more than 7 days ago
  const submittedAt = l.submittedAt
    ? new Date(l.submittedAt)
    : new Date(l.endDate);
  return (
    submittedAt && Date.now() - submittedAt.getTime() > 7 * 24 * 60 * 60 * 1000
  );
});
const recentEvaluations = mockEvaluations.filter((e) => e.type === "academic");
const avgScore = recentEvaluations.length
  ? (
      (recentEvaluations.reduce(
        (sum, e) => sum + e.totalScore / e.maxTotal,
        0,
      ) /
        recentEvaluations.length) *
      100
    ).toFixed(1)
  : null;

const statusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "active" || s === "approved" || s === "completed")
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (s === "pending")
    return "bg-amber-100 text-amber-800 border border-amber-200";
  if (s === "rejected" || s === "inactive")
    return "bg-red-100 text-red-800 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const scoreColor = (score, max) => {
  const pct = score / max;
  if (pct >= 0.8)
    return "text-emerald-700 bg-emerald-50 border border-emerald-200";
  if (pct >= 0.6) return "text-amber-700 bg-amber-50 border border-amber-200";
  return "text-red-700 bg-red-50 border border-red-200";
};

const ScoreBar = ({ score, max }) => {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 min-w-30">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%`, backgroundColor: color }}
          className="h-full rounded-full transition-all duration-500"
        />
      </div>
      <span
        className={`text-xs font-semibold px-1.5 py-0.5 rounded ${scoreColor(score, max)}`}
      >
        {score}/{max}
      </span>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div
    className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col gap-1 group hover:shadow-md transition-shadow"
    style={{ borderTop: `3px solid ${accent}` }}
  >
    <div
      className="absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center"
      style={{ background: `${accent}18` }}
    >
      <Icon size={20} style={{ color: accent }} />
    </div>
    <span className="text-3xl font-bold text-gray-900 mt-1">{value}</span>
    <span className="text-sm text-gray-500 font-medium">{label}</span>
  </div>
);

const SectionHeader = ({ title, subtitle, accent = "#0891b2" }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="h-7 w-1 rounded-full" style={{ background: accent }} />
    <div>
      <h2 className="text-base font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const EmptyRow = ({ cols, message }) => (
  <tr>
    <td
      colSpan={cols}
      className="px-4 py-10 text-center text-sm text-gray-400 italic"
    >
      {message}
    </td>
  </tr>
);

const AcademicSupervisorDashboard = () => {
  const [search, setSearch] = useState("");

  // Filter helpers
  const filterBySearch = (arr, fields) =>
    arr.filter((item) =>
      fields.some((f) =>
        (item[f] || "").toString().toLowerCase().includes(search.toLowerCase()),
      ),
    );

  const filteredStudents = filterBySearch(assignedStudents, [
    "company",
    "department",
  ]).filter((placement) => {
    const student = mockUsers.find((u) => u.id === placement.studentId);
    return (
      student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      placement.company.toLowerCase().includes(search.toLowerCase()) ||
      placement.department.toLowerCase().includes(search.toLowerCase())
    );
  });
  const filteredReviews = filterBySearch(pendingReviews, ["period", "week"]);
  const filteredEvaluations = filterBySearch(recentEvaluations, ["comments"]);

  return (
    <AppLayout>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)",
          fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          {/* ── Profile Header ─────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Banner */}
            <div
              className="h-24 w-full flex justify-end items-start pr-6 pt-3"
              style={{
                background:
                  "linear-gradient(120deg, #0891b2 0%, #059669 60%, #0d9488 100%)",
              }}
            >
              {/* Notification Bell */}
              <button className="relative group">
                <Bell className="w-7 h-7 text-white/80 group-hover:text-yellow-300 transition" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 border-2 border-white animate-pulse" />
                <span className="sr-only">View notifications</span>
              </button>
            </div>
            <div className="px-8 pb-7 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative shrink-0">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
                  style={{
                    background: "linear-gradient(135deg, #0891b2, #059669)",
                  }}
                >
                  <UserCircle2 className="w-12 h-12 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow">
                  <BadgeCheck size={13} className="text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Dr. Academic Supervisor
                </h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <GraduationCap size={14} className="text-cyan-600" />
                    Academic Supervisor
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail size={14} className="text-cyan-600" />
                    academic@example.com
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 mt-auto">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active
                </span>
              </div>
            </div>
          </div>
          {/* ── Notifications/Alerts Section ─────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 px-6 py-4 flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-700 text-sm">
                Notifications & Alerts
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {notifications.length === 0 ? (
                <span className="text-gray-400 text-xs italic">
                  No notifications at this time.
                </span>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm border transition-all ${
                      n.urgent
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800 animate-pulse"
                        : "bg-gray-50 border-gray-100 text-gray-500"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>{n.title}:</span>
                    <span className="font-normal">{n.message}</span>
                    <span className="ml-2 text-[10px] text-gray-400">
                      {n.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Stat Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
            <StatCard
              icon={GraduationCap}
              value={assignedStudents.length}
              label="Assigned Students"
              accent="#0891b2"
            />
            <StatCard
              icon={ClipboardList}
              value={pendingReviews.length}
              label="Pending Reviews"
              accent="#f59e0b"
            />
            <StatCard
              icon={BookOpen}
              value={recentEvaluations.length}
              label="Evaluations Done"
              accent="#059669"
            />
            <StatCard
              icon={Building2}
              value={totalPlacements}
              label="Total Placements"
              accent="#6366f1"
            />
            <StatCard
              icon={Star}
              value={avgScore !== null ? `${avgScore}%` : "—"}
              label="Average Score"
              accent="#fbbf24"
            />
            <StatCard
              icon={CheckCircle2}
              value={overdueReviews.length}
              label="Overdue Reviews"
              accent="#ef4444"
            />
          </div>

          {/* ── Assigned Students Table ─────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
              <SectionHeader
                title="Assigned Students"
                subtitle={`${assignedStudents.length} student(s) currently under your supervision`}
                accent="#0891b2"
              />
              <input
                type="text"
                className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="Search students, company, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <EmptyRow cols={6} message="No students assigned yet." />
                  ) : (
                    filteredStudents.map((placement, i) => {
                      const student = mockUsers.find(
                        (u) => u.id === placement.studentId,
                      );
                      return (
                        <tr
                          key={placement.id}
                          className="border-b border-gray-50 hover:bg-cyan-50/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                {student?.name?.charAt(0) ?? "?"}
                              </div>
                              <span className="font-semibold text-gray-800">
                                {student?.name ?? "Unknown Student"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Building2
                                size={13}
                                className="text-gray-300 shrink-0"
                              />
                              {placement.company}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {placement.department}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColor(placement.status)}`}
                            >
                              {placement.status.charAt(0).toUpperCase() +
                                placement.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                            {placement.startDate
                              ? new Date(
                                  placement.startDate,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {assignedStudents.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Showing {assignedStudents.length} of {assignedStudents.length}{" "}
                  students
                </span>
                <button className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 font-medium transition-colors">
                  View All <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* ── Pending Reviews Table ───────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
              <SectionHeader
                title="Pending Log Reviews"
                subtitle="Student logs awaiting your review and approval"
                accent="#f59e0b"
              />
              <input
                type="text"
                className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Search logs, week, period..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Week / Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length === 0 ? (
                    <EmptyRow
                      cols={6}
                      message="No pending reviews. You're all caught up!"
                    />
                  ) : (
                    filteredReviews.map((log, i) => {
                      const student = mockUsers.find(
                        (u) => u.id === log.studentId,
                      );
                      return (
                        <tr
                          key={log.id}
                          className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                {student?.name?.charAt(0) ?? "?"}
                              </div>
                              <span className="font-semibold text-gray-800">
                                {student?.name ?? "Unknown Student"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {log.week
                              ? `Week ${log.week}`
                              : (log.period ?? "—")}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                            {log.submittedAt
                              ? new Date(log.submittedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Submitted
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 hover:underline underline-offset-2 transition-colors flex items-center gap-1">
                              Review <ChevronRight size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {pendingReviews.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {pendingReviews.length} log(s) awaiting review
                </span>
                <button className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 font-medium transition-colors">
                  View All <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* ── Evaluations Table ───────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
              <SectionHeader
                title="Recent Academic Evaluations"
                subtitle="Performance scores and comments for supervised students"
                accent="#059669"
              />
              <input
                type="text"
                className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Search evaluations, comments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-45">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider max-w-xs">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.length === 0 ? (
                    <EmptyRow cols={6} message="No evaluations recorded yet." />
                  ) : (
                    filteredEvaluations.map((evaln, i) => {
                      const student = mockUsers.find(
                        (u) => u.id === evaln.studentId,
                      );
                      return (
                        <tr
                          key={evaln.id}
                          className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                {student?.name?.charAt(0) ?? "?"}
                              </div>
                              <span className="font-semibold text-gray-800">
                                {student?.name ?? "Unknown Student"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${scoreColor(evaln.totalScore, evaln.maxTotal)}`}
                            >
                              <Star size={10} />
                              {evaln.totalScore} / {evaln.maxTotal}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <ScoreBar
                              score={evaln.totalScore}
                              max={evaln.maxTotal}
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                            {evaln.createdAt
                              ? new Date(evaln.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>
                          <td
                            className="px-6 py-4 text-gray-500 max-w-xs truncate"
                            title={evaln.comments}
                          >
                            {evaln.comments ?? (
                              <span className="italic text-gray-300">
                                No comments
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {recentEvaluations.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {recentEvaluations.length} evaluation(s) recorded
                </span>
                <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                  View All <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AcademicSupervisorDashboard;
