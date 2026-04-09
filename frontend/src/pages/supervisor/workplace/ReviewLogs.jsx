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

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1926] border-l border-[#1a3050] shadow-2xl flex flex-col overflow-hidden"
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        ></motion.div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3050] bg-[#0b1523] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <FileText className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Review Log</p>
                <p className="text-xs text-slate-500">Week {log.week_number} · {log.student_name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Log Details */}
            <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">{log.student_name}</p>
                <StatusBadge status={log.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div><span className="text-slate-600">Week</span><p className="text-white mt-0.5">Week {log.week_number}</p></div>
                <div><span className="text-slate-600">Date</span><p className="text-white mt-0.5">{log.date}</p></div>
              </div>
            </div>

            {/* Activities */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Activities</p>
              <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{log.activities}</p>
              </div>
            </div>

            {/* Learnings */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Learnings</p>
              <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{log.learnings}</p>
              </div>
            </div>

            {/* Challenges */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Challenges</p>
              <div className="rounded-xl bg-[#0b1523] border border-[#1e3a5f] p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{log.challenges}</p>
              </div>
            </div>

            {/* Criteria Scores */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Score Criteria</p>
                <span className="text-xs text-sky-400 font-semibold">{totalScore}/30</span>
              </div>
              <div className="space-y-4">
                {LOGBOOK_CRITERIA.map((c) => (
                  <div key={c.criteria}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-white">{c.label}</label>
                      <span className="text-xs text-slate-500">{criteriaScores[c.criteria]}/{c.max_score}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={c.max_score}
                        value={criteriaScores[c.criteria]}
                        onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                        className="flex-1 accent-sky-500" />
                      <input type="number" min={0} max={c.max_score}
                        value={criteriaScores[c.criteria]}
                        onChange={(e) => handleScoreChange(c.criteria, e.target.value, c.max_score)}
                        className="w-14 px-2 py-1.5 rounded-lg bg-[#0b1523] border border-[#1e3a5f] text-white text-center text-sm focus:outline-none focus:border-sky-500/50" />
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-sky-500 transition-all duration-300"
                        style={{ width: `${(criteriaScores[c.criteria] / c.max_score) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
{/* Comment */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Supervisor Comment</p>
              <textarea rows={3} placeholder="Add feedback for the student…"
                value={comment} onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition resize-none" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1a3050] bg-[#0b1523] flex-shrink-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSubmit(log, 'rejected', comment, criteriaScores)}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-semibold transition disabled:opacity-50">
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => onSubmit(log, 'reviewed', comment, criteriaScores)}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-sm font-semibold transition disabled:opacity-50">
                <Eye className="w-4 h-4" /> Mark Reviewed
              </button>
            </div>
            <button
              onClick={() => onSubmit(log, 'approved', comment, criteriaScores)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-50">
              <CheckCircle2 className="w-4 h-4" /> Approve Log
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const StudentRow = ({ placement, logs, onReview, index }) => {
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
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left">
        <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300 flex-shrink-0">
          {(placement.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{placement.student_name}</p>
          <p className="text-xs text-slate-500 truncate">{placement.company}</p>
        </div>
        <div className="hidden sm:block w-28">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-600">Progress</span>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1a3050] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center hidden md:block">
            <p className="text-sm font-bold text-white">{logs.length}</p>
            <p className="text-xs text-slate-600">logs</p>
          </div>
          {pending > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-medium border border-amber-500/30">
              <AlertCircle className="w-3 h-3" /> {pending}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>
            <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="logs"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="border-t border-[#1a3050]">
              {logs.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No logs submitted yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#122030]">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#122030] border border-[#1a3050] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-slate-400">W{log.week_number}</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Week {log.week_number}</p>
                          <p className="text-xs text-slate-500">{log.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={log.status} />
                        {log.status === 'submitted' && (
                          <button onClick={() => onReview(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition">
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
      </AnimatePresence>
    </motion.div>
  );
};


