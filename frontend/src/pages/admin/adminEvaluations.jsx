import AppLayout from "@/components/AppLayout";
import { mockEvaluations } from "@/data/mockData";
import { motion } from "framer-motion";
import { Award, Target } from "lucide-react";

/* ─── Animation variants ──────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const emptyVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

/* ─── Sub-components ──────────────────────────────────────── */

/** Animated progress bar for a single criterion */
const CriterionBar = ({ criterion, delay = 0 }) => {
  const { name, score, maxScore } = criterion;
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-muted-foreground w-36 flex-shrink-0">{name}</p>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-2 bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-xs font-bold text-foreground w-12 text-right">
        {score}/{maxScore}
      </span>
    </div>
  );
};

/** Gradient icon badge — emerald for workplace, violet for academic */
const TypeBadge = ({ type }) => {
  const isWorkplace = type === "workplace";
  const gradientClass = isWorkplace
    ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
    : "bg-gradient-to-br from-violet-400 to-violet-600";

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full shadow ${gradientClass}`}
    >
      <Target className="w-5 h-5 text-white" />
    </div>
  );
};

/** Single evaluation card */
const EvaluationCard = ({ ev, index }) => {
  const weightedScore =
    ev.maxTotal > 0
      ? ((ev.totalScore / ev.maxTotal) * ev.weight).toFixed(1)
      : "0.0";

  const typeLabel = ev.type === "workplace" ? "Workplace" : "Academic";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow border border-yellow-100 mb-4"
    >
      {/* Decorative top line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-t-xl mb-4" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: avatar + meta */}
        <div className="flex items-center gap-3">
          <TypeBadge type={ev.type} />
          <div>
            <p className="text-base font-bold text-foreground font-display">
              {ev.studentName}
            </p>
            <p className="text-xs text-muted-foreground">
              {typeLabel} Evaluation by {ev.evaluatorName}
            </p>
          </div>
        </div>

        {/* Right: score */}
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-700">
            {ev.totalScore}
            <span className="text-base text-muted-foreground font-bold">
              /{ev.maxTotal}
            </span>
          </p>
          <p className="text-xs text-yellow-600 font-semibold">
            Weight: {ev.weight}%
          </p>
        </div>
      </div>

      {/* Criteria bars */}
      <div className="space-y-3 mb-5">
        {ev.criteria.map((c, ci) => (
          <CriterionBar key={c.name} criterion={c} delay={0.3 + ci * 0.07} />
        ))}
      </div>

      {/* Footer strip */}
      <div className="flex justify-between items-center bg-white/80 p-3 rounded-lg border-t border-yellow-100 text-xs text-gray-600">
        <span>Weighted: {weightedScore}%</span>
        <span>Submitted: {ev.submittedAt}</span>
      </div>
    </motion.div>
  );
};

/** Empty state */
const EmptyState = () => (
  <motion.div
    variants={emptyVariants}
    initial="initial"
    animate="animate"
    className="text-center py-20 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow border border-yellow-100"
  >
    <div className="flex items-center justify-center mb-4">
      <Award className="w-10 h-10 text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-bold font-display text-foreground">
      No Evaluations Yet
    </h2>
  </motion.div>
);

/* ─── Page ────────────────────────────────────────────────── */
const AdminEvaluations = () => (
  <AppLayout>
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-[0.15em]">
            Evaluations
          </span>
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
          Evaluations
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View all submitted evaluation scores
        </p>
      </motion.div>

      {/* Content */}
      {mockEvaluations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {mockEvaluations.map((ev, i) => (
            <EvaluationCard key={ev.id} ev={ev} index={i} />
          ))}
        </div>
      )}
    </div>
  </AppLayout>
);

export default AdminEvaluations;
