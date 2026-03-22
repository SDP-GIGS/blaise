import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockPlacements, mockUsers, mockEvaluations } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Star,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  Award,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  Briefcase,
  Shield,
  Target,
  Users,
  Clock,
  BookOpen,
  Lightbulb,
  History,
  Lock,
  Unlock,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Criteria config — weights must sum to 100
───────────────────────────────────────────── */
const CRITERIA = [
  { id: "professionalism", label: "Professionalism",  maxScore: 20, icon: Shield,    color: "indigo", desc: "Workplace conduct, attitude and adherence to standards." },
  { id: "technical",       label: "Technical Skills", maxScore: 25, icon: Target,    color: "sky",    desc: "Application of theoretical knowledge to practical tasks." },
  { id: "communication",   label: "Communication",    maxScore: 25, icon: MessageSquare, color: "violet", desc: "Clarity in written and verbal communication with the team." },
  { id: "punctuality",     label: "Punctuality",      maxScore: 30, icon: Clock,     color: "amber",  desc: "Consistent on-time attendance and meeting of deadlines." },
];

const MAX_TOTAL = CRITERIA.reduce((s, c) => s + c.maxScore, 0);

const GRADE_MAP = [
  { min: 90, grade: "A+", label: "Outstanding",   color: "emerald" },
  { min: 80, grade: "A",  label: "Excellent",     color: "emerald" },
  { min: 70, grade: "B",  label: "Very Good",     color: "sky"     },
  { min: 60, grade: "C",  label: "Satisfactory",  color: "amber"   },
  { min: 50, grade: "D",  label: "Pass",          color: "orange"  },
  { min: 0,  grade: "F",  label: "Fail",          color: "red"     },
];

