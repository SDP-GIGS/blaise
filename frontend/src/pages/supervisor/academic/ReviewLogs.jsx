import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import {
  ClipboardCheck, User, Building2, BookOpen, Search,
  Filter, Eye, CheckCircle2, Clock, AlertCircle, X,
  ChevronRight,
} from "lucide-react";

const STATUS_META = {
  approved:  { label: "Approved",      bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  submitted: { label: "Pending Review", bg: "bg-amber-100 text-amber-800 border-amber-200"     },
  reviewed:  { label: "Reviewed",       bg: "bg-sky-100 text-sky-800 border-sky-200"            },
  rejected:  { label: "Rejected",       bg: "bg-red-100 text-red-800 border-red-200"            },
  draft:     { label: "Draft",          bg: "bg-gray-100 text-gray-600 border-gray-200"         },
};

const Badge = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${meta.bg}`}>
      {meta.label}
    </span>
  );
};

const LogDetailPanel = ({ log, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10"
        style={{ borderTop: "3px solid #0891b2" }}>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Weekly Log</p>
          <h2 className="text-lg font-extrabold text-gray-900">Week {log.week_number} — {log.date}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={log.status} />
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          Submitted: {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
        </div>
        {[
          { label: "Activities Undertaken", value: log.activities, accent: "#0891b2" },
          { label: "Key Learnings",          value: log.learnings,  accent: "#059669" },
          { label: "Challenges Faced",       value: log.challenges, accent: "#f59e0b" },
        ].map(({ label, value, accent }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-0.5 rounded-full" style={{ background: accent }} />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {value || "—"}
            </p>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-xs text-gray-400">
          <AlertCircle size={12} className="text-amber-400" />
          This is a read-only view. Log reviews are handled by the workplace supervisor.
        </div>
      </div>
    </div>
  </div>
);