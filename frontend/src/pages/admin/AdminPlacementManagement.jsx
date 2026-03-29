import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { mockPlacements, mockUsers } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Building2, X, Search, Filter, Edit2, Trash2,
  CheckCircle2, AlertCircle, ChevronDown, Calendar,
  User, Briefcase, Users, Clock, MoreVertical,
  Download, Eye, ArrowUpDown, MapPin,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Status config
───────────────────────────────────────────── */
const STATUS_META = {
  active:    { label: "Active",    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25" },
  completed: { label: "Completed", cls: "bg-sky-500/10     text-sky-300     border-sky-500/25"     },
  pending:   { label: "Pending",   cls: "bg-amber-500/10   text-amber-300   border-amber-500/25"   },
  inactive:  { label: "Inactive",  cls: "bg-slate-500/10   text-slate-400   border-slate-500/25"   },
};

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${m.cls}`}>
      {m.label}
    </span>
  );
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
   Confirm Modal
───────────────────────────────────────────── */
const ConfirmModal = ({ open, title, description, onConfirm, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-2xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <div className="px-6 pt-6 pb-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              </div>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition">
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────
   Placement Form Modal (create / edit)
───────────────────────────────────────────── */
const EMPTY_FORM = {
  studentId: "", company: "", department: "",
  startDate: "", endDate: "", workplaceSupervisor: "",
  academicSupervisor: "", status: "pending",
};

const PlacementModal = ({ open, onClose, onSave, editPlacement, students }) => {
  const [form, setForm] = useState(editPlacement ?? EMPTY_FORM);
  const isEdit = !!editPlacement;

  useMemo(() => {
    setForm(editPlacement ?? EMPTY_FORM);
  }, [editPlacement, open]);

  const valid = form.studentId && form.company;
  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition";
  const labelCls = "block text-xs font-medium text-slate-500 mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-xl rounded-2xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f] bg-[#0b1523]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Building2 className="w-4 h-4 text-sky-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {isEdit ? "Edit Placement" : "Create New Placement"}
                </h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto ws-scrollbar">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Student */}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Student <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select value={form.studentId} onChange={f("studentId")} disabled={isEdit}
                      className={`${inputCls} pl-10 appearance-none disabled:opacity-50`}>
                      <option value="">Select student…</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className={labelCls}>Company <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input value={form.company} onChange={f("company")} placeholder="e.g. MTN Uganda"
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className={labelCls}>Department</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input value={form.department} onChange={f("department")} placeholder="e.g. Engineering"
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                {/* Workplace supervisor */}
                <div>
                  <label className={labelCls}>Workplace Supervisor</label>
                  <input value={form.workplaceSupervisor} onChange={f("workplaceSupervisor")}
                    placeholder="Supervisor name" className={inputCls} />
                </div>

                {/* Academic supervisor */}
                <div>
                  <label className={labelCls}>Academic Supervisor</label>
                  <input value={form.academicSupervisor} onChange={f("academicSupervisor")}
                    placeholder="Supervisor name" className={inputCls} />
                </div>

                {/* Start date */}
                <div>
                  <label className={labelCls}>Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input type="date" value={form.startDate} onChange={f("startDate")}
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                {/* End date */}
                <div>
                  <label className={labelCls}>End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input type="date" value={form.endDate} onChange={f("endDate")}
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>

                {/* Status (edit only) */}
                {isEdit && (
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Status</label>
                    <select value={form.status} onChange={f("status")}
                      className={`${inputCls} appearance-none`}>
                      {Object.entries(STATUS_META).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#1e3a5f] bg-[#0b1523]">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button
                disabled={!valid}
                onClick={() => { onSave(form); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
              >
                {isEdit ? "Save Changes" : "Create Placement"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   Row action menu
───────────────────────────────────────────── */
const ActionMenu = ({ onEdit, onDelete, onChangeStatus }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition">
        <MoreVertical className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
            >
              {[
                { icon: Edit2,  label: "Edit",            action: onEdit,         cls: "text-slate-300 hover:text-white"   },
                { icon: CheckCircle2, label: "Mark Active", action: () => onChangeStatus("active"),   cls: "text-emerald-400 hover:text-emerald-300" },
                { icon: Clock,  label: "Mark Completed",  action: () => onChangeStatus("completed"), cls: "text-sky-400    hover:text-sky-300"     },
                { icon: Trash2, label: "Delete",          action: onDelete,       cls: "text-red-400    hover:text-red-300"    },
              ].map(({ icon: Icon, label, action, cls }) => (
                <button key={label} onClick={() => { action(); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-white/[0.04] transition ${cls}`}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" /> {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
