import { useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockLogs,
  mockPlacements,
  mockUsers,
  statusColors,
} from "@/data/mockData";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  Send,
  Download,
  UserPlus,
  Star,
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
      <div className="max-w-7xl mx-auto py-8 px-2 sm:px-6">
        {/* Unique Glassy Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#0f172a]/90 via-[#334155]/80 to-[#0ea5e9]/80 backdrop-blur-xl border border-blue-900/30"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12)_0,transparent_70%)]" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-8 h-8 text-cyan-300 drop-shadow" />
                <span className="text-lg font-bold tracking-widest text-cyan-100 uppercase bg-cyan-900/30 px-3 py-1 rounded-xl shadow">
                  Workplace Supervisor
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg font-mono">
                Professional Dashboard
              </h1>
              <p className="mt-2 text-cyan-100/90 text-lg font-medium max-w-xl">
                Empowering workplace mentors to guide, review, and elevate
                student performance.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-cyan-700/80 text-white font-semibold shadow-lg text-sm">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                Unique Workplace Experience
              </span>
              <span className="text-xs text-cyan-200/80 italic mt-1">
                "Mentorship is the key to real-world growth."
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-800 hover:bg-cyan-900 text-white font-semibold shadow transition text-base">
            <UserPlus className="w-5 h-5" /> Add Placement
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition text-base">
            <Send className="w-5 h-5" /> Send Feedback
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-700 hover:bg-slate-900 text-white font-semibold shadow transition text-base">
            <Download className="w-5 h-5" /> Export Report
          </button>
        </div>

        {/* Stat Cards - Unique Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              className="relative rounded-3xl bg-gradient-to-br from-[#0ea5e9]/80 to-[#334155]/90 shadow-xl border border-cyan-900/30 p-7 flex flex-col gap-2 group hover:scale-[1.03] hover:shadow-2xl transition-transform"
            >
              <div className="absolute -top-4 -right-4 bg-cyan-900/30 rounded-full p-3 shadow-lg">
                <s.icon className="w-7 h-7 text-cyan-200 group-hover:text-yellow-300 transition" />
              </div>
              <span className="text-4xl font-extrabold text-white font-mono drop-shadow">
                {s.value}
              </span>
              <span className="text-base text-cyan-100 font-semibold tracking-wide">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Assigned Students & Logs Awaiting Review */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assigned Students */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-[#334155]/80 to-[#0ea5e9]/60 shadow-lg border border-cyan-900/20 p-7"
          >
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-300" /> Assigned Students
            </h2>
            <p className="text-sm text-cyan-100/80 mb-4">
              {assignedStudents.length} student(s) under your supervision
            </p>
            {assignedStudents.length === 0 ? (
              <div className="py-10 text-center">
                <Users className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <p className="text-base text-cyan-200/80">
                  No students are currently assigned to you.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-cyan-900/20">
                {assignedStudents.map((p) => {
                  const studentLogs = allLogs.filter(
                    (l) => l.studentId === p.studentId,
                  );
                  const pending = studentLogs.filter(
                    (l) => l.status === "submitted",
                  ).length;
                  return (
                    <div
                      key={p.id}
                      className="py-4 flex items-center justify-between hover:bg-cyan-900/10 rounded-xl transition-all duration-200 px-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/40 to-cyan-900/20 border border-cyan-400/30 flex items-center justify-center text-lg font-bold text-cyan-100 shadow">
                          {p.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">
                            {p.studentName}
                          </p>
                          <p className="text-xs text-cyan-200/80">
                            {p.company} • {p.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cyan-200/80">
                          {studentLogs.length} logs
                        </span>
                        {pending > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-yellow-400/20 text-yellow-200 font-semibold text-xs">
                            <Star className="w-3 h-3" /> {pending} pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Logs Awaiting Review */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-gradient-to-br from-[#0ea5e9]/80 to-[#334155]/80 shadow-lg border border-cyan-900/20 p-7"
          >
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-yellow-300" /> Logs
              Awaiting Review
            </h2>
            <p className="text-sm text-cyan-100/80 mb-4">
              {pendingReview.length} submission(s) need your attention
            </p>
            {pendingReview.length === 0 ? (
              <div className="py-10 text-center">
                <ClipboardCheck className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
                <p className="text-base text-cyan-200/80">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-yellow-400/20">
                {pendingReview.map((log) => (
                  <div
                    key={log.id}
                    className="py-4 flex items-center justify-between hover:bg-yellow-400/10 rounded-xl transition-all duration-200 px-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300/40 to-yellow-900/20 border border-yellow-400/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-300">
                          W{log.weekNumber}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">
                          {log.studentName}
                        </p>
                        <p className="text-xs text-yellow-100/80">
                          Week {log.weekNumber} • {log.hoursWorked}h
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-semibold text-xs ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                    >
                      {log.status}
                    </span>
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
