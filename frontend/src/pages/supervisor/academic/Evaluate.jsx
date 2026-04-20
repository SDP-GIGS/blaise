import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, User, Building2, BookOpen, ChevronDown,
  CheckCircle2, Send, Star, AlertCircle, ClipboardCheck,
  RotateCcw, X, Lock,
} from "lucide-react";

const ACADEMIC_CRITERIA = [
  { criteria: 'understanding',           label: 'Understanding of Concepts',  max_score: 20, description: 'Demonstrates understanding of relevant technical concepts.' },
  { criteria: 'documentation',           label: 'Quality of Documentation',   max_score: 20, description: 'Weekly logs are detailed, accurate, and submitted on time.' },
  { criteria: 'report_writing',          label: 'Report Writing',             max_score: 20, description: 'Student exhibits clear and professional writing in reports.' },
  { criteria: 'professional_development',label: 'Professional Development',   max_score: 20, description: 'Student demonstrates measurable growth during the placement.' },
  { criteria: 'academic_progress',       label: 'Academic Progress',          max_score: 20, description: 'Student applies academic knowledge effectively in placement.' },
];

const GRADE_MAP = [
  { min: 90, label: "A+", color: "#059669", bg: "#d1fae5" },
  { min: 80, label: "A",  color: "#0891b2", bg: "#cffafe" },
  { min: 70, label: "B+", color: "#7c3aed", bg: "#ede9fe" },
  { min: 60, label: "B",  color: "#d97706", bg: "#fef3c7" },
  { min: 50, label: "C",  color: "#ea580c", bg: "#ffedd5" },
  { min: 0,  label: "F",  color: "#dc2626", bg: "#fee2e2" },
];

