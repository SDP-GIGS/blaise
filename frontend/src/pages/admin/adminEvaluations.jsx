import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Search, Filter, X, Briefcase, GraduationCap, Eye, Calendar } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const TYPE_META = {
  workplace: {
    label: "Workplace",
    icon: Briefcase,
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    ring: "bg-emerald-500/10 border-emerald-500/20",
  },
  academic: {
    label: "Academic",
    icon: GraduationCap,
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    bar: "bg-violet-500",
    text: "text-violet-400",
    ring: "bg-violet-500/10 border-violet-500/20",
  },
};

const gradeFromScore = (score) => {
  if (score >= 90) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (score >= 80) return { grade: "A",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (score >= 70) return { grade: "B",  color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/25" };
  if (score >= 60) return { grade: "C",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/25" };
  if (score >= 50) return { grade: "D",  color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/25" };
  return               { grade: "F",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/25" };
};

const DetailDrawer = ({ ev, onClose }) => {
  if (!ev) return null;
  const meta = TYPE_META[ev.evaluation_type] ?? TYPE_META.workplace;
  const grade = gradeFromScore(ev.score);
  const TypeIcon = meta.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1926] border-l border-[#1a3050] shadow-2xl flex flex-col"
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523]">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${meta.ring} border`}>
                <TypeIcon className={`w-4 h-4 ${meta.text}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Evaluation Detail</p>
                <p className="text-xs text-slate-500">{meta.label} · {ev.student_name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-base font-bold text-white">{ev.student_name}</p>
                  <p className="text-xs text-slate-500">Evaluated by {ev.evaluator_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{ev.score}<span className="text-base text-slate-500">/100</span></p>
                  <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-semibold ${grade.bg} ${grade.color}`}>
                    Grade {grade.grade}
                  </span>
                </div>
              </div>
            </div>

            {ev.comments && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Comments</p>
                <div className="px-4 py-3 rounded-xl bg-[#0b1523] border border-[#1e3a5f]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{ev.comments}"</p>
                </div>
              </div>
            )}

            {ev.date && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5" />
                Submitted: <span className="text-slate-400">{ev.date}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const EvaluationCard = ({ ev, index, onView }) => {
  const meta = TYPE_META[ev.evaluation_type] ?? TYPE_META.workplace;
  const grade = gradeFromScore(ev.score);
  const TypeIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055 }}
      className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden hover:border-[#1e3a5f] transition-colors"
    >
      <div className={`h-0.5 w-full ${meta.bar}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl ${meta.ring} border flex-shrink-0`}>
              <TypeIcon className={`w-4 h-4 ${meta.text}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{ev.student_name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{meta.label} · {ev.evaluator_name}</p>
            </div>
          </div>
          <div className={`text-center px-2.5 py-1.5 rounded-xl border ${grade.bg}`}>
            <p className={`text-lg font-bold leading-none ${grade.color}`}>{grade.grade}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{ev.score}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#122030]">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            {ev.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {ev.date}
              </span>
            )}
          </div>
          <button
            onClick={() => onView(ev)}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition ${meta.ring} ${meta.text} hover:brightness-125`}
          >
            <Eye className="w-3 h-3" /> View Detail
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeEv, setActiveEv] = useState(null);

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const data = await apiClient.get('/evaluations/');
        setEvaluations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load evaluations.');
      } finally {
        setLoading(false);
      }
    };
    loadEvaluations();
  }, []);

  const stats = useMemo(() => ({
    total: evaluations.length,
    workplace: evaluations.filter((e) => e.evaluation_type === 'workplace').length,
    academic: evaluations.filter((e) => e.evaluation_type === 'academic').length,
    avgScore: evaluations.length
      ? Math.round(evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length)
      : 0,
  }), [evaluations]);

  const filtered = useMemo(() => {
    return evaluations.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (e.student_name ?? "").toLowerCase().includes(q) ||
        (e.evaluator_name ?? "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || e.evaluation_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [evaluations, search, typeFilter]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#1a3050] bg-[#0d1926] px-7 py-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <Award className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                <h1 className="text-2xl font-bold text-white">Evaluations</h1>
                <p className="text-sm text-slate-400 mt-0.5">All submitted student evaluation scores.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: stats.total, color: "text-sky-400" },
              { label: "Workplace", value: stats.workplace, color: "text-emerald-400" },
              { label: "Academic", value: stats.academic, color: "text-violet-400" },
              { label: "Avg Score", value: `${stats.avgScore}%`, color: "text-amber-400" },
            ].map(({ label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5"
              >
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or evaluator…"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="workplace">Workplace</option>
                <option value="academic">Academic</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-24 text-center text-slate-500">Loading evaluations...</div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]">
              <Award className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No evaluations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ev, i) => (
                <EvaluationCard key={ev.id} ev={ev} index={i} onView={setActiveEv} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeEv && <DetailDrawer key="drawer" ev={activeEv} onClose={() => setActiveEv(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default AdminEvaluations;