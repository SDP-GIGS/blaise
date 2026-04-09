import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, ChevronDown, CheckCircle2, XCircle,
  Clock, Search, Filter, Eye, FileText, X, AlertCircle,
  User,
} from "lucide-react";

const LOGBOOK_CRITERIA = [
  { criteria: 'quality_of_work', label: 'Quality of Work', max_score: 10 },
  { criteria: 'initiative',      label: 'Initiative & Creativity', max_score: 10 },
  { criteria: 'punctuality',     label: 'Punctuality & Deadlines', max_score: 10 },
];

const statusMeta = {
  submitted: { label: "Submitted", cls: "bg-amber-400/15 text-amber-300 border-amber-500/30" },
  reviewed:  { label: "Reviewed",  cls: "bg-sky-400/15 text-sky-300 border-sky-500/30"       },
  approved:  { label: "Approved",  cls: "bg-emerald-400/15 text-emerald-300 border-emerald-500/30" },
  rejected:  { label: "Rejected",  cls: "bg-red-400/15 text-red-300 border-red-500/30"       },
  draft:     { label: "Draft",     cls: "bg-slate-400/15 text-slate-300 border-slate-500/30" },
};

const StatusBadge = ({ status }) => {
  const m = statusMeta[status] ?? statusMeta.draft;
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${m.cls}`}>
      {m.label}
    </span>
  );
};

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

const ReviewDrawer = ({ log, onClose, onSubmit, saving }) => {
  const [comment, setComment] = useState("");
  const [criteriaScores, setCriteriaScores] = useState(
    Object.fromEntries(LOGBOOK_CRITERIA.map((c) => [c.criteria, 0]))
  );

  const totalScore = Object.values(criteriaScores).reduce((a, b) => a + Number(b), 0);

  const handleScoreChange = (criteria, value, max) => {
    const num = Math.min(Math.max(0, Number(value)), max);
    setCriteriaScores((prev) => ({ ...prev, [criteria]: num }));
  };

  if (!log) return null;