const PlacementManagement = () => {
  const [placements, setPlacements] = useState(
    mockPlacements.map((p) => ({ ...p, status: p.status ?? "pending" }))
  );
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editPlacement, setEditPlacement] = useState(null);
  const [confirm,       setConfirm]       = useState(null);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [sortField,     setSortField]     = useState("studentName");
  const [sortAsc,       setSortAsc]       = useState(true);
  const [toast,         setToast]         = useState(null);

  const students = mockUsers.filter((u) => u.role === "student");

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:     placements.length,
    active:    placements.filter((p) => p.status === "active").length,
    pending:   placements.filter((p) => p.status === "pending").length,
    completed: placements.filter((p) => p.status === "completed").length,
  }), [placements]);

  /* ── Filtered + sorted ── */
  const filtered = useMemo(() => {
    let list = placements.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (p.studentName ?? "").toLowerCase().includes(q) ||
        (p.company     ?? "").toLowerCase().includes(q) ||
        (p.department  ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return [...list].sort((a, b) => {
      const va = (a[sortField] ?? "").toString();
      const vb = (b[sortField] ?? "").toString();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [placements, search, statusFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(true); }
  };

  /* ── Handlers ── */
  const handleCreate = (form) => {
    const student = students.find((s) => String(s.id) === String(form.studentId));
    const newP = {
      ...form,
      id: `p-${Date.now()}`,
      studentName: student?.name ?? "",
      status: "pending",
    };
    setPlacements((prev) => [newP, ...prev]);
    showToast(`Placement for ${student?.name ?? "student"} created.`);
  };

  const handleEdit = (form) => {
    setPlacements((prev) => prev.map((p) => p.id === form.id ? { ...p, ...form } : p));
    showToast("Placement updated.");
  };

  const handleDelete = (id) => {
    const p = placements.find((x) => x.id === id);
    setPlacements((prev) => prev.filter((x) => x.id !== id));
    showToast(`${p?.studentName ?? "Placement"} removed.`);
  };

  const handleChangeStatus = (id, status) => {
    setPlacements((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    showToast(`Status updated to ${STATUS_META[status]?.label ?? status}.`);
  };

  const handleExport = () => {
    const rows = [
      ["Student", "Company", "Department", "Start", "End", "Status", "WP Supervisor", "AC Supervisor"],
      ...placements.map((p) => [p.studentName, p.company, p.department, p.startDate, p.endDate, p.status, p.workplaceSupervisor, p.academicSupervisor]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "placements.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Placements exported.");
  };

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-pm { font-family: 'DM Sans', sans-serif; }
        .ws-mono { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-pm min-h-screen bg-[#07101f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

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
                  <Building2 className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Placement Management</h1>
                  <p className="text-sm text-slate-400 mt-0.5">Assign and manage student internship placements.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition">
                  <Download className="w-4 h-4" /> Export
                </button>
                <button
                  onClick={() => { setEditPlacement(null); setModalOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition shadow-lg shadow-sky-900/30"
                >
                  <Plus className="w-4 h-4" /> New Placement
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total",     value: stats.total,     color: "sky",     filterVal: "all"       },
              { label: "Active",    value: stats.active,    color: "emerald", filterVal: "active"    },
              { label: "Pending",   value: stats.pending,   color: "amber",   filterVal: "pending"   },
              { label: "Completed", value: stats.completed, color: "violet",  filterVal: "completed" },
            ].map(({ label, value, color, filterVal }, i) => {
              const active = statusFilter === filterVal;
              return (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setStatusFilter(active && filterVal !== "all" ? "all" : filterVal)}
                  className={`rounded-2xl p-5 text-left border transition-all duration-200 hover:brightness-110 ${
                    active
                      ? `bg-${color}-500/10 border-${color}-500/20`
                      : "bg-[#0d1926] border-[#1a3050]"
                  }`}
                >
                  <p className={`text-2xl font-bold ws-mono text-${color}-400`}>{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label} placements</p>
                  {active && filterVal !== "all" && (
                    <p className="text-xs text-slate-600 mt-0.5">filtered</p>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ── Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, company or department…"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* ── Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden"
          >
            {/* Column headers */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#1a3050] bg-[#0b1523]">
              {[
                { label: "Student",  field: "studentName" },
                { label: "Company",  field: "company"     },
                { label: "Dept",     field: "department"  },
                { label: "Duration", field: "startDate"   },
              ].map(({ label, field }) => (
                <button key={field} onClick={() => toggleSort(field)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition text-left">
                  {label}
                  <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-sky-400" : ""}`} />
                </button>
              ))}
              <span className="text-xs font-medium text-slate-500">Status</span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#122030] ws-scrollbar overflow-y-auto max-h-[540px]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Building2 className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    {search || statusFilter !== "all"
                      ? "No placements match your filters."
                      : "No placements yet. Create one to get started."}
                  </p>
                  {(search || statusFilter !== "all") && (
                    <button onClick={() => { setSearch(""); setStatusFilter("all"); }}
                      className="mt-3 text-xs text-sky-400 hover:underline">
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-2 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Student */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-300 flex-shrink-0">
                        {(p.studentName ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.studentName}</p>
                        {p.workplaceSupervisor && (
                          <p className="text-xs text-slate-600 truncate">WP: {p.workplaceSupervisor}</p>
                        )}
                      </div>
                    </div>

                    {/* Company */}
                    <div className="min-w-0">
                      <p className="text-sm text-slate-300 truncate">{p.company}</p>
                    </div>

                    {/* Dept */}
                    <div className="min-w-0">
                      <p className="text-sm text-slate-400 truncate">{p.department || "—"}</p>
                    </div>

                    {/* Duration */}
                    <div>
                      {p.startDate ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="ws-mono">{p.startDate}</span>
                          {p.endDate && <><span className="text-slate-700">→</span><span className="ws-mono">{p.endDate}</span></>}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">No dates set</span>
                      )}
                    </div>

                    {/* Status */}
                    <StatusBadge status={p.status} />

                    {/* Actions */}
                    <ActionMenu
                      onEdit={() => { setEditPlacement(p); setModalOpen(true); }}
                      onDelete={() => setConfirm({
                        title: `Delete ${p.studentName}'s placement?`,
                        description: "This placement will be permanently removed.",
                        onConfirm: () => handleDelete(p.id),
                      })}
                      onChangeStatus={(status) => handleChangeStatus(p.id, status)}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#1a3050] bg-[#0b1523]">
              <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{" "}
                <span className="text-slate-300 font-medium">{placements.length}</span> placements
              </p>
              {(search || statusFilter !== "all") && (
                <button onClick={() => { setSearch(""); setStatusFilter("all"); }}
                  className="text-xs text-sky-400 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Modals ── */}
      <PlacementModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditPlacement(null); }}
        onSave={editPlacement ? handleEdit : handleCreate}
        editPlacement={editPlacement}
        students={students}
      />

      <ConfirmModal
        open={!!confirm}
        title={confirm?.title}
        description={confirm?.description}
        onConfirm={confirm?.onConfirm ?? (() => {})}
        onClose={() => setConfirm(null)}
      />
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default PlacementManagement;
