import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, Search, X, Briefcase, GraduationCap,
  BookOpen, ChevronDown, Users,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const gradeFromScore = (score) => {
  if (score >= 90) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (score >= 80) return { grade: "A",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (score >= 70) return { grade: "B",  color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/25"         };
  if (score >= 60) return { grade: "C",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/25"     };
  if (score >= 50) return { grade: "D",  color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/25"   };
  return               { grade: "F",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/25"         };
};

const getBarColor = (pct) => {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 60) return "bg-sky-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const CriteriaList = ({ criteria_scores }) => {
  if (!criteria_scores?.length) return <p className="text-xs text-slate-500 italic">No criteria scores recorded.</p>;
  return (
    <div className="space-y-2 mt-3">
      {criteria_scores.map((cs) => {
        const pct = Math.round((cs.score / cs.max_score) * 100);
        return (
          <div key={cs.id}>
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs text-slate-400 capitalize">{cs.criteria.replace(/_/g, ' ')}</p>
              <span className="text-xs font-semibold text-white">{cs.score}/{cs.max_score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const EvalSection = ({ icon: Icon, label, evaluation, color, bar }) => {
  const [open, setOpen] = useState(false);
  const score = evaluation?.total_score ?? 0;
  const pct = score;
  const grade = gradeFromScore(score);

  return (
    <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] overflow-hidden">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition text-left">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} border`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {!evaluation && <span className="text-xs text-slate-500 italic">Not submitted</span>}
        </div>
        <div className="flex items-center gap-3">
          {evaluation && (
            <span className={`text-sm font-bold ${grade.color}`}>{score}/100</span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && evaluation && (
        <div className="px-4 pb-4">
          <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden mb-1">
            <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mb-2">By {evaluation.evaluator_name} · {evaluation.date}</p>
          {evaluation.comments && (
            <p className="text-xs text-slate-400 italic mb-2">"{evaluation.comments}"</p>
          )}
          <CriteriaList criteria_scores={evaluation.criteria_scores} />
        </div>
      )}
    </div>
  );
};

const StudentEvalCard = ({ student, workplaceEval, academicEval, scoreData, index }) => {
  const [expanded, setExpanded] = useState(false);
  const finalScore = scoreData?.final_score ?? 0;
  const grade = gradeFromScore(finalScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden"
    >
      {/* Student Header */}
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0">
            {(student.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{student.full_name}</p>
            <p className="text-xs text-slate-500">{student.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Final score ring */}
          <div className="text-center">
            <p className={`text-xl font-bold ${grade.color}`}>{finalScore}</p>
            <p className="text-[10px] text-slate-500">/ 100</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${grade.bg} ${grade.color}`}>
            {grade.grade}
          </span>
          {/* Eval status indicators */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${workplaceEval ? "bg-emerald-500" : "bg-slate-600"}`} title="Workplace eval" />
            <div className={`w-2 h-2 rounded-full ${academicEval ? "bg-violet-500" : "bg-slate-600"}`} title="Academic eval" />
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Score bar */}
      <div className="h-0.5 bg-[#122030]">
        <div className={`h-full transition-all duration-700 ${getBarColor(finalScore)}`}
          style={{ width: `${finalScore}%` }} />
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4 border-t border-[#1a3050]">

              {/* Weighted Score Breakdown */}
              {scoreData && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Workplace (40%)", value: scoreData.workplace_evaluation.contribution, out_of: 40, color: "text-emerald-400" },
                    { label: "Academic (30%)",  value: scoreData.academic_evaluation.contribution,  out_of: 30, color: "text-violet-400"  },
                    { label: "Logbook (30%)",   value: scoreData.logbook.contribution,               out_of: 30, color: "text-sky-400"    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-3 text-center">
                      <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">/ {item.out_of}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Logbook Info */}
              {scoreData && (
                <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <p className="text-sm font-semibold text-white">Logbook</p>
                    <span className="text-sm font-bold text-sky-400 ml-auto">
                      {scoreData.logbook.average_score}/30
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {scoreData.logbook.logs_reviewed} log{scoreData.logbook.logs_reviewed !== 1 ? "s" : ""} reviewed · average score {scoreData.logbook.average_score}/30
                  </p>
                </div>
              )}

              {/* Workplace Evaluation */}
              <EvalSection
                icon={Briefcase}
                label="Workplace Evaluation"
                evaluation={workplaceEval}
                color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                bar="bg-emerald-500"
              />

              {/* Academic Evaluation */}
              <EvalSection
                icon={GraduationCap}
                label="Academic Evaluation"
                evaluation={academicEval}
                color="bg-violet-500/10 border-violet-500/20 text-violet-400"
                bar="bg-violet-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminEvaluations = () => {
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, evalsData] = await Promise.all([
          apiClient.get('/students/'),
          apiClient.get('/evaluations/'),
        ]);
        const studentList = Array.isArray(studentsData) ? studentsData : [];
        const evalList = Array.isArray(evalsData) ? evalsData : [];
        setStudents(studentList);
        setEvaluations(evalList);

        // Load score for each student
        const scoreResults = await Promise.allSettled(
          studentList.map((s) => apiClient.get(`/scores/${s.id}/`))
        );
        const scoresMap = {};
        scoreResults.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            scoresMap[studentList[i].id] = result.value;
          }
        });
        setScores(scoresMap);
      } catch (err) {
        setError(err.message || 'Failed to load evaluations.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) =>
      !q || (s.full_name ?? "").toLowerCase().includes(q) || (s.email ?? "").toLowerCase().includes(q)
    );
  }, [students, search]);

  const getEval = (studentId, type) =>
    evaluations.find((e) => e.student === studentId && e.evaluation_type === type);

  const stats = useMemo(() => {
    const evaluated = students.filter((s) =>
      getEval(s.id, 'workplace') || getEval(s.id, 'academic')
    ).length;
    const avgFinal = Object.values(scores).length
      ? Math.round(Object.values(scores).reduce((a, s) => a + (s.final_score ?? 0), 0) / Object.values(scores).length)
      : 0;
    return {
      total: students.length,
      evaluated,
      pending: students.length - evaluated,
      avgFinal,
    };
  }, [students, evaluations, scores]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#1a3050] bg-[#0d1926] px-7 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <Award className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                <h1 className="text-2xl font-bold text-white">Student Evaluations</h1>
                <p className="text-sm text-slate-400 mt-0.5">Complete evaluation breakdown per student with weighted final scores.</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: stats.total,     color: "text-sky-400"     },
              { label: "Evaluated",      value: stats.evaluated,  color: "text-emerald-400" },
              { label: "Pending",        value: stats.pending,    color: "text-amber-400"   },
              { label: "Avg Final Score",value: `${stats.avgFinal}/100`, color: "text-violet-400" },
            ].map(({ label, value, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or email…"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</div>
          )}

          {loading ? (
            <div className="py-24 text-center text-slate-500">Loading evaluations...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]">
              <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No students found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student, i) => (
                <StudentEvalCard
                  key={student.id}
                  student={student}
                  workplaceEval={getEval(student.id, 'workplace')}
                  academicEval={getEval(student.id, 'academic')}
                  scoreData={scores[student.id]}
                  index={i}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
};

export default AdminEvaluations;