import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, User, CheckCircle2, AlertCircle, X,
  Lock, ChevronDown,
} from "lucide-react";

const WORKPLACE_CRITERIA = [
  { criteria: 'technical_competence', label: 'Technical Competence', max_score: 20 },
  { criteria: 'professionalism',      label: 'Professionalism',      max_score: 20 },
  { criteria: 'teamwork',             label: 'Teamwork & Communication', max_score: 20 },
  { criteria: 'problem_solving',      label: 'Problem Solving',      max_score: 20 },
  { criteria: 'overall_attitude',     label: 'Overall Attitude',     max_score: 20 },
];

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

const WorkplaceEvaluate = () => {
  const [placements, setPlacements] = useState([]);
  const [existingEvals, setExistingEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [comments, setComments] = useState("");
  const [criteriaScores, setCriteriaScores] = useState(
    Object.fromEntries(WORKPLACE_CRITERIA.map((c) => [c.criteria, 0]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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

  const selectedPlacement = placements.find((p) => String(p.student) === String(selectedStudentId));

  const alreadyEvaluated = existingEvals.some(
    (e) => String(e.student) === String(selectedStudentId) && e.evaluation_type === 'workplace'
  );

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);
  const maxTotal = WORKPLACE_CRITERIA.reduce((a, c) => a + c.max_score, 0);
  const percentage = Math.round((totalScore / maxTotal) * 100);

  const getGradeColor = (pct) => {
    if (pct >= 80) return "text-emerald-400";
    if (pct >= 60) return "text-sky-400";
    if (pct >= 50) return "text-amber-400";
    return "text-red-400";
  };


  const handleScoreChange = (criteria, value, max) => {
    const num = Math.min(Math.max(0, Number(value)), max);
    setCriteriaScores((prev) => ({ ...prev, [criteria]: num }));
  };

  const handleSubmit = async () => {
    if (!selectedStudentId) { showToast("Please select a student.", "error"); return; }
    if (alreadyEvaluated) { showToast("Already evaluated this student.", "error"); return; }

    setSubmitting(true);
    try {
      await apiClient.post('/evaluations/', {
        student: Number(selectedStudentId),
        comments,
        evaluation_type: 'workplace',
        criteria_scores: WORKPLACE_CRITERIA.map((c) => ({
          criteria: c.criteria,
          score: Number(criteriaScores[c.criteria]),
        })),
      });
      setExistingEvals((prev) => [...prev, { student: Number(selectedStudentId), evaluation_type: 'workplace' }]);
      showToast(`Evaluation for ${selectedPlacement?.student_name} submitted successfully.`);
      setCriteriaScores(Object.fromEntries(WORKPLACE_CRITERIA.map((c) => [c.criteria, 0])));
      setComments("");
    } catch (err) {
      showToast(err.message || 'Failed to submit evaluation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };


  
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative px-7 py-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <ClipboardCheck className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Workplace Assessment</p>
                <h1 className="text-2xl font-bold text-white">Evaluate Student</h1>
                <p className="text-sm text-slate-400 mt-0.5">Score each criterion to submit a workplace evaluation.</p>
              </div>
            </div>
          </motion.div>

          {/* Student Selector */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Student Being Evaluated
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select value={selectedStudentId}
                onChange={(e) => { setSelectedStudentId(e.target.value); }}
                disabled={loading}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition disabled:opacity-50">
                <option value="">Select a student…</option>
                {placements.map((p) => (
                  <option key={p.id} value={String(p.student)}>
                    {p.student_name} — {p.company}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            {alreadyEvaluated && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <Lock className="w-4 h-4" /> Evaluation already submitted for this student.
              </div>
            )}
          </motion.div>

          {/* Criteria Scores */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Evaluation Criteria</p>
              <span className={`text-sm font-bold ${getGradeColor(percentage)}`}>
                {totalScore}/{maxTotal} ({percentage}%)
              </span>
            </div>

            {WORKPLACE_CRITERIA.map((c, i) => (
              <div key={c.criteria}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white">{c.label}</label>
                  <span className="text-xs text-slate-500">{criteriaScores[c.criteria]}/{c.max_score}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={c.max_score}
                    value={criteriaScores[c.criteria]}
                    onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                    disabled={alreadyEvaluated}
                    className="flex-1 accent-sky-500 disabled:opacity-50" />
                  <input type="number" min={0} max={c.max_score}
                    value={criteriaScores[c.criteria]}
                    onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                    disabled={alreadyEvaluated}
                    className="w-16 px-2 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-white text-center text-sm focus:outline-none focus:border-sky-500/50 disabled:opacity-50" />
                </div>
                <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden mt-1.5">
                  <div className="h-full rounded-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${(criteriaScores[c.criteria] / c.max_score) * 100}%` }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Comments */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Comments</label>
            <textarea rows={4}
              placeholder="Summarise the student's overall performance, strengths, and areas for improvement…"
              value={comments} onChange={(e) => setComments(e.target.value)}
              disabled={alreadyEvaluated}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 transition resize-none disabled:opacity-50" />
          </motion.div>

          {/* Score Summary */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Score Summary</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-3xl font-bold ${getGradeColor(percentage)}`}>{totalScore}</p>
                <p className="text-xs text-slate-500 mt-0.5">Total Score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-400">{maxTotal}</p>
                <p className="text-xs text-slate-500 mt-0.5">Out of</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${getGradeColor(percentage)}`}>{percentage}%</p>
                <p className="text-xs text-slate-500 mt-0.5">Percentage</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-[#1a3050] overflow-hidden mt-4">
              <div className={`h-full rounded-full transition-all duration-500 ${percentage >= 80 ? "bg-emerald-500" : percentage >= 60 ? "bg-sky-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${percentage}%` }} />
            </div>
          </motion.div>

          {/* Submit */}
          {!alreadyEvaluated && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              onClick={handleSubmit} disabled={submitting || !selectedStudentId}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Workplace Evaluation"}
            </motion.button>
          )}

        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default WorkplaceEvaluate;