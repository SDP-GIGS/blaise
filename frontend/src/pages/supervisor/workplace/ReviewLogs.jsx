import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockLogs, mockPlacements, mockUsers } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Calendar,
  Briefcase,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Star,
  FileText,
  TrendingUp,
  X,
  AlertCircle,
  Send,
  Check,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const statusMeta = {
  submitted: {
    label: "Submitted",
    cls: "bg-amber-400/15  text-amber-300  border-amber-500/30",
  },
  reviewed: {
    label: "Reviewed",
    cls: "bg-sky-400/15    text-sky-300    border-sky-500/30",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-400/15 text-emerald-300 border-emerald-500/30",
  },
  changes: {
    label: "Changes Req",
    cls: "bg-red-400/15   text-red-300    border-red-500/30",
  },
};

const StatusBadge = ({ status }) => {
  const m = statusMeta[status] || statusMeta.submitted;
  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${m.cls}`}
    >
      {m.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Toast
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
    <button
      onClick={onClose}
      className="ml-2 text-white/40 hover:text-white transition"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Review Drawer (slide-in panel)
───────────────────────────────────────────── */
const ReviewDrawer = ({ log, onClose, onAction }) => {
  const [comment, setComment] = useState(log?.supervisorComment || "");
  const [rating, setRating] = useState(log?.rating || 0);

  if (!log) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Drawer */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1926] border-l border-[#1a3050] shadow-2xl flex flex-col overflow-hidden"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <FileText className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Log Review</p>
                <p className="text-xs text-slate-500">
                  Week {log.weekNumber} · {log.studentName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 ws-scrollbar">
            {/* Meta info */}
            <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">
                  {log.studentName}
                </p>
                <StatusBadge status={log.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Calendar,
                    label: "Week",
                    value: `Week ${log.weekNumber}`,
                  },
                  {
                    icon: Clock,
                    label: "Hours Worked",
                    value: `${log.hoursWorked}h`,
                  },
                  {
                    icon: Briefcase,
                    label: "Company",
                    value: log.company || "—",
                  },
                  {
                    icon: User,
                    label: "Student ID",
                    value: `#${log.studentId}`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Icon className="w-3 h-3" /> {label}
                    </div>
                    <p className="text-sm text-white font-medium ws-mono">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Log description */}
            {log.description ? (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Weekly Report
                </p>
                <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4 text-center">
                <FileText className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">
                  No description provided for this log.
                </p>
              </div>
            )}

            {/* Activities */}
            {log.activities && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Activities
                </p>
                <div className="space-y-1.5">
                  {(Array.isArray(log.activities)
                    ? log.activities
                    : String(log.activities)
                        .split(/\r?\n|,|;|\u2022|\*/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                  ).map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f]"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{act}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                Performance Rating
              </p>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      rating >= r
                        ? "text-amber-400"
                        : "text-slate-700 hover:text-slate-500"
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
                <span className="ml-1 text-sm text-slate-400">
                  {rating > 0 ? `${rating}/5` : "Not rated"}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                Supervisor Comment
              </p>
              <textarea
                rows={4}
                placeholder="Add feedback or comments for this student…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition resize-none"
              />
            </div>
          </div>

          {/* Drawer footer — action buttons */}
          <div className="px-6 py-4 border-t border-[#1a3050] bg-[#0b1523] flex-shrink-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAction("changes", comment, rating)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-semibold transition"
              >
                <RotateCcw className="w-4 h-4" /> Request Changes
              </button>
              <button
                onClick={() => onAction("reviewed", comment, rating)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-sm font-semibold transition"
              >
                <Eye className="w-4 h-4" /> Mark Reviewed
              </button>
            </div>
            <button
              onClick={() => onAction("approved", comment, rating)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Log
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Student Row (expandable)
───────────────────────────────────────────── */
const StudentRow = ({ student, logs, onReview, index }) => {
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
      {/* Student header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0">
          {student.studentName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        {/* Name + company */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {student.studentName}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {student.company}
            {student.department && ` · ${student.department}`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:block w-28">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">Progress</span>
            <span className="text-xs text-slate-400 ws-mono">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center hidden md:block">
            <p className="text-sm font-bold ws-mono text-white">
              {logs.length}
            </p>
            <p className="text-xs text-slate-600">logs</p>
          </div>
          {pending > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-medium border border-amber-500/30">
              <AlertCircle className="w-3 h-3" /> {pending}
            </span>
          )}
          <div
            className={`p-1.5 rounded-lg transition-colors ${expanded ? "bg-sky-500/10 text-sky-400" : "text-slate-600 hover:text-slate-400"}`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {/* Expandable log list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="logs"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#1a3050]">
              {logs.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    No logs submitted yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#122030]">
                  {/* Column headers */}
                  <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-2 text-xs font-medium text-slate-600 uppercase tracking-wider">
                    <span>Description</span>
                    <span>Week</span>
                    <span>Hours</span>
                    <span>Status</span>
                    <span></span>
                  </div>

                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 sm:gap-4 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
                    >
                      <p className="text-sm text-slate-300 truncate">
                        {log.description || `Week ${log.weekNumber} log entry`}
                      </p>
                      <span className="text-sm text-slate-400 ws-mono">
                        <span className="sm:hidden text-xs text-slate-600 mr-1">
                          Week
                        </span>
                        {log.weekNumber}
                      </span>
                      <span className="text-sm text-slate-400 ws-mono">
                        <span className="sm:hidden text-xs text-slate-600 mr-1">
                          Hours
                        </span>
                        {log.hoursWorked}h
                      </span>
                      <StatusBadge status={log.status} />
                      <button
                        onClick={() => onReview(log)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                          log.status === "submitted"
                            ? "bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400"
                            : "bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-400 hover:text-white"
                        }`}
                      >
                        {log.status === "submitted" ? (
                          <>
                            <Eye className="w-3 h-3" /> Review
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" /> View
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const WorkplaceReviewLogs = () => {
  const { user } = useAuth();

  const [logs, setLogs] = useState(mockLogs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [activeLog, setActiveLog] = useState(null);
  const [toast, setToast] = useState(null);

  const usersById = useMemo(
    () => Object.fromEntries(mockUsers.map((u) => [u.id, u])),
    [],
  );

  const assignedStudents = useMemo(
    () =>
      mockPlacements
        .filter((p) => p.workplaceSupervisor === user?.name)
        .map((p) => ({
          ...p,
          studentName:
            p.studentName || usersById[p.studentId]?.name || "Student",
        })),
    [user, usersById],
  );

  const enrichedLogs = useMemo(
    () =>
      logs.map((l) => ({
        ...l,
        studentName: usersById[l.studentId]?.name || `Student #${l.studentId}`,
        company:
          assignedStudents.find((s) => s.studentId === l.studentId)?.company ||
          "",
        department:
          assignedStudents.find((s) => s.studentId === l.studentId)
            ?.department || "",
      })),
    [logs, usersById, assignedStudents],
  );

  // Filter students by search
  const filteredStudents = useMemo(() => {
    return assignedStudents.filter(
      (s) =>
        s.studentName.toLowerCase().includes(search.toLowerCase()) ||
        (s.company || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [assignedStudents, search]);

  // Logs per student, optionally filtered by status
  const logsForStudent = (studentId) => {
    let sl = enrichedLogs.filter((l) => l.studentId === studentId);
    if (statusFilter !== "all")
      sl = sl.filter((l) => l.status === statusFilter);
    return sl;
  };

  // Summary counts
  const totalPending = enrichedLogs.filter(
    (l) =>
      l.status === "submitted" &&
      assignedStudents.some((s) => s.studentId === l.studentId),
  ).length;
  const totalApproved = enrichedLogs.filter(
    (l) =>
      l.status === "approved" &&
      assignedStudents.some((s) => s.studentId === l.studentId),
  ).length;
  const totalLogs = enrichedLogs.filter((l) =>
    assignedStudents.some((s) => s.studentId === l.studentId),
  ).length;

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAction = (action, comment, rating) => {
    if (!activeLog) return;
    setLogs((prev) =>
      prev.map((l) =>
        l.id === activeLog.id
          ? { ...l, status: action, supervisorComment: comment, rating }
          : l,
      ),
    );
    setActiveLog(null);
    const messages = {
      approved: "Log approved successfully.",
      reviewed: "Log marked as reviewed.",
      changes: "Changes requested — student notified.",
    };
    showToast(messages[action] || "Log updated.");
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-rl { font-family: 'DM Sans', sans-serif; }
        .ws-mono { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-rl min-h-screen bg-[#07101f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]"
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#4a9fd4 1px,transparent 1px),linear-gradient(90deg,#4a9fd4 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <ClipboardCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">
                    Logbook Review
                  </p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Student Weekly Logs
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Review, approve, or request changes on submitted log
                    entries.
                  </p>
                </div>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  {
                    label: "Pending",
                    value: totalPending,
                    color: "bg-amber-400/10 text-amber-300 border-amber-500/20",
                  },
                  {
                    label: "Approved",
                    value: totalApproved,
                    color:
                      "bg-emerald-400/10 text-emerald-300 border-emerald-500/20",
                  },
                  {
                    label: "Total",
                    value: totalLogs,
                    color: "bg-sky-400/10 text-sky-300 border-sky-500/20",
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className={`px-3.5 py-2 rounded-xl border text-center ${c.color}`}
                  >
                    <p className="text-lg font-bold ws-mono leading-none">
                      {c.value}
                    </p>
                    <p className="text-xs mt-0.5 opacity-80">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search student or company…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value)}
                className="pl-10 pr-10 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500/50 transition"
              >
                <option value="all">All statuses</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="changes">Changes Requested</option>
              </select>
            </div>
          </motion.div>

          {/* ── Pending callout banner ── */}
          <AnimatePresence>
            {totalPending > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-400/8 border border-amber-500/25 text-amber-300"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm font-medium">
                  You have <span className="font-bold">{totalPending}</span> log
                  {totalPending !== 1 ? "s" : ""} awaiting your review.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Student accordion list ── */}
          {filteredStudents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]"
            >
              <User className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                {search
                  ? "No students match your search."
                  : "No students assigned to you yet."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student, i) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  logs={logsForStudent(student.studentId)}
                  onReview={setActiveLog}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* ── Empty logs state (students exist but no logs match filter) ── */}
          {filteredStudents.length > 0 &&
            statusFilter !== "all" &&
            filteredStudents.every(
              (s) => logsForStudent(s.studentId).length === 0,
            ) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-10 text-center"
              >
                <p className="text-sm text-slate-500">
                  No logs with status{" "}
                  <span className="text-slate-300 font-medium">
                    "{statusFilter}"
                  </span>{" "}
                  found.
                </p>
                <button
                  onClick={() => setStatus("all")}
                  className="mt-3 text-xs text-sky-400 hover:underline"
                >
                  Clear filter
                </button>
              </motion.div>
            )}
        </div>
      </div>

      {/* ── Review Drawer ── */}
      <AnimatePresence>
        {activeLog && (
          <ReviewDrawer
            key="drawer"
            log={activeLog}
            onClose={() => setActiveLog(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
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

export default WorkplaceReviewLogs;
