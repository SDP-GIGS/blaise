import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { motion } from "framer-motion";
import {
  Users, ClipboardCheck, Clock, AlertCircle, Briefcase,
  Download, CheckCircle2, Bell, FileText, Search, Filter,
  ChevronDown,
} from "lucide-react";

const getStatusStyle = (status) => {
  switch (status) {
    case "submitted": return "bg-amber-400/15 text-amber-300 border border-amber-500/30";
    case "reviewed":  return "bg-sky-400/15 text-sky-300 border border-sky-500/30";
    case "approved":  return "bg-emerald-400/15 text-emerald-300 border border-emerald-500/30";
    case "rejected":  return "bg-red-400/15 text-red-300 border border-red-500/30";
    default:          return "bg-slate-400/15 text-slate-300 border border-slate-500/30";
  }
};

const StudentRow = ({ placement, logs, index }) => {
  const [expanded, setExpanded] = useState(false);
  const pending = logs.filter((l) => l.status === "submitted").length;
  const approved = logs.filter((l) => l.status === "approved").length;
  const progress = logs.length ? Math.round((approved / logs.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden"
    >
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left">
        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0">
          {(placement.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{placement.student_name}</p>
          <p className="text-xs text-slate-500 truncate">{placement.company}</p>
        </div>
        <div className="hidden sm:block w-28">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">Progress</span>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center hidden md:block">
            <p className="text-sm font-bold text-white">{logs.length}</p>
            <p className="text-xs text-slate-600">logs</p>
          </div>
          {pending > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-medium border border-amber-500/30">
              <AlertCircle className="w-3 h-3" /> {pending}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#1a3050]">
          {logs.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="w-6 h-6 text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No logs submitted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#122030]">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#122030] border border-[#1a3050] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-slate-400">W{log.week_number}</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Week {log.week_number}</p>
                      <p className="text-xs text-slate-500">{log.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(log.status)}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="px-6 py-3 border-t border-[#1a3050]">
            <Link to="/supervisor/workplace/review"
              className="text-xs text-sky-400 hover:underline font-medium">
              Go to Review Logs →
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const WorkplaceSupervisorDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, placementsData] = await Promise.all([
          apiClient.get('/logs/'),
          apiClient.get('/placements/'),
        ]);
        setLogs(Array.isArray(logsData) ? logsData : []);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pendingLogs = useMemo(() => logs.filter((l) => l.status === 'submitted'), [logs]);
  const reviewedLogs = useMemo(() => logs.filter((l) => l.status === 'reviewed'), [logs]);
  const approvedLogs = useMemo(() => logs.filter((l) => l.status === 'approved'), [logs]);

  const filteredPlacements = placements.filter((p) => {
    const q = searchQuery.toLowerCase();
    return !q || (p.student_name ?? "").toLowerCase().includes(q) || (p.company ?? "").toLowerCase().includes(q);
  });

  const logsForStudent = (studentId) => {
    let sl = logs.filter((l) => l.student === studentId);
    if (statusFilter !== "all") sl = sl.filter((l) => l.status === statusFilter);
    return sl;
  };

  const handleExport = () => {
    const rows = [["Student", "Week", "Status", "Date"],
      ...logs.map((l) => [l.student_name, `Week ${l.week_number}`, l.status, l.date])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "supervisor-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { icon: Users,          label: "Assigned Students", value: placements.length,    color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-500/20"     },
    { icon: AlertCircle,    label: "Pending Review",    value: pendingLogs.length,    color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-500/20"   },
    { icon: Clock,          label: "Reviewed",          value: reviewedLogs.length,   color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-500/20"     },
    { icon: ClipboardCheck, label: "Approved",          value: approvedLogs.length,   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Briefcase className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Workplace Supervisor Portal</p>
                  <h1 className="text-2xl font-bold text-white">
                    {user?.full_name ? `Welcome, ${user.full_name.split(" ")[0]}` : "Supervisor Dashboard"}
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {placements.length} student{placements.length !== 1 ? "s" : ""} under supervision
                    {pendingLogs.length > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-amber-400">
                        <Bell className="w-3 h-3" /> {pendingLogs.length} pending review
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-200 hover:text-white text-sm font-semibold transition">
                  <Download className="w-4 h-4" /> Export
                </button>
                <Link to="/supervisor/workplace/review"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                  <ClipboardCheck className="w-4 h-4" /> Review Logs
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`rounded-2xl ${s.bg} border ${s.border} p-5 flex items-center gap-4`}>
                <div className={`p-2.5 rounded-xl ${s.bg} border ${s.border}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#1a3050]">
            {["overview", "students"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold capitalize tracking-wide transition border-b-2 -mb-px ${
                  activeTab === tab ? "border-sky-500 text-sky-400" : "border-transparent text-slate-500 hover:text-slate-300"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6">

              {/* Assigned Students */}
              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050]">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-white">Assigned Students</h2>
                  </div>
                  <span className="text-xs text-slate-500">{placements.length} total</span>
                </div>
                <div className="divide-y divide-[#122030] overflow-y-auto max-h-80">
                  {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">Loading...</div>
                  ) : placements.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No students assigned yet.</p>
                    </div>
                  ) : placements.map((p) => {
                    const sLogs = logs.filter((l) => l.student === p.student);
                    const pending = sLogs.filter((l) => l.status === "submitted").length;
                    return (
                      <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-300 flex-shrink-0">
                            {(p.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{p.student_name}</p>
                            <p className="text-xs text-slate-500">{p.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{sLogs.length} logs</span>
                          {pending > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-xs border border-amber-500/30">
                              {pending} pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pending Logs — Read Only */}
              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050]">
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-semibold text-white">Pending Logs</h2>
                  </div>
                  <Link to="/supervisor/workplace/review"
                    className="text-xs text-sky-400 hover:underline font-medium">
                    Review all →
                  </Link>
                </div>
                <div className="divide-y divide-[#122030] overflow-y-auto max-h-80">
                  {pendingLogs.length === 0 ? (
                    <div className="py-12 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">All caught up — nothing pending.</p>
                    </div>
                  ) : pendingLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-amber-300">W{log.week_number}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{log.student_name}</p>
                          <p className="text-xs text-slate-500">Week {log.week_number} · {log.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search by student name…" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition" />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer">
                    <option value="all">All statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center text-slate-500">Loading...</div>
              ) : filteredPlacements.length === 0 ? (
                <div className="py-20 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]">
                  <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No students found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlacements.map((placement, i) => (
                    <StudentRow
                      key={placement.id}
                      placement={placement}
                      logs={logsForStudent(placement.student)}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </AppLayout>
  );
};

export default WorkplaceSupervisorDashboard;