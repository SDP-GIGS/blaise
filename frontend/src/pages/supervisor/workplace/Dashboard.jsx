import { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockLogs,
  mockPlacements,
  mockUsers,
  statusColors,
} from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  Clock,
  AlertCircle,
  Briefcase,
  Send,
  Download,
  UserPlus,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronRight,
  X,
  MessageSquare,
  FileText,
  TrendingUp,
  Search,
  Filter,
  Bell,
  BarChart3,
  Calendar,
  MoreVertical,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Reusable Modal Shell
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-[#0b1120]/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="relative z-10 w-full max-w-lg rounded-2xl bg-[#111c30] border border-[#1e3a5f] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f] bg-[#0d1926]">
            <h3 className="text-base font-semibold text-white tracking-wide">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────
   Toast Notification
───────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      type === "success"
        ? "bg-emerald-950 border-emerald-700 text-emerald-200"
        : type === "error"
        ? "bg-red-950 border-red-700 text-red-200"
        : "bg-[#111c30] border-[#1e3a5f] text-slate-200"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
    )}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────── */
const WorkplaceSupervisorDashboard = () => {
  const { user } = useAuth();

  // ── State ──────────────────────────────────
  const [logs, setLogs] = useState(mockLogs);
  const [placements, setPlacements] = useState(mockPlacements);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview"); // overview | students | logs

  // Modals
  const [addPlacementOpen, setAddPlacementOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form state
  const [placementForm, setPlacementForm] = useState({ studentName: "", company: "", department: "", startDate: "", endDate: "" });
  const [feedbackForm, setFeedbackForm] = useState({ studentId: "", message: "", rating: 5 });
  const [reviewComment, setReviewComment] = useState("");

  // ── Derived Data ───────────────────────────
  const usersById = useMemo(
    () => Object.fromEntries(mockUsers.map((u) => [u.id, u])),
    []
  );

  const assignedStudents = useMemo(
    () =>
      placements
        .filter((p) => p.workplaceSupervisor === user?.name)
        .map((p) => ({
          ...p,
          studentName: p.studentName || usersById[p.studentId]?.name || "Student",
        })),
    [placements, user, usersById]
  );

  const allLogs = useMemo(
    () =>
      logs
        .filter((l) => assignedStudents.some((p) => p.studentId === l.studentId))
        .map((l) => ({
          ...l,
          studentName: usersById[l.studentId]?.name || `Student #${l.studentId}`,
        })),
    [logs, assignedStudents, usersById]
  );

  const pendingReview = allLogs.filter((l) => l.status === "submitted");
  const reviewed = allLogs.filter((l) => l.status === "reviewed" || l.status === "approved");

  const filteredLogs = useMemo(() => {
    let filtered = allLogs;
    if (statusFilter !== "all") filtered = filtered.filter((l) => l.status === statusFilter);
    if (searchQuery) filtered = filtered.filter((l) =>
      l.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered;
  }, [allLogs, statusFilter, searchQuery]);

  const stats = [
    { icon: Users, label: "Assigned Students", value: assignedStudents.length, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-500/20" },
    { icon: AlertCircle, label: "Pending Review", value: pendingReview.length, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20" },
    { icon: ClipboardCheck, label: "Reviewed", value: reviewed.length, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" },
    { icon: Clock, label: "Total Logs", value: allLogs.length, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-500/20" },
  ];

  // ── Helpers ────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "submitted": return "bg-amber-400/15 text-amber-300 border border-amber-500/30";
      case "reviewed": return "bg-sky-400/15 text-sky-300 border border-sky-500/30";
      case "approved": return "bg-emerald-400/15 text-emerald-300 border border-emerald-500/30";
      default: return "bg-slate-400/15 text-slate-300 border border-slate-500/30";
    }
  };

  // ── Action Handlers ────────────────────────
  const handleAddPlacement = () => {
    if (!placementForm.studentName || !placementForm.company) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    const newPlacement = {
      id: `p-${Date.now()}`,
      studentId: `s-${Date.now()}`,
      studentName: placementForm.studentName,
      company: placementForm.company,
      department: placementForm.department,
      startDate: placementForm.startDate,
      endDate: placementForm.endDate,
      workplaceSupervisor: user?.name,
      status: "active",
    };
    setPlacements((prev) => [...prev, newPlacement]);
    setPlacementForm({ studentName: "", company: "", department: "", startDate: "", endDate: "" });
    setAddPlacementOpen(false);
    showToast("Placement added successfully.");
  };

  const handleSendFeedback = () => {
    if (!feedbackForm.studentId || !feedbackForm.message) {
      showToast("Please select a student and write a message.", "error");
      return;
    }
    setFeedbackOpen(false);
    setFeedbackForm({ studentId: "", message: "", rating: 5 });
    showToast("Feedback sent successfully.");
  };

  const handleReviewLog = (action) => {
    if (!selectedLog) return;
    setLogs((prev) =>
      prev.map((l) =>
        l.id === selectedLog.id
          ? { ...l, status: action === "approve" ? "approved" : "reviewed", comment: reviewComment }
          : l
      )
    );
    setReviewOpen(false);
    setReviewComment("");
    setSelectedLog(null);
    showToast(action === "approve" ? "Log approved." : "Log marked as reviewed.");
  };

  const handleExport = () => {
    const rows = [
      ["Student", "Week", "Hours", "Status"],
      ...allLogs.map((l) => [l.studentName, `Week ${l.weekNumber}`, l.hoursWorked, l.status]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supervisor-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Report exported as CSV.");
  };

  // ── Render ─────────────────────────────────
  return (
    <AppLayout>
      {/* ── Global font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-dashboard { font-family: 'DM Sans', sans-serif; }
        .ws-mono { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-dashboard min-h-screen bg-[#07101f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]"
          >
            {/* subtle grid bg */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(#4a9fd4 1px, transparent 1px), linear-gradient(90deg, #4a9fd4 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Briefcase className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">
                    Workplace Supervisor Portal
                  </p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Supervisor Dashboard"}
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {assignedStudents.length} student{assignedStudents.length !== 1 ? "s" : ""} under supervision
                    {pendingReview.length > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-amber-400">
                        <Bell className="w-3 h-3" />
                        {pendingReview.length} pending review
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setAddPlacementOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow transition-colors duration-150"
                >
                  <UserPlus className="w-4 h-4" /> Add Placement
                </button>
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-200 hover:text-white text-sm font-semibold transition-colors duration-150"
                >
                  <Send className="w-4 h-4" /> Send Feedback
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-200 hover:text-white text-sm font-semibold transition-colors duration-150"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-2xl ${s.bg} border ${s.border} p-5 flex items-center gap-4 hover:brightness-110 transition-all duration-200`}
              >
                <div className={`p-2.5 rounded-xl ${s.bg} border ${s.border}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ws-mono ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-1 border-b border-[#1a3050]">
            {["overview", "students", "logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold capitalize tracking-wide transition-colors duration-150 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-sky-500 text-sky-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab: Overview ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Assigned Students */}
              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050]">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-white">Assigned Students</h2>
                  </div>
                  <span className="text-xs text-slate-500">{assignedStudents.length} total</span>
                </div>
                <div className="divide-y divide-[#122030] ws-scrollbar overflow-y-auto max-h-80">
                  {assignedStudents.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No students assigned yet.</p>
                    </div>
                  ) : (
                    assignedStudents.map((p) => {
                      const sLogs = allLogs.filter((l) => l.studentId === p.studentId);
                      const pending = sLogs.filter((l) => l.status === "submitted").length;
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedStudent(p); setStudentDetailOpen(true); }}
                          className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-300 flex-shrink-0">
                              {p.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{p.studentName}</p>
                              <p className="text-xs text-slate-500">{p.company}{p.department && ` · ${p.department}`}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{sLogs.length} logs</span>
                            {pending > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-medium border border-amber-500/30">
                                {pending} pending
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pending Logs */}
              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050]">
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="w-4 h-4 text-amber-400" />
                    <h2 className="text-sm font-semibold text-white">Awaiting Review</h2>
                  </div>
                  <span className="text-xs text-slate-500">{pendingReview.length} pending</span>
                </div>
                <div className="divide-y divide-[#122030] ws-scrollbar overflow-y-auto max-h-80">
                  {pendingReview.length === 0 ? (
                    <div className="py-12 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">All caught up — nothing pending.</p>
                    </div>
                  ) : (
                    pendingReview.map((log) => (
                      <div key={log.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold ws-mono text-amber-300">W{log.weekNumber}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{log.studentName}</p>
                            <p className="text-xs text-slate-500">Week {log.weekNumber} · {log.hoursWorked}h worked</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(log.status)}`}>
                            {log.status}
                          </span>
                          <button
                            onClick={() => { setSelectedLog(log); setReviewOpen(true); }}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Tab: Students ── */}
          {activeTab === "students" && (
            <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1a3050] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">All Assigned Students</h2>
                  <button
                    onClick={() => setAddPlacementOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 font-medium transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                {assignedStudents.length === 0 ? (
                  <div className="py-16 text-center">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No students assigned yet.</p>
                    <button onClick={() => setAddPlacementOpen(true)} className="mt-4 text-sm text-sky-400 hover:underline">
                      Add a placement
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#122030]">
                    {assignedStudents.map((p) => {
                      const sLogs = allLogs.filter((l) => l.studentId === p.studentId);
                      const pending = sLogs.filter((l) => l.status === "submitted").length;
                      const approvedCount = sLogs.filter((l) => l.status === "approved").length;
                      const progress = sLogs.length ? Math.round((approvedCount / sLogs.length) * 100) : 0;
                      return (
                        <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0">
                              {p.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{p.studentName}</p>
                              <p className="text-xs text-slate-500 truncate">{p.company}{p.department && ` · ${p.department}`}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-slate-500">Approval progress</span>
                              <span className="text-xs text-slate-400 ws-mono">{progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-sm font-semibold text-white ws-mono">{sLogs.length}</p>
                              <p className="text-xs text-slate-500">logs</p>
                            </div>
                            {pending > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-xs border border-amber-500/30 font-medium">
                                {pending} pending
                              </span>
                            )}
                            <button
                              onClick={() => { setSelectedStudent(p); setStudentDetailOpen(true); }}
                              className="p-1.5 rounded-lg bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-400 hover:text-white transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Tab: Logs ── */}
          {activeTab === "logs" && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by student name…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
                  >
                    <option value="all">All statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1a3050] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">Log Submissions</h2>
                  <span className="text-xs text-slate-500">{filteredLogs.length} entries</span>
                </div>
                {filteredLogs.length === 0 ? (
                  <div className="py-16 text-center">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No logs match your filters.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#122030] ws-scrollbar overflow-y-auto max-h-[480px]">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#122030] border border-[#1a3050] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold ws-mono text-slate-400">W{log.weekNumber}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{log.studentName}</p>
                            <p className="text-xs text-slate-500">Week {log.weekNumber} · {log.hoursWorked}h</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(log.status)}`}>
                            {log.status}
                          </span>
                          {log.status === "submitted" && (
                            <button
                              onClick={() => { setSelectedLog(log); setReviewOpen(true); }}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 font-medium transition"
                            >
                              <Eye className="w-3 h-3" /> Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ─────── MODALS ─────── */}

      {/* Add Placement */}
      <Modal open={addPlacementOpen} onClose={() => setAddPlacementOpen(false)} title="Add New Placement">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Student Name <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={placementForm.studentName}
                onChange={(e) => setPlacementForm((f) => ({ ...f, studentName: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Company <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="Company name"
                value={placementForm.company}
                onChange={(e) => setPlacementForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
              <input
                type="text"
                placeholder="e.g. Engineering"
                value={placementForm.department}
                onChange={(e) => setPlacementForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date</label>
              <input
                type="date"
                value={placementForm.startDate}
                onChange={(e) => setPlacementForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">End Date</label>
              <input
                type="date"
                value={placementForm.endDate}
                onChange={(e) => setPlacementForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/60 transition"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setAddPlacementOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white hover:border-slate-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPlacement}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
            >
              Add Placement
            </button>
          </div>
        </div>
      </Modal>

      {/* Send Feedback */}
      <Modal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} title="Send Student Feedback">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Student <span className="text-red-400">*</span></label>
            <select
              value={feedbackForm.studentId}
              onChange={(e) => setFeedbackForm((f) => ({ ...f, studentId: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white focus:outline-none focus:border-sky-500/60 transition"
            >
              <option value="">Choose a student…</option>
              {assignedStudents.map((s) => (
                <option key={s.id} value={s.studentId}>{s.studentName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setFeedbackForm((f) => ({ ...f, rating: r }))}
                  className={`p-1.5 rounded-lg transition ${feedbackForm.rating >= r ? "text-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
              <span className="ml-1 text-sm text-slate-400 self-center">{feedbackForm.rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Message <span className="text-red-400">*</span></label>
            <textarea
              rows={4}
              placeholder="Write your feedback here…"
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setFeedbackOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white hover:border-slate-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSendFeedback}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
            >
              Send Feedback
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Log */}
      <Modal open={reviewOpen} onClose={() => { setReviewOpen(false); setSelectedLog(null); setReviewComment(""); }} title="Review Log Submission">
        {selectedLog && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{selectedLog.studentName}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusStyle(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div><span className="text-slate-600">Week</span><p className="text-white mt-0.5 ws-mono">{selectedLog.weekNumber}</p></div>
                <div><span className="text-slate-600">Hours Worked</span><p className="text-white mt-0.5 ws-mono">{selectedLog.hoursWorked}h</p></div>
              </div>
              {selectedLog.description && (
                <div>
                  <span className="text-xs text-slate-600">Description</span>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{selectedLog.description}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Supervisor Comment</label>
              <textarea
                rows={3}
                placeholder="Add optional comments for the student…"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/60 transition resize-none"
              />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => { setReviewOpen(false); setSelectedLog(null); setReviewComment(""); }}
                className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewLog("review")}
                className="flex-1 py-2.5 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-sky-500/20 text-sky-400 text-sm font-semibold transition"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => handleReviewLog("approve")}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Student Detail */}
      <Modal open={studentDetailOpen} onClose={() => { setStudentDetailOpen(false); setSelectedStudent(null); }} title="Student Details">
        {selectedStudent && (() => {
          const sLogs = allLogs.filter((l) => l.studentId === selectedStudent.studentId);
          const approved = sLogs.filter((l) => l.status === "approved").length;
          const totalHours = sLogs.reduce((acc, l) => acc + (l.hoursWorked || 0), 0);
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-lg font-bold text-sky-300 flex-shrink-0">
                  {selectedStudent.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-base font-bold text-white">{selectedStudent.studentName}</p>
                  <p className="text-sm text-slate-400">{selectedStudent.company}{selectedStudent.department && ` · ${selectedStudent.department}`}</p>
                  {selectedStudent.startDate && (
                    <p className="text-xs text-slate-500 mt-0.5">{selectedStudent.startDate} → {selectedStudent.endDate || "Ongoing"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Logs", value: sLogs.length, color: "text-sky-400" },
                  { label: "Approved", value: approved, color: "text-emerald-400" },
                  { label: "Total Hours", value: `${totalHours}h`, color: "text-violet-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-3 text-center">
                    <p className={`text-xl font-bold ws-mono ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              {sLogs.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Recent logs</p>
                  <div className="space-y-2 max-h-44 overflow-y-auto ws-scrollbar">
                    {sLogs.slice(-5).reverse().map((l) => (
                      <div key={l.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-xs">
                        <span className="text-slate-300">Week {l.weekNumber} · {l.hoursWorked}h</span>
                        <span className={`px-2 py-0.5 rounded-full ${getStatusStyle(l.status)}`}>{l.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => { setStudentDetailOpen(false); setSelectedStudent(null); setFeedbackForm((f) => ({ ...f, studentId: selectedStudent.studentId })); setFeedbackOpen(true); }}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
                >
                  Send Feedback
                </button>
                <button
                  onClick={() => { setStudentDetailOpen(false); setSelectedStudent(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ─── Toast ─── */}
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default WorkplaceSupervisorDashboard;