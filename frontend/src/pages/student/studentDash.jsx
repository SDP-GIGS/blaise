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
  CartesianGrid,
  YAxis
} from "recharts";
import "../login.css";

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
      <div className="max-w-6xl mx-auto py-2 sm:py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.15em]">Student Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Welcome back,{" "}
            <span className="text-gradient-gold">
              {user?.name?.split(" ")[0] || "Student"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Here's your internship performance overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card-strong p-5 rounded-2xl shadow-card flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <s.icon className="w-20 h-20 text-accent -mr-4 -mt-4 transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                  <s.icon className="w-5 h-5 text-navy" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="relative z-10">
                <p className="text-3xl font-bold text-foreground font-display tracking-tight">{s.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{s.label}</p>
                <p className="text-[11px] font-semibold text-accent tracking-wide mt-2">{s.change}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Hours Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`glass-card-strong p-6 rounded-2xl ${placement ? 'lg:flex-[3]' : 'w-full'} flex flex-col`}
          >
            <h2 className="text-lg font-bold font-display text-foreground">Hours Trend</h2>
            <p className="text-xs text-muted-foreground mb-6">Weekly hours logged over time</p>
            
            <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hoursChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(45 93% 58%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(45 93% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#eab308"
                    strokeWidth={3}
                    fill="url(#hoursGradient)"
                    dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Placement Details */}
          {placement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card-strong p-6 rounded-2xl lg:flex-[2] flex flex-col"
            >
              <h2 className="text-lg font-bold font-display text-foreground">Current Placement</h2>
              <p className="text-xs text-muted-foreground mb-6">Active internship assignment</p>
              
              <div className="grid gap-5">
                {[
                  { label: "Company", value: placement.company },
                  { label: "Department", value: placement.department },
                  { label: "Duration", value: `${placement.startDate} — ${placement.endDate}` },
                ].map((item) => (
                  <div key={item.label} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}>
                    {placement.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card-strong rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-border/50 flex items-center justify-between bg-white/5">
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">Recent Log Entries</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your latest weekly submissions</p>
            </div>
            <span className="text-[10px] font-bold text-accent tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full">{logs.length} Total</span>
          </div>
          
          <div className="divide-y divide-border/50">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No log entries yet.</div>
            ) : (
              logs.slice(0, 5).map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">W{log.weekNumber}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Week {log.weekNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.startDate} — {log.endDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs font-medium text-muted-foreground">{log.hoursWorked}h logged</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[log.status]?.bg} ${statusColors[log.status]?.text}`}>
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

