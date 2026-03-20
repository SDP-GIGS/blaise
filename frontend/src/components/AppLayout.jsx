import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { roleLabels } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  LayoutDashboard,
  NotebookPen,
  ClipboardCheck,
  Users,
  Building2,
  BarChart3,
  Calculator,
  Award,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navByRole = {
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "Weekly Logbook", path: "/student/logbook", icon: NotebookPen },
    { label: "My Placement", path: "/student/placement", icon: Building2 },
    { label: "My Scores", path: "/student/scores", icon: Award },
  ],
  workplace_supervisor: [
    { label: "Dashboard", path: "/supervisor/workplace", icon: LayoutDashboard },
    { label: "Review Logs", path: "/supervisor/workplace/review", icon: ClipboardCheck },
    { label: "Evaluate", path: "/supervisor/workplace/evaluate", icon: Calculator },
  ],
  academic_supervisor: [
    { label: "Dashboard", path: "/supervisor/academic", icon: LayoutDashboard },
    { label: "Review Logs", path: "/supervisor/academic/review", icon: ClipboardCheck },
    { label: "Evaluate", path: "/supervisor/academic/evaluate", icon: Calculator },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Placements", path: "/admin/placements", icon: Building2 },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Evaluations", path: "/admin/evaluations", icon: Award },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  ],
};

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = navByRole[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5 text-background" />
          </div>
          <div>
            <span className="text-lg font-bold font-display text-foreground tracking-tight">ILES</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-accent" />
              <span className="text-[10px] text-accent font-medium">PRO</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-5 py-4">
        <div className="glass-card rounded-xl p-3">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.15em]">
            {roleLabels[user.role]}
          </p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{user.name}</p>
          <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full gradient-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">75% profile complete</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-gold"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-accent" : "group-hover:text-foreground"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] gradient-sidebar border-r border-border/50 flex-col flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-card-strong flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-gold">
            <BookOpen className="w-4 h-4 text-background" />
          </div>
          <span className="text-base font-bold font-display text-foreground">ILES</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-[260px] h-screen gradient-sidebar border-r border-border/50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="relative min-h-screen">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
          {/* Ambient glow orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/3 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/3 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
