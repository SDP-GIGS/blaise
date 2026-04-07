import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserCircle2, GraduationCap, ClipboardList, CheckCircle2,
  Building2, Mail, BadgeCheck, ChevronRight, BookOpen,
  Star, Bell, AlertCircle, BarChart3, X,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";

const statusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === "active" || s === "approved" || s === "completed") return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (s === "new") return "bg-amber-100 text-amber-800 border border-amber-200";
  if (s === "rejected") return "bg-red-100 text-red-800 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col gap-1 hover:shadow-md transition-shadow"
    style={{ borderTop: `3px solid ${accent}` }}>
    <div className="absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
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
      <h2 className="text-base font-bold text-gray-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const EmptyRow = ({ cols, message }) => (
  <tr>
    <td colSpan={cols} className="px-4 py-10 text-center text-sm text-gray-400 italic">{message}</td>
  </tr>
);

const AcademicSupervisorDashboard = () => {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placementsData, logsData, evalsData] = await Promise.all([
          apiClient.get('/placements/'),
          apiClient.get('/logs/'),
          apiClient.get('/evaluations/'),
        ]);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setEvaluations(Array.isArray(evalsData) ? evalsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingLogs = useMemo(() => logs.filter((l) => l.status === 'submitted'), [logs]);
  const academicEvals = useMemo(() => evaluations.filter((e) => e.evaluation_type === 'academic'), [evaluations]);
  const avgScore = academicEvals.length
    ? (academicEvals.reduce((s, e) => s + e.score, 0) / academicEvals.length).toFixed(1)
    : null;

  const chartData = useMemo(() =>
    logs.reduce((acc, l) => {
      const week = `W${l.week_number}`;
      const existing = acc.find((a) => a.week === week);
      if (existing) existing.logs += 1;
      else acc.push({ week, logs: 1 });
      return acc;
    }, []).sort((a, b) => a.week.localeCompare(b.week)),
    [logs]);

  const filteredPlacements = placements.filter((p) => {
    const q = search.toLowerCase();
    return !q || (p.student_name ?? "").toLowerCase().includes(q) || (p.company ?? "").toLowerCase().includes(q);
  });

  const filteredLogs = pendingLogs.filter((l) => {
    const q = search.toLowerCase();
    return !q || (l.student_name ?? "").toLowerCase().includes(q);
  });

  const handleReviewLog = async (action) => {
    if (!selectedLog) return;
    setSaving(true);
    try {
      const newStatus = action === 'approve' ? 'approved' : 'reviewed';
      await apiClient.post('/reviews/', {
        log: selectedLog.id,
        comment: reviewComment,
        status: newStatus,
      });
      setLogs((prev) => prev.map((l) =>
        l.id === selectedLog.id ? { ...l, status: newStatus } : l
      ));
      setReviewOpen(false);
      setReviewComment("");
      setSelectedLog(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 w-full" style={{ background: "linear-gradient(120deg, #0891b2 0%, #059669 60%, #0d9488 100%)" }} />
            <div className="px-8 pb-7 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
                  style={{ background: "linear-gradient(135deg, #0891b2, #059669)" }}>
                  <UserCircle2 className="w-12 h-12 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow">
                  <BadgeCheck size={13} className="text-white" />
                </span>
              </div>
              <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                <h1 className="text-2xl font-extrabold text-gray-900">{user?.full_name ?? "Academic Supervisor"}</h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <GraduationCap size={14} className="text-cyan-600" /> Academic Supervisor
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail size={14} className="text-cyan-600" /> {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            <StatCard icon={GraduationCap} value={placements.length}    label="Total Placements"  accent="#0891b2" />
            <StatCard icon={ClipboardList} value={pendingLogs.length}   label="Pending Reviews"   accent="#f59e0b" />
            <StatCard icon={BookOpen}      value={academicEvals.length} label="Evaluations Done"  accent="#059669" />
            <StatCard icon={Star}          value={avgScore ? `${avgScore}%` : "—"} label="Avg Score" accent="#fbbf24" />
            <StatCard icon={CheckCircle2}  value={logs.filter((l) => l.status === "approved").length} label="Approved Logs" accent="#6366f1" />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-emerald-700 text-sm">Weekly Log Submissions</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} width={30} />
                <Tooltip contentStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="logs" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLogs)" name="Logs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Placements Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
              <SectionHeader title="Assigned Students" subtitle={`${placements.length} student(s) under your supervision`} accent="#0891b2" />
              <input type="text"
                className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
                placeholder="Search students or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <EmptyRow cols={5} message="Loading..." />
                  ) : filteredPlacements.length === 0 ? (
                    <EmptyRow cols={5} message="No students assigned yet." />
                  ) : filteredPlacements.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-cyan-50/30 transition-colors">
                      <td className="px-6 py-4 text-gray-300 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(p.student_name ?? "?").charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{p.student_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-gray-300 shrink-0" />{p.company}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColor(p.status)}`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-mono">{p.start_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Reviews Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2">
              <SectionHeader title="Pending Log Reviews" subtitle="Student logs awaiting your review" accent="#f59e0b" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Week</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <EmptyRow cols={6} message="No pending reviews. You're all caught up!" />
                  ) : filteredLogs.map((log, i) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 text-gray-300 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(log.student_name ?? "?").charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{log.student_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">Week {log.week_number}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                        {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          Submitted
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setSelectedLog(log); setReviewOpen(true); }}
                          className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 hover:underline underline-offset-2 transition-colors flex items-center gap-1">
                          Review <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluations Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-6 pb-2">
              <SectionHeader title="Academic Evaluations" subtitle="Scores you have submitted" accent="#059669" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {academicEvals.length === 0 ? (
                    <EmptyRow cols={5} message="No evaluations recorded yet." />
                  ) : academicEvals.map((e, i) => (
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 text-gray-300 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(e.student_name ?? "?").charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{e.student_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Star size={10} /> {e.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-mono">{e.date ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                        {e.comments ?? <span className="italic text-gray-300">No comments</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Review Modal */}
      {reviewOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h3 className="text-base font-semibold text-gray-800">Review Log — Week {selectedLog.week_number}</h3>
              <button onClick={() => { setReviewOpen(false); setSelectedLog(null); setReviewComment(""); }}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2 text-sm">
                <p><span className="font-semibold text-gray-600">Student:</span> {selectedLog.student_name}</p>
                <p><span className="font-semibold text-gray-600">Activities:</span> {selectedLog.activities}</p>
                <p><span className="font-semibold text-gray-600">Learnings:</span> {selectedLog.learnings}</p>
                <p><span className="font-semibold text-gray-600">Challenges:</span> {selectedLog.challenges}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Your Comment</label>
                <textarea rows={3} placeholder="Add feedback for the student…"
                  value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-200 resize-none" />
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => { setReviewOpen(false); setSelectedLog(null); setReviewComment(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-800 transition">
                  Cancel
                </button>
                <button onClick={() => handleReviewLog("review")} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition disabled:opacity-50">
                  Mark Reviewed
                </button>
                <button onClick={() => handleReviewLog("approve")} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition disabled:opacity-50">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AcademicSupervisorDashboard;