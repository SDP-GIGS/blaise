import AppLayout from "@/components/AppLayout";
import { mockUsers, roleLabels } from "@/data/mockData";
import { motion } from "framer-motion";
import { Users, Mail, Shield, Search } from "lucide-react";
import { useState } from "react";
import "./AdminUsers.css";

const roleColors = {
  student: "from-blue-500 to-cyan-400",
  workplace_supervisor: "from-emerald-500 to-teal-400",
  academic_supervisor: "from-violet-500 to-purple-400",
  admin: "from-amber-500 to-orange-400",
};

const roleBadgeColors = {
  student: "bg-blue-500/10 text-blue-400",
  workplace_supervisor: "bg-emerald-500/10 text-emerald-400",
  academic_supervisor: "bg-violet-500/10 text-violet-400",
  admin: "bg-amber-500/10 text-amber-400",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">Users</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">View and manage all system users</p>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {["student", "workplace_supervisor", "academic_supervisor", "admin"].map((role, i) => {
            const count = mockUsers.filter((u) => u.role === role).length;
            return (
              <motion.div key={role} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center mb-4`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-bold text-foreground font-display">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{roleLabels[role]}s</p>
              </motion.div>
            );
          })}
        </div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="input-premium pl-11"
            />
          </div>
        </motion.div>

        {/* User table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[u.role]} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-semibold text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" /> {u.email}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${roleBadgeColors[u.role]}`}>
                        {roleLabels[u.role]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
