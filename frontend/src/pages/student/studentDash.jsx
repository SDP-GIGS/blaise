import { useMemo } from "react";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockLogs, mockPlacements, statusColors } from "../../data/mockData";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import "../login.css";
import "./studentDash.css";

const StudentDashboard = () => {
  const { user } = useAuth();

  const { logs, placement, approvedLogs, totalHours, pendingLogs, hoursChart } =
    useMemo(() => {
      const studentLogs = mockLogs.filter((l) => l.studentId === user?.id);
      const studentPlacement = mockPlacements.find(
        (p) => p.studentId === user?.id
      );

      const approved = studentLogs.filter((l) => l.status === "approved").length;
      const total = studentLogs.reduce((sum, l) => sum + l.hoursWorked, 0);
      const pending = studentLogs.filter((l) => l.status === "submitted").length;

      const chart = studentLogs.map((l) => ({
        week: `W${l.weekNumber}`,
        hours: l.hoursWorked,
      }));

      return {
        logs: studentLogs,
        placement: studentPlacement,
        approvedLogs: approved,
        totalHours: total,
        pendingLogs: pending,
        hoursChart: chart,
      };
    }, [user]);

  const stats = [
    {
      icon: FileText,
      label: "Total Logs",
      value: logs.length,
      change: "+2 this week",
    },
    {
      icon: TrendingUp,
      label: "Approved",
      value: approvedLogs,
      change: `${logs.length > 0 ? Math.round((approvedLogs / logs.length) * 100) : 0}% rate`,
    },
    {
      icon: Clock,
      label: "Total Hours",
      value: totalHours,
      change: "avg 39h/week",
    },
    {
      icon: CalendarDays,
      label: "Pending Review",
      value: pendingLogs,
      change: "awaiting supervisor",
    },
  ];

  return (
    <AppLayout>
      <div className="student-dash">
        <div className="student-dash-header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="student-dash-kicker">
              <Zap className="student-dash-kicker-icon" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="student-dash-title">
              Welcome back,{" "}
              <span className="login-title-highlight">
                {user?.name?.split(" ")[0] || "Student"}
              </span>
            </h1>
            <p className="student-dash-subtitle">
              Here's your internship performance overview
            </p>
          </motion.div>
        </div>

        <div className="student-dash-stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="student-dash-stat-card"
            >
              <div className="student-dash-stat-top">
                <div className="student-dash-stat-icon">
                  <s.icon className="student-dash-stat-icon-svg" />
                </div>
                <ArrowUpRight className="student-dash-stat-arrow" />
              </div>
              <p className="student-dash-stat-value">{s.value}</p>
              <p className="student-dash-stat-label">{s.label}</p>
              <p className="student-dash-stat-change">{s.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="student-dash-main-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="student-dash-hours-card"
          >
            <h2 className="student-dash-section-title">Hours Trend</h2>
            <p className="student-dash-section-subtitle">
              Weekly hours logged over time
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hoursChart}>
                <defs>
                  <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(45 93% 58%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(45 93% 58%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "hsl(220 15% 55%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222 47% 9%)",
                    border: "1px solid hsl(220 30% 16%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 96%)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(45 93% 58%)"
                  strokeWidth={2.5}
                  fill="url(#hoursGradient)"
                  dot={{
                    r: 4,
                    fill: "hsl(45 93% 58%)",
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {placement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="student-dash-placement-card"
            >
              <h2 className="student-dash-section-title">Current Placement</h2>
              <p className="student-dash-section-subtitle">
                Active internship assignment
              </p>

              <div className="student-dash-placement-body">
                <div>
                  <p className="student-dash-meta-label">Company</p>
                  <p className="student-dash-meta-value">{placement.company}</p>
                </div>
                <div>
                  <p className="student-dash-meta-label">Department</p>
                  <p className="student-dash-meta-value">
                    {placement.department}
                  </p>
                </div>
                <div>
                  <p className="student-dash-meta-label">Duration</p>
                  <p className="student-dash-meta-value">
                    {placement.startDate} — {placement.endDate}
                  </p>
                </div>
                <div>
                  <p className="student-dash-meta-label">Status</p>
                  <span
                    className={`status-badge ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}
                  >
                    {placement.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="student-dash-recent-card"
        >
          <div className="student-dash-recent-header">
            <div>
              <h2 className="student-dash-section-title">Recent Log Entries</h2>
              <p className="student-dash-section-subtitle">
                Your latest weekly submissions
              </p>
            </div>
            <span className="student-dash-total-pill">{logs.length} total</span>
          </div>
          <div className="student-dash-recent-body">
            {logs.length === 0 ? (
              <p className="student-dash-empty-text">No log entries yet.</p>
            ) : (
              logs.slice(0, 5).map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  className="student-dash-log-row"
                >
                  <div className="student-dash-log-main">
                    <div className="student-dash-week-pill">
                      <span>W{log.weekNumber}</span>
                    </div>
                    <div>
                      <p className="student-dash-log-title">
                        Week {log.weekNumber}
                      </p>
                      <p className="student-dash-log-dates">
                        {log.startDate} — {log.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="student-dash-log-meta">
                    <span className="student-dash-log-hours">
                      {log.hoursWorked}h
                    </span>
                    <span
                      className={`status-badge ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}
                    >
                      {log.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;

