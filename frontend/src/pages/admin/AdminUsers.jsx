import AppLayout from "@/components/AppLayout";
import { mockUsers, roleLabels } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Shield, Search, Filter, Plus, Trash2,
  UserCog, ChevronDown, X, CheckCircle2, AlertCircle,
  MoreVertical, Edit2, Lock, Unlock, Eye, Download,
  RefreshCw, ArrowUpDown,
} from "lucide-react";
import { useState, useMemo } from "react";

/* ─────────────────────────────────────────────
   Role config
───────────────────────────────────────────── */
const ROLE_META = {
  student: {
    label: "Student",
    color: "sky",
    avatar: "bg-sky-500/20 border-sky-500/30 text-sky-300",
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/25",
    stat:  "bg-sky-500/10 border-sky-500/20 text-sky-400",
  },
  workplace_supervisor: {
    label: "Workplace Supervisor",
    color: "emerald",
    avatar: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    stat:  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  academic_supervisor: {
    label: "Academic Supervisor",
    color: "violet",
    avatar: "bg-violet-500/20 border-violet-500/30 text-violet-300",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    stat:  "bg-violet-500/10 border-violet-500/20 text-violet-400",
  },
  admin: {
    label: "Admin",
    color: "amber",
    avatar: "bg-amber-500/20 border-amber-500/30 text-amber-300",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    stat:  "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
};

const ROLES = Object.keys(ROLE_META);

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
const ConfirmModal = ({ open, title, description, onConfirm, onClose, danger = true }) => (
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
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                <AlertCircle className={`w-5 h-5 ${danger ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              </div>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-white transition flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition ${danger ? "bg-red-600 hover:bg-red-500" : "bg-amber-600 hover:bg-amber-500"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────
   Add / Edit User Modal
───────────────────────────────────────────── */
const UserModal = ({ open, onClose, onSave, editUser }) => {
  const [form, setForm] = useState(
    editUser ?? { name: "", email: "", role: "student", status: "active" }
  );

  // Sync form when editUser changes
  useMemo(() => {
    setForm(editUser ?? { name: "", email: "", role: "student", status: "active" });
  }, [editUser, open]);

  const isEdit = !!editUser;
  const valid  = form.name.trim() && form.email.trim();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-[#07101f]/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f] bg-[#0b1523]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <UserCog className="w-4 h-4 text-sky-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {isEdit ? "Edit User" : "Add New User"}
                </h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@university.ac.ug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{ROLE_META[r].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                  <select
                    value={form.status ?? "active"}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                  Cancel
                </button>
                <button
                  disabled={!valid}
                  onClick={() => { onSave(form); onClose(); }}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
                >
                  {isEdit ? "Save Changes" : "Add User"}
                </button>
              </div>
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
const ActionMenu = ({ user, onEdit, onToggleStatus, onDelete, onResetPassword }) => {
  const [open, setOpen] = useState(false);
  const suspended = user.status === "suspended";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition"
      >
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
                { icon: Edit2,     label: "Edit",           action: onEdit,          cls: "text-slate-300 hover:text-white" },
                { icon: Lock,      label: suspended ? "Unsuspend" : "Suspend", action: onToggleStatus, cls: suspended ? "text-emerald-400 hover:text-emerald-300" : "text-amber-400 hover:text-amber-300" },
                { icon: RefreshCw, label: "Reset Password",  action: onResetPassword, cls: "text-slate-300 hover:text-white" },
                { icon: Trash2,    label: "Delete",          action: onDelete,        cls: "text-red-400 hover:text-red-300" },
              ].map(({ icon: Icon, label, action, cls }) => (
                <button
                  key={label}
                  onClick={() => { action(); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.04] ${cls}`}
                >
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
   Status badge
───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = {
    active:    "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    inactive:  "bg-slate-500/10   text-slate-400   border-slate-500/25",
    suspended: "bg-red-500/10     text-red-300     border-red-500/25",
  };
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${cfg[status] ?? cfg.inactive}`}>
      {status ?? "active"}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const AdminUsers = () => {
  const [users, setUsers]           = useState(
    mockUsers.map((u) => ({ ...u, status: u.status ?? "active" }))
  );
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatus]   = useState("all");
  const [sortField, setSortField]   = useState("name");
  const [sortAsc, setSortAsc]       = useState(true);
  const [selected, setSelected]     = useState(new Set());
  const [modalOpen, setModalOpen]   = useState(false);
  const [editUser, setEditUser]     = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* Filtered + sorted users */
  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || (u.status ?? "active") === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
    list = [...list].sort((a, b) => {
      const va = a[sortField] ?? "";
      const vb = b[sortField] ?? "";
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [users, search, roleFilter, statusFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(true); }
  };

  /* Selection */
  const allSelected  = filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const someSelected = filtered.some((u) => selected.has(u.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((u) => u.id)));
  };
  const toggleOne = (id) => setSelected((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  /* Actions */
  const handleAdd = (form) => {
    setUsers((prev) => [...prev, { ...form, id: Date.now() }]);
    showToast(`${form.name} added successfully.`);
  };

  const handleEdit = (form) => {
    setUsers((prev) => prev.map((u) => u.id === form.id ? { ...u, ...form } : u));
    showToast(`${form.name} updated.`);
  };

  const handleDelete = (id) => {
    const u = users.find((x) => x.id === id);
    setUsers((prev) => prev.filter((x) => x.id !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
    showToast(`${u?.name} removed.`);
  };

  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selected.has(u.id)));
    showToast(`${selected.size} user(s) deleted.`);
    setSelected(new Set());
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u;
      const next = (u.status ?? "active") === "suspended" ? "active" : "suspended";
      showToast(`${u.name} ${next === "suspended" ? "suspended" : "reactivated"}.`);
      return { ...u, status: next };
    }));
  };

  const handleExport = () => {
    const rows = [["Name","Email","Role","Status"], ...users.map((u) => [u.name, u.email, ROLE_META[u.role]?.label ?? u.role, u.status ?? "active"])];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("User list exported as CSV.");
  };

  /* Stat cards */
  const stats = ROLES.map((r) => ({
    role: r,
    count: users.filter((u) => u.role === r).length,
    ...ROLE_META[r],
  }));

  return (
    <AppLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .ws-users { font-family: 'DM Sans', sans-serif; }
        .ws-mono  { font-family: 'DM Mono', monospace; }
        .ws-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .ws-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ws-scrollbar::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div className="ws-users min-h-screen bg-[#07101f] text-white">
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
                  <Users className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {users.length} total users · {users.filter((u) => (u.status ?? "active") === "active").length} active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                <button
                  onClick={() => { setEditUser(null); setModalOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition shadow-lg shadow-sky-900/30"
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.button
                key={s.role}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setRoleFilter(roleFilter === s.role ? "all" : s.role)}
                className={`rounded-2xl p-5 text-left border transition-all duration-200 hover:brightness-110 ${
                  roleFilter === s.role
                    ? `${s.stat} ring-1 ring-${s.color}-500/40`
                    : "bg-[#0d1926] border-[#1a3050]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${s.stat} border`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  {roleFilter === s.role && (
                    <span className="text-xs text-slate-400">filtered</span>
                  )}
                </div>
                <p className="text-2xl font-bold ws-mono text-white">{s.count}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{s.label}s</p>
              </motion.button>
            ))}
          </div>

          {/* ── Filters ── */}
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
                placeholder="Search by name or email…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role filter */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
              </select>
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatus(e.target.value)}
                className="pl-4 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </motion.div>

          {/* ── Bulk action bar ── */}
          <AnimatePresence>
            {someSelected && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-sky-500/8 border border-sky-500/25"
              >
                <span className="text-sm text-sky-300 font-medium">{selected.size} selected</span>
                <div className="flex-1" />
                <button
                  onClick={() => setConfirm({
                    title: `Delete ${selected.size} user(s)?`,
                    description: "These users will be permanently removed from the system.",
                    onConfirm: handleBulkDelete,
                  })}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#1a3050] bg-[#0b1523]">
              {/* Select all */}
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
              />
              {/* Name sort */}
              <button
                onClick={() => toggleSort("name")}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition text-left"
              >
                Name
                <ArrowUpDown className={`w-3 h-3 ${sortField === "name" ? "text-sky-400" : ""}`} />
              </button>
              {/* Email */}
              <button
                onClick={() => toggleSort("email")}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition text-left"
              >
                Email
                <ArrowUpDown className={`w-3 h-3 ${sortField === "email" ? "text-sky-400" : ""}`} />
              </button>
              {/* Role */}
              <span className="text-xs font-medium text-slate-500">Role</span>
              {/* Status */}
              <span className="text-xs font-medium text-slate-500 hidden md:block">Status</span>
              {/* Actions */}
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#122030] ws-scrollbar overflow-y-auto max-h-[520px]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No users match your filters.</p>
                  <button
                    onClick={() => { setSearch(""); setRoleFilter("all"); setStatus("all"); }}
                    className="mt-3 text-xs text-sky-400 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                filtered.map((u, i) => {
                  const meta = ROLE_META[u.role] ?? ROLE_META.student;
                  const isSelected = selected.has(u.id);
                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      className={`grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors ${isSelected ? "bg-sky-500/[0.04]" : ""}`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(u.id)}
                        className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                      />

                      {/* Name + avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${meta.avatar}`}>
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 truncate sm:hidden">{u.email}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        <span className="text-sm text-slate-400 truncate">{u.email}</span>
                      </div>

                      {/* Role badge */}
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap ${meta.badge}`}>
                        {meta.label}
                      </span>

                      {/* Status */}
                      <div className="hidden md:block">
                        <StatusBadge status={u.status ?? "active"} />
                      </div>

                      {/* Actions */}
                      <ActionMenu
                        user={u}
                        onEdit={() => { setEditUser(u); setModalOpen(true); }}
                        onToggleStatus={() => handleToggleStatus(u.id)}
                        onDelete={() => setConfirm({
                          title: `Delete "${u.name}"?`,
                          description: "This user will be permanently removed from the system.",
                          onConfirm: () => handleDelete(u.id),
                        })}
                        onResetPassword={() => showToast(`Password reset email sent to ${u.email}.`)}
                      />
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#1a3050] bg-[#0b1523]">
              <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{" "}
                <span className="text-slate-300 font-medium">{users.length}</span> users
              </p>
              {(search || roleFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => { setSearch(""); setRoleFilter("all"); setStatus("all"); }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Modals ── */}
      <UserModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditUser(null); }}
        onSave={editUser ? handleEdit : handleAdd}
        editUser={editUser}
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

export default AdminUsers;