import { useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockLogs, mockPlacements, mockUsers, statusColors } from "@/data/mockData";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";

const WorkplaceSupervisorDashboard = () => {
  const { user } = useAuth();

  const usersById = useMemo(
    () => Object.fromEntries(mockUsers.map((u) => [u.id, u])),
    [],
  );

  const assignedStudents = mockPlacements
    .filter((p) => p.workplaceSupervisor === user?.name)
    .map((p) => ({
      ...p,
      studentName: p.studentName || usersById[p.studentId]?.name || "Student",
    }));

  const allLogs = mockLogs
    .filter((l) => assignedStudents.some((p) => p.studentId === l.studentId))
    .map((l) => ({
      ...l,
      studentName: usersById[l.studentId]?.name || `Student #${l.studentId}`,
    }));

  const pendingReview = allLogs.filter((l) => l.status === "submitted");
  const reviewed = allLogs.filter(
    (l) => l.status === "reviewed" || l.status === "approved",
  );

  const stats = [
    {
      icon: Users,
      label: "Assigned Students",
      value: assignedStudents.length,
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: AlertCircle,
      label: "Pending Review",
      value: pendingReview.length,
      color: "from-amber-500 to-orange-400",
    },
    {
      icon: ClipboardCheck,
      label: "Reviewed",
      value: reviewed.length,
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: Clock,
      label: "Total Logs",
      value: allLogs.length,
      color: "from-violet-500 to-purple-400",
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
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">
              Workplace Supervisor
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Supervisor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student logs and evaluations
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

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium"
          >
            <div className="p-6 border-b border-border/50">
              <h2 className="text-lg font-bold font-display text-foreground">
                Assigned Students
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {assignedStudents.length} students under supervision
              </p>
            </div>

            {assignedStudents.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No students are currently assigned to you.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {assignedStudents.map((p) => {
                  const studentLogs = allLogs.filter((l) => l.studentId === p.studentId);
                  const pending = studentLogs.filter((l) => l.status === "submitted").length;

                  return (
                    <div
                      key={p.id}
                      className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                          {p.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {p.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.company} • {p.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {studentLogs.length} logs
                        </span>
                        {pending > 0 && (
                          <span className="status-badge bg-amber-500/10 text-amber-400">
                            {pending} pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-premium"
          >
            <div className="p-6 border-b border-border/50">
              <h2 className="text-lg font-bold font-display text-foreground">
                Logs Awaiting Review
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pendingReview.length} submissions need attention
              </p>
            </div>

            {pendingReview.length === 0 ? (
              <div className="p-10 text-center">
                <ClipboardCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {pendingReview.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 hover:bg-secondary/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-400">
                            W{log.weekNumber}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {log.studentName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Week {log.weekNumber} • {log.hoursWorked}h
                          </p>
                        </div>
                      </div>

                      <span
                        className={`status-badge ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkplaceSupervisorDashboard;