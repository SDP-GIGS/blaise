import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockLogs, mockPlacements } from "@/data/mockData";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";

const AcademicSupervisorDashboard = () => {
  const { user } = useAuth();

  const assignedStudents = mockPlacements.filter(
    (p) => p.academicSupervisor === user?.name,
  );

  const allLogs = mockLogs.filter((l) =>
    assignedStudents.some((p) => p.studentId === l.studentId),
  );

  const pendingReview = allLogs.filter(
    (l) => l.status === "submitted" || l.status === "reviewed",
  );

  const stats = [
    {
      icon: Users,
      label: "Students",
      value: assignedStudents.length,
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: BookOpen,
      label: "Total Logs",
      value: allLogs.length,
      color: "from-violet-500 to-purple-400",
    },
    {
      icon: ClipboardCheck,
      label: "Needs Attention",
      value: pendingReview.length,
      color: "from-amber-500 to-orange-400",
    },
    {
      icon: TrendingUp,
      label: "Approved",
      value: allLogs.filter((l) => l.status === "approved").length,
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
              Academic Supervisor
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Academic Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor student progress and academic evaluations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}
                >
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground font-display">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium"
        >
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-bold font-display text-foreground">
              Student Progress Overview
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Log completion and approval rates
            </p>
          </div>

          {assignedStudents.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground">
              No students are currently assigned to you.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {assignedStudents.map((p, i) => {
                const studentLogs = allLogs.filter((l) => l.studentId === p.studentId);
                const approved = studentLogs.filter((l) => l.status === "approved").length;
                const total = studentLogs.length;
                const pct = total > 0 ? (approved / total) * 100 : 0;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="p-5 hover:bg-secondary/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                          {(p.studentName || "Student")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {p.studentName || `Student #${p.studentId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.company} • {p.department}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground font-display">
                        {approved}/{total}
                      </span>
                    </div>

                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full gradient-gold rounded-full"
                      />
                    </div>

                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {pct.toFixed(0)}% approved
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AcademicSupervisorDashboard;