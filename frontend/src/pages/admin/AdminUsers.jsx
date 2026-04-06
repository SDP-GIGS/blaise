import AppLayout from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Shield, Search, Filter, Plus, Trash2,
  UserCog, X, CheckCircle2, AlertCircle, MoreVertical,
  Edit2, Download, ArrowUpDown,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

const ROLE_META = {
  student: {
    label: "Student",
    color: "sky",
    avatar: "bg-sky-500/20 border-sky-500/30 text-sky-300",
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/25",
    stat: "bg-sky-500/10 border-sky-500/20 text-sky-400",
  },
  workplace_supervisor: {
    label: "Workplace Supervisor",
    color: "emerald",
    avatar: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    stat: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  academic_supervisor: {
    label: "Academic Supervisor",
    color: "violet",
    avatar: "bg-violet-500/20 border-violet-500/30 text-violet-300",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    stat: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  },
  admin: {
    label: "Admin",
    color: "amber",
    avatar: "bg-amber-500/20 border-amber-500/30 text-amber-300",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    stat: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
};

const ROLES = Object.keys(ROLE_META);

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
      : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

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
              <div className="p-2.5 rounded-xl flex-shrink-0 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1e3a5f] text-sm text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition bg-red-600 hover:bg-red-500"
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

const UserModal = ({ open, onClose, onSave, editUser }) => {
  const isEdit = !!editUser;
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "student" });

  useEffect(() => {
    if (editUser) {
      setForm({ full_name: editUser.full_name, email: editUser.email, password: "", role: editUser.role });
    } else {
      setForm({ full_name: "", email: "", password: "", role: "student" });
    }
  }, [editUser, open]);

  const valid = form.full_name.trim() && form.email.trim() && (isEdit || form.password.trim());

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

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
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
              {!isEdit && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition"
                  />
                </div>
              )}
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

const ActionMenu = ({ user, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition">
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
              className="absolute right-0 top-8 z-20 w-36 rounded-xl bg-[#0d1926] border border-[#1e3a5f] shadow-2xl overflow-hidden"
            >
              {[
                { icon: Edit2, label: "Edit", action: onEdit, cls: "text-slate-300 hover:text-white" },
                { icon: Trash2, label: "Delete", action: onDelete, cls: "text-red-400 hover:text-red-300" },
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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("full_name");
  const [sortAsc, setSortAsc] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    try {
      const data = await apiClient.get('/users/');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleAdd = async (form) => {
    try {
      const newUser = await apiClient.post('/auth/register/', form);
      setUsers((prev) => [...prev, newUser.user]);
      showToast(`${form.full_name} added successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to add user.', 'error');
    }
  };

  const handleEdit = async (form) => {
    try {
      const updated = await apiClient.put(`/users/${editUser.id}/`, form);
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? updated : u));
      showToast(`${form.full_name} updated.`);
    } catch (err) {
      showToast(err.message || 'Failed to update user.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/users/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('User deleted.');
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  const handleExport = () => {
    const rows = [["Name", "Email", "Role"],
      ...users.map((u) => [u.full_name, u.email, ROLE_META[u.role]?.label ?? u.role])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("User list exported.");
  };

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
    list = [...list].sort((a, b) => {
      const va = a[sortField] ?? "";
      const vb = b[sortField] ?? "";
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [users, search, roleFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(true); }
  };

  const stats = ROLES.map((r) => ({
    role: r,
    count: users.filter((u) => u.role === r).length,
    ...ROLE_META[r],
  }));

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Users className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Administration</p>
                  <h1 className="text-2xl font-bold text-white">User Management</h1>
                  <p className="text-sm text-slate-400 mt-0.5">{users.length} total users</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a2e47] hover:bg-[#1e3554] border border-[#1e3a5f] text-slate-300 hover:text-white text-sm font-medium transition">
                  <Download className="w-4 h-4" /> Export
                </button>
                <button onClick={() => { setEditUser(null); setModalOpen(true); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition">
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.button key={s.role}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => setRoleFilter(roleFilter === s.role ? "all" : s.role)}
                className={`rounded-2xl p-5 text-left border transition-all hover:brightness-110 ${roleFilter === s.role ? s.stat : "bg-[#0d1926] border-[#1a3050]"}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${s.stat} border`}>
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{s.count}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{s.label}s</p>
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d1926] border border-[#1a3050] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition cursor-pointer">
                <option value="all">All roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#0d1926] border border-[#1a3050] overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#1a3050] bg-[#0b1523]">
              <button onClick={() => toggleSort("full_name")} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition text-left">
                Name <ArrowUpDown className={`w-3 h-3 ${sortField === "full_name" ? "text-sky-400" : ""}`} />
              </button>
              <button onClick={() => toggleSort("email")} className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition text-left">
                Email <ArrowUpDown className={`w-3 h-3 ${sortField === "email" ? "text-sky-400" : ""}`} />
              </button>
              <span className="text-xs font-medium text-slate-500">Role</span>
              <span />
            </div>

            <div className="divide-y divide-[#122030] overflow-y-auto max-h-[520px]">
              {loading ? (
                <div className="py-16 text-center text-slate-500">Loading users...</div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No users found.</p>
                </div>
              ) : (
                filtered.map((u, i) => {
                  const meta = ROLE_META[u.role] ?? ROLE_META.student;
                  return (
                    <motion.div key={u.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.025 }}
                      className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${meta.avatar}`}>
                          {(u.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                          <p className="text-xs text-slate-500 truncate sm:hidden">{u.email}</p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        <span className="text-sm text-slate-400 truncate">{u.email}</span>
                      </div>
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap ${meta.badge}`}>
                        {meta.label}
                      </span>
                      <ActionMenu
                        user={u}
                        onEdit={() => { setEditUser(u); setModalOpen(true); }}
                        onDelete={() => setConfirm({
                          title: `Delete "${u.full_name}"?`,
                          description: "This user will be permanently removed.",
                          onConfirm: () => handleDelete(u.id),
                        })}
                      />
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-[#1a3050] bg-[#0b1523]">
              <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{" "}
                <span className="text-slate-300 font-medium">{users.length}</span> users
              </p>
            </div>
          </motion.div>
        </div>
      </div>

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

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default AdminUsers;