const getGrade = (pct) => GRADE_MAP.find((g) => pct >= g.min) ?? GRADE_MAP.at(-1);

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      type === "success" ? "bg-emerald-950 border-emerald-700 text-emerald-200" : "bg-red-950 border-red-700 text-red-200"
    }`}
  >
    {type === "success"
      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

const AcademicEvaluate = () => {
  const [placements, setPlacements] = useState([]);
  const [existingEvals, setExistingEvals] = useState([]);
  const [studentLogs, setStudentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [criteriaScores, setCriteriaScores] = useState(
    Object.fromEntries(ACADEMIC_CRITERIA.map((c) => [c.criteria, 0]))
  );
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placementsData, evalsData] = await Promise.all([
          apiClient.get('/placements/'),
          apiClient.get('/evaluations/'),
        ]);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setExistingEvals(Array.isArray(evalsData) ? evalsData : []);
        if (placementsData.length > 0) {
          setSelectedStudentId(String(placementsData[0].student));
        }
      } catch (err) {
        showToast(err.message || 'Failed to load data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load logs when student changes
  useEffect(() => {
    const loadLogs = async () => {
      if (!selectedStudentId) return;
      try {
        const logsData = await apiClient.get('/logs/');
        const filtered = Array.isArray(logsData)
          ? logsData.filter((l) => String(l.student) === String(selectedStudentId))
          : [];
        setStudentLogs(filtered);
      } catch (err) {
        setStudentLogs([]);
      }
    };
    loadLogs();
  }, [selectedStudentId]);

  const selectedPlacement = placements.find((p) => String(p.student) === String(selectedStudentId));

  const alreadyEvaluated = existingEvals.some(
    (e) => String(e.student) === String(selectedStudentId) && e.evaluation_type === 'academic'
  );

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);
  const maxTotal = ACADEMIC_CRITERIA.reduce((a, c) => a + c.max_score, 0);
  const pct = Math.round((totalScore / maxTotal) * 100);
  const grade = getGrade(pct);

  const handleScoreChange = (criteria, value, max) => {
    const num = Math.min(Math.max(0, Number(value)), max);
    setCriteriaScores((prev) => ({ ...prev, [criteria]: num }));
  };

  const handleReset = () => {
    setCriteriaScores(Object.fromEntries(ACADEMIC_CRITERIA.map((c) => [c.criteria, 0])));
    setComments("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!selectedStudentId) { showToast("Please select a student.", "error"); return; }
    if (alreadyEvaluated) { showToast("Already evaluated this student.", "error"); return; }
    if (!comments.trim()) { showToast("Please add comments.", "error"); return; }

    setSubmitting(true);
    try {
      await apiClient.post('/evaluations/', {
        student: Number(selectedStudentId),
        comments,
        evaluation_type: 'academic',
        criteria_scores: ACADEMIC_CRITERIA.map((c) => ({
          criteria: c.criteria,
          score: Number(criteriaScores[c.criteria]),
        })),
      });
      setSubmitted(true);
      setExistingEvals((prev) => [...prev, { student: Number(selectedStudentId), evaluation_type: 'academic' }]);
      showToast(`Evaluation for ${selectedPlacement?.student_name} submitted successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to submit evaluation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getLogStatusStyle = (status) => {
    switch (status) {
      case 'approved':  return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'submitted': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'reviewed':  return 'bg-sky-100 text-sky-700 border border-sky-200';
      case 'rejected':  return 'bg-red-100 text-red-700 border border-red-200';
      default:          return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f8fafc 100%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck size={18} className="text-cyan-600" />
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Academic Supervisor</p>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic Evaluation</h1>
            <p className="text-gray-500 text-sm mt-1">Review the student's logs then score each criterion to submit an academic evaluation.</p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm px-8 py-12 flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Evaluation Submitted</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedPlacement?.student_name}'s evaluation has been recorded.</p>
              </div>
              <div className="w-full max-w-sm rounded-2xl px-6 py-5 flex flex-col items-center gap-1 mt-2" style={{ background: grade.bg }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: grade.color }}>Final Grade</p>
                <p className="text-5xl font-extrabold" style={{ color: grade.color }}>{grade.label}</p>
                <p className="text-sm font-bold text-gray-700">{totalScore} / {maxTotal} · {pct}%</p>
              </div>
              <button onClick={() => { setSelectedStudentId(""); handleReset(); }}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition">
                <RotateCcw size={14} /> Evaluate Another Student
              </button>
            </div>
          ) : (
            <>
              {/* Student Selector */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: "3px solid #0891b2" }}>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={15} className="text-cyan-600" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Student</h2>
                  </div>
                  <div className="relative">
                    <select value={selectedStudentId}
                      onChange={(e) => { setSelectedStudentId(e.target.value); handleReset(); }}
                      disabled={loading}
                      className="w-full appearance-none pr-10 pl-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition font-medium text-black disabled:opacity-50">
                      <option value="">— Select a student —</option>
                      {placements.map((p) => (
                        <option key={p.id} value={String(p.student)}>
                          {p.student_name} — {p.company}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {selectedPlacement && (
                    <div className="mt-4 flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {(selectedPlacement.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900">{selectedPlacement.student_name}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Building2 size={10} /> {selectedPlacement.company}
                          </span>
                        </div>
                      </div>
                      {alreadyEvaluated && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <Lock size={10} /> Already evaluated
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Student Logs — Read Only */}
              {selectedStudentId && studentLogs.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: "3px solid #f59e0b" }}>
                  <button onClick={() => setShowLogs(!showLogs)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="text-amber-500" />
                      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Student Logs ({studentLogs.length})</h2>
                      <span className="text-xs text-gray-400">— read only, for reference</span>
                    </div>
                    <ChevronDown size={15} className={`text-gray-400 transition-transform ${showLogs ? "rotate-180" : ""}`} />
                  </button>
                  {showLogs && (
                    <div className="px-6 pb-5 space-y-3">
                      {studentLogs.map((log) => (
                        <div key={log.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-gray-800">Week {log.week_number}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getLogStatusStyle(log.status)}`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1"><span className="font-semibold">Activities:</span> {log.activities}</p>
                          <p className="text-xs text-gray-500 mb-1"><span className="font-semibold">Learnings:</span> {log.learnings}</p>
                          <p className="text-xs text-gray-500"><span className="font-semibold">Challenges:</span> {log.challenges}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Criteria Scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: "3px solid #7c3aed" }}>
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star size={15} className="text-violet-500" />
                      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Scoring Rubric</h2>
                    </div>
                    <span className="text-xs text-gray-400">Each criterion out of 20 pts</span>
                  </div>

                  <div className="space-y-5">
                    {ACADEMIC_CRITERIA.map((c) => (
                      <div key={c.criteria}>
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="text-sm font-bold text-gray-800">{c.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{criteriaScores[c.criteria]}/{c.max_score}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <input type="range" min={0} max={c.max_score}
                            value={criteriaScores[c.criteria]}
                            onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                            disabled={alreadyEvaluated}
                            className="flex-1 accent-cyan-600 disabled:opacity-50" />
                          <input type="number" min={0} max={c.max_score}
                            value={criteriaScores[c.criteria]}
                            onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                            disabled={alreadyEvaluated}
                            className="w-14 text-center text-sm font-bold text-gray-900 rounded-xl border border-gray-200 bg-gray-50 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:opacity-50" />
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1.5">
                          <div className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                            style={{ width: `${(criteriaScores[c.criteria] / c.max_score) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Score Summary */}
                  <div className="mt-5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: grade.bg }}>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: grade.color }}>Running Score</p>
                      <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: grade.color }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-3xl font-extrabold" style={{ color: grade.color }}>
                        {totalScore}<span className="text-base font-medium text-gray-500"> / {maxTotal}</span>
                      </p>
                      <p className="text-xs font-bold" style={{ color: grade.color }}>{pct}% · Grade {grade.label}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: "3px solid #059669" }}>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardCheck size={15} className="text-emerald-600" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Overall Comment</h2>
                  </div>
                  <textarea rows={5} value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    disabled={alreadyEvaluated}
                    placeholder="Provide a comprehensive assessment of the student's academic performance, attitude, and growth during the placement..."
                    className="w-full text-sm text-gray-900 placeholder:text-gray-500 rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-200 bg-gray-50 leading-relaxed disabled:opacity-50" />
                  <p className="text-right text-xs text-gray-300 mt-1">{comments.length} characters</p>
                </div>
              </div>

              {/* Submit Bar */}
              {!alreadyEvaluated && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 min-w-0">
                    {selectedPlacement ? (
                      <p className="text-sm font-semibold text-gray-800">
                        Submitting evaluation for <span className="text-cyan-700">{selectedPlacement.student_name}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No student selected.</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">Score: {totalScore}/{maxTotal} · Grade {grade.label} · {pct}%</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={handleReset}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                      <RotateCcw size={13} /> Reset
                    </button>
                    <button onClick={handleSubmit} disabled={submitting || !selectedStudentId}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition shadow disabled:opacity-50"
                      style={{ background: "linear-gradient(120deg, #0891b2, #059669)" }}>
                      <Send size={14} /> {submitting ? "Submitting..." : "Submit Evaluation"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default AcademicEvaluate;