const COLOR = {
  indigo:  { text: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/25",  fill: "#818cf8", bar: "bg-indigo-500" },
  sky:     { text: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/25",     fill: "#38bdf8", bar: "bg-sky-500"    },
  violet:  { text: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/25",  fill: "#a78bfa", bar: "bg-violet-500" },
  amber:   { text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25",   fill: "#fbbf24", bar: "bg-amber-500"  },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", fill: "#34d399", bar: "bg-emerald-500"},
  orange:  { text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/25",  fill: "#fb923c", bar: "bg-orange-500" },
  red:     { text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/25",     fill: "#f87171", bar: "bg-red-500"    },
};

const getGrade = (pct) => GRADE_MAP.find((g) => pct >= g.min) || GRADE_MAP[GRADE_MAP.length - 1];

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
        : "bg-red-950 border-red-700 text-red-200"
    }`}
  >
    {type === "success"
      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      : <AlertCircle  className="w-4 h-4 text-red-400    flex-shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Score Ring
───────────────────────────────────────────── */
const ScoreRing = ({ score, max, gradeColor }) => {
  const pct  = max > 0 ? score / max : 0;
  const r    = 42;
  const circ = 2 * Math.PI * r;
  const fill = COLOR[gradeColor]?.fill ?? "#38bdf8";

  return (
    <div className="relative inline-flex items-center justify-center w-[100px] h-[100px]">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} stroke="#1a3050" strokeWidth="7" fill="none" />
        <circle
          cx="50" cy="50" r={r}
          stroke={fill} strokeWidth="7" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - pct * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold ws-mono text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-500 mt-0.5">/ {max}</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Criterion Row
───────────────────────────────────────────── */
const CriterionRow = ({ criterion, score, comment, onChange, onComment, locked, index }) => {
  const [showComment, setShowComment] = useState(false);
  const { id, label, maxScore, icon: Icon, color, desc } = criterion;
  const c   = COLOR[color];
  const pct = maxScore > 0 ? Math.min((score || 0) / maxScore, 1) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl bg-[#0d1926] border ${score > 0 ? c.border : "border-[#1a3050]"} overflow-hidden transition-colors duration-300`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border} flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${c.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm font-semibold text-white">{label}</p>
              <span className={`text-xs ${c.text} ws-mono`}>max {maxScore} pts</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>

        {/* Score input */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="number"
              min={0}
              max={maxScore}
              value={score === "" ? "" : score}
              onChange={(e) => {
                if (locked) return;
                const v = e.target.value === "" ? "" : Math.min(Math.max(0, Number(e.target.value)), maxScore);
                onChange(id, v);
              }}
              disabled={locked}
              placeholder="0"
              className={`w-20 px-3 py-2 rounded-xl bg-[#0b1523] border ${score > 0 ? c.border : "border-[#1e3a5f]"} text-white text-center text-sm ws-mono focus:outline-none focus:border-sky-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <span className="text-slate-600 text-sm">/ {maxScore}</span>

            {/* inline bar */}
            <div className="flex-1 h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${c.bar}`}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className={`text-xs ws-mono ${score > 0 ? c.text : "text-slate-600"}`}>
              {score > 0 ? `${Math.round(pct * 100)}%` : "—"}
            </span>
          </div>
        </div>

        {/* Comment toggle */}
        {!locked && (
          <button
            type="button"
            onClick={() => setShowComment((v) => !v)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <MessageSquare className="w-3 h-3" />
            {showComment ? "Hide comment" : comment ? "Edit comment" : "Add comment"}
            <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${showComment ? "rotate-180" : ""}`} />
          </button>
        )}

        {locked && comment && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#0b1523] border border-[#1e3a5f]">
            <p className="text-xs text-slate-400 italic">"{comment}"</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {showComment && !locked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <textarea
                rows={2}
                placeholder={`Comment on ${label.toLowerCase()}…`}
                value={comment}
                onChange={(e) => onComment(id, e.target.value)}
                className="mt-2 w-full px-3 py-2 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 transition resize-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fill bar */}
      <div className="h-0.5 bg-[#0b1523]">
        <motion.div
          className={`h-full ${c.bar} opacity-60`}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Confirm Modal
───────────────────────────────────────────── */
const ConfirmModal = ({ open, onClose, onConfirm, studentName, score, gradePct }) => {
  const g = getGrade(gradePct);
  const c = COLOR[g.color];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="px-6 pt-6 pb-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Submit Evaluation?</h3>
                  <p className="text-xs text-slate-400">This will lock the form permanently.</p>
                </div>
                <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-sm text-white font-semibold">{studentName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Score</p>
                    <p className="text-lg font-bold ws-mono text-white">{score} <span className="text-sm text-slate-500">/ {MAX_TOTAL}</span></p>
                  </div>
                  <div className="w-px h-10 bg-[#1e3a5f]" />
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Grade</p>
                    <p className={`text-lg font-bold ws-mono ${c.text}`}>{g.grade}</p>
                  </div>
                  <div className="w-px h-10 bg-[#1e3a5f]" />
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Rating</p>
                    <p className={`text-sm font-semibold ${c.text}`}>{g.label}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                  Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition">
                  Confirm & Lock
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const WorkplaceEvaluate = () => {
  const { user } = useAuth();

  const assignedStudents = useMemo(
    () =>
      mockPlacements
        .filter((p) => p.workplaceSupervisor === user?.name)
        .map((p) => ({
          ...p,
          studentName: mockUsers.find((u) => u.id === p.studentId)?.name || "Student",
        })),
    [user]
  );

  const [selectedStudentId, setSelectedStudentId] = useState(
    String(assignedStudents[0]?.studentId ?? "")
  );
  const [scores,        setScores]        = useState({});          // { criterionId: number|"" }
  const [comments,      setComments]      = useState({});          // { criterionId: string }
  const [overallComment, setOverallComment] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [locked,        setLocked]        = useState(false);
  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [toast,         setToast]         = useState(null);

  const selectedStudent = assignedStudents.find(
    (s) => String(s.studentId) === String(selectedStudentId)
  );
  const previousEval = mockEvaluations?.find(
    (e) => String(e.studentId) === String(selectedStudentId) && e.type === "workplace"
  );

  const totalScore  = CRITERIA.reduce((s, c) => s + (Number(scores[c.id]) || 0), 0);
  const gradePct    = MAX_TOTAL > 0 ? Math.round((totalScore / MAX_TOTAL) * 100) : 0;
  const gradeInfo   = getGrade(gradePct);
  const gradeColor  = COLOR[gradeInfo.color];

  const filledCount = CRITERIA.filter((c) => scores[c.id] !== "" && scores[c.id] !== undefined).length;
  const allFilled   = filledCount === CRITERIA.length;

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleScore   = (id, val) => setScores((s)   => ({ ...s, [id]: val }));
  const handleComment = (id, val) => setComments((c)  => ({ ...c, [id]: val }));

  const handleReset = () => {
    if (locked) return;
    setScores({});
    setComments({});
    setOverallComment("");
    setRecommendation("");
  };

  const handleTrySubmit = () => {
    if (!selectedStudentId) { showToast("Please select a student.", "error"); return; }
    if (!allFilled)          { showToast(`Please fill in all ${CRITERIA.length} criteria.`, "error"); return; }
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setLocked(true);
    setSubmitted(true);
    showToast(`Evaluation for ${selectedStudent?.studentName} submitted and locked.`);
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-ev  { font-family: 'DM Sans', sans-serif; }
        .ws-mono { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-ev min-h-screen bg-[#07101f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Page Header ── */}
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
                  <ClipboardCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">
                    Workplace Assessment
                  </p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Evaluate Student</h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Assess your assigned students on key workplace skills.
                  </p>
                </div>
              </div>

              {/* Progress chips */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center px-4 py-2 rounded-xl bg-[#0b1523] border border-[#1e3a5f]">
                  <p className="text-lg font-bold ws-mono text-white">{filledCount}/{CRITERIA.length}</p>
                  <p className="text-xs text-slate-500">Filled</p>
                </div>
                {locked && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                    <Lock className="w-4 h-4" /> Locked
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">

            {/* ── Left: Form ── */}
            <div className="space-y-5">

              {/* Student selector */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5"
              >
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Student Being Evaluated
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      if (locked) return;
                      setSelectedStudentId(e.target.value);
                      handleReset();
                    }}
                    disabled={locked}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a student…</option>
                    {assignedStudents.map((s) => (
                      <option key={s.studentId} value={String(s.studentId)}>
                        {s.studentName} — {s.company}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {selectedStudent && (
                  <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/5 border border-sky-500/15">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-300 flex-shrink-0">
                      {selectedStudent.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedStudent.studentName}</p>
                      <p className="text-xs text-slate-500">{selectedStudent.company}{selectedStudent.department && ` · ${selectedStudent.department}`}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Criteria cards */}
              <div className="space-y-3">
                {CRITERIA.map((c, i) => (
                  <CriterionRow
                    key={c.id}
                    criterion={c}
                    score={scores[c.id] ?? ""}
                    comment={comments[c.id] ?? ""}
                    onChange={handleScore}
                    onComment={handleComment}
                    locked={locked}
                    index={i}
                  />
                ))}
              </div>

              {/* Overall comment */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5 space-y-4"
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Overall Supervisor Comments
                </p>
                <textarea
                  rows={4}
                  placeholder="Summarise the student's overall performance, strengths, and areas for improvement…"
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  disabled={locked}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 transition resize-none disabled:opacity-50"
                />

                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Recommendation
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Excellent", "Satisfactory", "Needs Improvement", "Unsatisfactory"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        disabled={locked}
                        onClick={() => setRecommendation(r)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          recommendation === r
                            ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                            : "bg-[#0b1523] border-[#1e3a5f] text-slate-500 hover:text-slate-300 hover:border-slate-600 disabled:cursor-not-allowed"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              {!locked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex gap-3"
                >
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] hover:border-slate-600 text-slate-400 hover:text-white text-sm font-medium transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleTrySubmit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition shadow-lg shadow-emerald-900/30"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submit & Lock Evaluation
                  </button>
                </motion.div>
              )}

              {locked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/25 text-emerald-300 text-sm font-medium"
                >
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  Evaluation submitted and locked. No further changes can be made.
                </motion.div>
              )}
            </div>

            {/* ── Right: Score Panel ── */}
            <div className="space-y-4 lg:sticky lg:top-6">

              {/* Live score card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5 text-center space-y-4"
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live Score</p>

                <div className="flex justify-center">
                  <ScoreRing score={totalScore} max={MAX_TOTAL} gradeColor={gradeInfo.color} />
                </div>

                <div>
                  <p className={`text-3xl font-bold ws-mono ${gradeColor.text}`}>{gradeInfo.grade}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{gradeInfo.label}</p>
                  <p className={`text-xs mt-1 ws-mono ${gradeColor.text}`}>{gradePct}%</p>
                </div>

                {/* Per-criterion mini bars */}
                <div className="space-y-2 text-left">
                  {CRITERIA.map((c) => {
                    const s = Number(scores[c.id]) || 0;
                    const p = c.maxScore > 0 ? s / c.maxScore : 0;
                    const col = COLOR[c.color];
                    return (
                      <div key={c.id}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 truncate">{c.label}</span>
                          <span className={`ws-mono ${col.text} ml-2 flex-shrink-0`}>{s}/{c.maxScore}</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#1a3050] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${col.bar}`}
                            animate={{ width: `${p * 100}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Grade reference */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5"
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Grade Reference</p>
                <div className="space-y-1.5">
                  {GRADE_MAP.map((g) => {
                    const col = COLOR[g.color];
                    const active = gradeInfo.grade === g.grade;
                    return (
                      <div
                        key={g.grade}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          active ? `${col.bg} border ${col.border}` : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ws-mono w-6 ${col.text}`}>{g.grade}</span>
                          <span className="text-xs text-slate-500">{g.label}</span>
                        </div>
                        <span className="text-xs text-slate-600 ws-mono">{g.min}%+</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Previous evaluation */}
              {previousEval && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-slate-500" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Previous Evaluation</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Total Score</span>
                      <span className="text-sm font-bold ws-mono text-white">{previousEval.totalScore} / {previousEval.maxTotal}</span>
                    </div>
                    {previousEval.criteria?.map((c) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">{c.name}</span>
                        <span className="text-xs ws-mono text-slate-400">{c.score}/{c.maxScore}</span>
                      </div>
                    ))}
                    {previousEval.comments && (
                      <p className="text-xs text-slate-500 italic pt-1 border-t border-[#1a3050] mt-2">
                        "{previousEval.comments}"
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals & Toasts ── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        studentName={selectedStudent?.studentName || ""}
        score={totalScore}
        gradePct={gradePct}
      />

      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default WorkplaceEvaluate;