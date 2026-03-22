import AppLayout from "@/components/AppLayout";
import { mockEvaluations, mockUsers } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Award, Target, Search, Filter, Download, X,
  ChevronDown, CheckCircle2, AlertCircle, TrendingUp,
  User, Calendar, Briefcase, GraduationCap, Eye,
  ArrowUpDown, BarChart3,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const TYPE_META = {
  workplace: {
    label: "Workplace",
    icon:  Briefcase,
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    bar:   "bg-emerald-500",
    text:  "text-emerald-400",
    ring:  "bg-emerald-500/10 border-emerald-500/20",
  },
  academic: {
    label: "Academic",
    icon:  GraduationCap,
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    bar:   "bg-violet-500",
    text:  "text-violet-400",
    ring:  "bg-violet-500/10 border-violet-500/20",
  },
};

const gradeFromPct = (pct) => {
  if (pct >= 90) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (pct >= 80) return { grade: "A",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25" };
  if (pct >= 70) return { grade: "B",  color: "text-sky-400",     bg: "bg-sky-500/10     border-sky-500/25"     };
  if (pct >= 60) return { grade: "C",  color: "text-amber-400",   bg: "bg-amber-500/10   border-amber-500/25"   };
  if (pct >= 50) return { grade: "D",  color: "text-orange-400",  bg: "bg-orange-500/10  border-orange-500/25"  };
  return              { grade: "F",  color: "text-red-400",     bg: "bg-red-500/10     border-red-500/25"     };
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
   Criterion bar
───────────────────────────────────────────── */
const CriterionBar = ({ criterion, type, delay = 0 }) => {
  const { name, score, maxScore } = criterion;
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const meta = TYPE_META[type] ?? TYPE_META.workplace;

  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-slate-500 w-32 flex-shrink-0 truncate">{name}</p>
      <div className="flex-1 h-1.5 bg-[#1a3050] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${meta.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-xs font-semibold ws-mono text-slate-400 w-14 text-right flex-shrink-0">
        {score}/{maxScore}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Detail Drawer
───────────────────────────────────────────── */
const DetailDrawer = ({ ev, onClose }) => {
  if (!ev) return null;
  const meta    = TYPE_META[ev.type] ?? TYPE_META.workplace;
  const pct     = ev.maxTotal > 0 ? Math.round((ev.totalScore / ev.maxTotal) * 100) : 0;
  const grade   = gradeFromPct(pct);
  const weighted = ev.maxTotal > 0 ? ((ev.totalScore / ev.maxTotal) * ev.weight).toFixed(1) : "0.0";
  const TypeIcon = meta.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1926] border-l border-[#1a3050] shadow-2xl flex flex-col"
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${meta.ring} border`}>
                <TypeIcon className={`w-4 h-4 ${meta.text}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Evaluation Detail</p>
                <p className="text-xs text-slate-500">{meta.label} · {ev.studentName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 ws-scrollbar">
            {/* Score summary */}
            <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-base font-bold text-white">{ev.studentName}</p>
                  <p className="text-xs text-slate-500">Evaluated by {ev.evaluatorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold ws-mono text-white">
                    {ev.totalScore}
                    <span className="text-base text-slate-500">/{ev.maxTotal}</span>
                  </p>
                  <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-semibold ${grade.bg} ${grade.color}`}>
                    Grade {grade.grade}
                  </span>
                </div>
              </div>

              {/* Ring progress */}
              <div className="flex items-center gap-4">
                {/* Mini ring */}
                <div className="relative flex-shrink-0">
                  <svg width="64" height="64" className="-rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="#1a3050" strokeWidth="5" fill="none" />
                    <circle
                      cx="32" cy="32" r="26"
                      stroke={ev.type === "workplace" ? "#34d399" : "#a78bfa"}
                      strokeWidth="5" fill="none"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - pct / 100)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.7s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ws-mono ${meta.text}`}>{pct}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  {[
                    { label: "Weighted Score", value: `${weighted}%` },
                    { label: "Weight",         value: `${ev.weight}%` },
                    { label: "Type",           value: meta.label    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-300 font-medium ws-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Criteria detail */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Criteria Breakdown</p>
              <div className="space-y-3">
                {ev.criteria.map((c, i) => (
                  <CriterionBar key={c.name} criterion={c} type={ev.type} delay={0.1 + i * 0.06} />
                ))}
              </div>
            </div>

            {/* Comments */}
            {ev.comments && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Comments</p>
                <div className="px-4 py-3 rounded-xl bg-[#0b1523] border border-[#1e3a5f]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{ev.comments}"</p>
                </div>
              </div>
            )}

            {/* Submitted date */}
            {ev.submittedAt && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5" />
                Submitted: <span className="text-slate-400">{ev.submittedAt}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Evaluation card (list item)
───────────────────────────────────────────── */
const EvaluationCard = ({ ev, index, onView }) => {
  const meta    = TYPE_META[ev.type] ?? TYPE_META.workplace;
  const pct     = ev.maxTotal > 0 ? Math.round((ev.totalScore / ev.maxTotal) * 100) : 0;
  const grade   = gradeFromPct(pct);
  const TypeIcon = meta.icon;
  const weighted = ev.maxTotal > 0 ? ((ev.totalScore / ev.maxTotal) * ev.weight).toFixed(1) : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden hover:border-[#1e3a5f] transition-colors"
    >
      {/* Top accent line */}
      <div className={`h-0.5 w-full ${meta.bar}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl ${meta.ring} border flex-shrink-0`}>
              <TypeIcon className={`w-4 h-4 ${meta.text}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{ev.studentName}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {meta.label} · {ev.evaluatorName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Grade */}
            <div className={`text-center px-2.5 py-1.5 rounded-xl border ${grade.bg}`}>
              <p className={`text-lg font-bold ws-mono leading-none ${grade.color}`}>{grade.grade}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{pct}%</p>
            </div>
            {/* Score */}
            <div className="text-right">
              <p className="text-lg font-bold ws-mono text-white leading-none">
                {ev.totalScore}<span className="text-sm text-slate-500">/{ev.maxTotal}</span>
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">Weight {ev.weight}%</p>
            </div>
          </div>
        </div>

        {/* Criteria bars */}
        <div className="space-y-2.5 mb-4">
          {ev.criteria.map((c, ci) => (
            <CriterionBar key={c.name} criterion={c} type={ev.type} delay={0.2 + ci * 0.05} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#122030]">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Weighted: <span className={`font-semibold ws-mono ${meta.text}`}>{weighted}%</span></span>
            {ev.submittedAt && (
              <>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {ev.submittedAt}
                </span>
              </>
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

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
const AdminEvaluations = () => {
  const [search, setSearch]       = useState("");
  const [typeFilter, setType]     = useState("all");
  const [sortField, setSort]      = useState("score");
  const [sortAsc, setSortAsc]     = useState(false);
  const [activeEv, setActiveEv]   = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const evaluations = mockEvaluations ?? [];

  /* Derived stats */
  const stats = useMemo(() => {
    const total     = evaluations.length;
    const workplace = evaluations.filter((e) => e.type === "workplace").length;
    const academic  = evaluations.filter((e) => e.type === "academic").length;
    const avgPct    = total
      ? Math.round(evaluations.reduce((s, e) => s + (e.maxTotal > 0 ? (e.totalScore / e.maxTotal) * 100 : 0), 0) / total)
      : 0;
    return { total, workplace, academic, avgPct };
  }, [evaluations]);

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let list = evaluations.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (e.studentName  ?? "").toLowerCase().includes(q) ||
        (e.evaluatorName ?? "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || e.type === typeFilter;
      return matchSearch && matchType;
    });

    list = [...list].sort((a, b) => {
      let va, vb;
      if (sortField === "score") {
        va = a.maxTotal > 0 ? a.totalScore / a.maxTotal : 0;
        vb = b.maxTotal > 0 ? b.totalScore / b.maxTotal : 0;
      } else if (sortField === "name") {
        va = a.studentName ?? "";
        vb = b.studentName ?? "";
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      } else {
        va = a.weight ?? 0;
        vb = b.weight ?? 0;
      }
      return sortAsc ? va - vb : vb - va;
    });

    return list;
  }, [evaluations, search, typeFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSort(field); setSortAsc(false); }
  };

  const handleExport = () => {
    const rows = [
      ["Student", "Evaluator", "Type", "Score", "Max", "%", "Weight", "Submitted"],
      ...evaluations.map((e) => [
        e.studentName, e.evaluatorName, e.type, e.totalScore, e.maxTotal,
        e.maxTotal > 0 ? Math.round((e.totalScore / e.maxTotal) * 100) : 0,
        e.weight, e.submittedAt ?? "",
      ]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "evaluations.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Evaluations exported.");
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-evals  { font-family: 'DM Sans', sans-serif; }
        .ws-mono   { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-evals min-h-screen bg-[#07101f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
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
                  <Award className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Evaluations</h1>
                  <p className="text-sm text-slate-400 mt-0.5">All submitted student evaluation scores.</p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition flex-shrink-0"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </motion.div>

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Evaluations", value: stats.total,     sub: "all types",                color: "sky:400",     bg: "bg-sky-500/10     border-sky-500/20"     },
              { label: "Workplace",         value: stats.workplace,  sub: "workplace type",           color: "emerald:400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Academic",          value: stats.academic,   sub: "academic type",            color: "violet:400",  bg: "bg-violet-500/10  border-violet-500/20"  },
              { label: "Average Score",     value: `${stats.avgPct}%`, sub: "across all evals",      color: "amber:400",   bg: "bg-amber-500/10   border-amber-500/20"   },
            ].map(({ label, value, sub, color, bg }, i) => {
              const [bgCls, borderCls] = bg.split(" ");
              const textCls = `text-${color.replace(":", "-")}`;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-2xl ${bgCls} border ${borderCls} p-5`}
                >
                  <p className={`text-2xl font-bold ws-mono ${textCls}`}>{value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
                </motion.div>
              );
            })}
          </div>

          {/* ── Filters + sort ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or evaluator…"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type filter */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={typeFilter}
                onChange={(e) => setType(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All types</option>
                <option value="workplace">Workplace</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={sortField}
                onChange={(e) => toggleSort(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="score">Sort: Score</option>
                <option value="name">Sort: Name</option>
                <option value="weight">Sort: Weight</option>
              </select>
            </div>
          </motion.div>

          {/* Results count */}
          {evaluations.length > 0 && (
            <p className="text-xs text-slate-600">
              Showing <span className="text-slate-400 font-medium">{filtered.length}</span> of{" "}
              <span className="text-slate-400 font-medium">{evaluations.length}</span> evaluations
            </p>
          )}

          {/* ── Content ── */}
          {evaluations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]"
            >
              <Award className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <h2 className="text-base font-semibold text-white mb-1">No Evaluations Yet</h2>
              <p className="text-sm text-slate-500">Submitted evaluations will appear here.</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center rounded-2xl bg-[#0d1926] border border-[#1a3050]"
            >
              <Target className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No evaluations match your filters.</p>
              <button
                onClick={() => { setSearch(""); setType("all"); }}
                className="mt-3 text-xs text-sky-400 hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ev, i) => (
                <EvaluationCard key={ev.id} ev={ev} index={i} onView={setActiveEv} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail drawer ── */}
      <AnimatePresence>
        {activeEv && (
          <DetailDrawer key="drawer" ev={activeEv} onClose={() => setActiveEv(null)} />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default AdminEvaluations;