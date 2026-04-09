import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import {
  ClipboardCheck, User, Building2, BookOpen, Search,
  Filter, Eye, CheckCircle2, Clock, AlertCircle, X,
  ChevronRight,
} from "lucide-react";

const STATUS_META = {
  approved:  { label: "Approved",      bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  submitted: { label: "Pending Review", bg: "bg-amber-100 text-amber-800 border-amber-200"     },
  reviewed:  { label: "Reviewed",       bg: "bg-sky-100 text-sky-800 border-sky-200"            },
  rejected:  { label: "Rejected",       bg: "bg-red-100 text-red-800 border-red-200"            },
  draft:     { label: "Draft",          bg: "bg-gray-100 text-gray-600 border-gray-200"         },
};

const Badge = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg}`}>
      {meta.label}
    </span>
  );
};

const LogDetailPanel = ({ log, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10"
        style={{ borderTop: "3px solid #0891b2" }}>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Weekly Log</p>
          <h2 className="text-lg font-extrabold text-gray-900">Week {log.week_number} — {log.date}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={log.status} />
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          Submitted: {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
        </div>
        {[
          { label: "Activities Undertaken", value: log.activities, accent: "#0891b2" },
          { label: "Key Learnings",          value: log.learnings,  accent: "#059669" },
          { label: "Challenges Faced",       value: log.challenges, accent: "#f59e0b" },
        ].map(({ label, value, accent }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-0.5 rounded-full" style={{ background: accent }} />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {value || "—"}
            </p>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-xs text-gray-400">
          <AlertCircle size={12} className="text-amber-400" />
          This is a read-only view. Log reviews are handled by the workplace supervisor.
        </div>
      </div>
    </div>
  </div>
);

const AcademicReviewLogs = () => {
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placementsData, logsData] = await Promise.all([
          apiClient.get('/placements/'),
          apiClient.get('/logs/'),
        ]);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setLogs(Array.isArray(logsData) ? logsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

    const filteredPlacements = placements.filter((p) => {
    const q = search.toLowerCase();
    return !q || (p.student_name ?? "").toLowerCase().includes(q) || (p.company ?? "").toLowerCase().includes(q);
  });

  const selectedPlacement = placements.find((p) => p.student === selectedStudentId);

  const studentLogs = logs.filter((l) => {
    const matchStudent = l.student === selectedStudentId;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchStudent && matchStatus;
  });  

   const getStudentLogStats = (studentId) => {
    const sl = logs.filter((l) => l.student === studentId);
    return {
      total: sl.length,
      approved: sl.filter((l) => l.status === "approved").length,
      pending: sl.filter((l) => l.status === "submitted").length,
    };
  };

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck size={20} className="text-cyan-600" />
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Academic Supervisor</p>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Weekly Logs</h1>
            <p className="text-gray-500 mt-1 text-sm">View your assigned students' logbook entries. Read-only — reviews are handled by the workplace supervisor.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Student List */}
            <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search students..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 transition" />
              </div>

              {loading ? (
                <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
              ) : filteredPlacements.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6 italic">No students assigned yet.</p>
              ) : (
                <div className="space-y-2">
                  {filteredPlacements.map((p) => {
                    const stats = getStudentLogStats(p.student);
                    return (
                      <button key={p.id} onClick={() => setSelectedStudentId(p.student)}
                        className={`w-full text-left rounded-2xl border p-4 transition-all ${
                          selectedStudentId === p.student
                            ? "bg-white border-cyan-300 shadow-md ring-2 ring-cyan-100"
                            : "bg-white/70 border-gray-100 hover:border-gray-200 hover:shadow-sm"
                        }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {(p.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{p.student_name}</p>
                            <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                              <Building2 size={10} /> {p.company}
                            </p>
                          </div>
                          {selectedStudentId === p.student && (
                            <ChevronRight size={14} className="text-cyan-500 ml-auto flex-shrink-0" />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                          <div>
                            <p className="text-sm font-bold text-gray-700">{stats.total}</p>
                            <p className="text-[10px] text-gray-400">Total</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-600">{stats.approved}</p>
                            <p className="text-[10px] text-gray-400">Approved</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-amber-500">{stats.pending}</p>
                            <p className="text-[10px] text-gray-400">Pending</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Log Table */}
            <div className="flex-1 min-w-0">
              {!selectedStudentId ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-4">
                    <User size={28} className="text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Select a Student</h2>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm">Choose a student from the panel to view their weekly logbook entries.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Student Header */}
                  {selectedPlacement && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {(selectedPlacement.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-extrabold text-gray-900">{selectedPlacement.student_name}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Building2 size={11} /> {selectedPlacement.company}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <BookOpen size={11} /> {selectedPlacement.start_date} → {selectedPlacement.end_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
{/* Filter Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={13} className="text-gray-400" />
                    {["all", "submitted", "approved", "reviewed", "rejected"].map((f) => (
                      <button key={f} onClick={() => setFilterStatus(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          filterStatus === f
                            ? "bg-cyan-600 text-white border-cyan-600"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}>
                        {f === "all" ? "All Logs" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                    <span className="ml-auto text-xs text-gray-400">{studentLogs.length} log{studentLogs.length !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Logs Table */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Week</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Submitted</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentLogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400 italic">
                              No logs match the selected filter.
                            </td>
                          </tr>
                        ) : studentLogs.map((log) => (
                          <tr key={log.id} className="border-b border-gray-50 hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 font-bold text-gray-800">Week {log.week_number}</td>
                            <td className="px-5 py-4 text-gray-500 text-xs font-mono">{log.date}</td>
                            <td className="px-5 py-4 text-gray-500 text-xs font-mono">
                              {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                            </td>
                            <td className="px-5 py-4"><Badge status={log.status} /></td>
                            <td className="px-5 py-4">
                              <button onClick={() => setSelectedLog(log)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition-colors">
                                <Eye size={13} /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedLog && <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </AppLayout>
  );
};

export default AcademicReviewLogs;