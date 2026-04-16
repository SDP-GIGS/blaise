import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap, Briefcase, Shield, ArrowRight,
  Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2,
} from "lucide-react";

const roleConfig = [
  {
    role: "student",
    icon: GraduationCap,
    label: "Student",
    description: "Submit logbooks, track progress, view scores",
    accentClass: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    role: "workplace_supervisor",
    icon: Briefcase,
    label: "Workplace Supervisor",
    description: "Review logs, approve submissions, evaluate students",
    accentClass: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    role: "academic_supervisor",
    icon: BookOpen,
    label: "Academic Supervisor",
    description: "Monitor progress and academic evaluations",
    accentClass: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
  {
    role: "admin",
    icon: Shield,
    label: "Administrator",
    description: "Manage placements, users and reports",
    accentClass: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
];

const rolePaths = {
  student:               "/student",
  workplace_supervisor:  "/supervisor/workplace",
  academic_supervisor:   "/supervisor/academic",
  admin:                 "/admin",
};

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    if (role !== "student") {
      setStudentNumber("");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) { setError("Please select a role."); return; }
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (selectedRole === "student" && !studentNumber) { setError("Student number is required for students."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    const result = await signUp(name, email, password, selectedRole, studentNumber);
    setLoading(false);

    if (result.success) {
      navigate(rolePaths[selectedRole]);
    } else {
      setError(result.error || "Sign up failed.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#111827_0,#020617_45%,#000_100%)] p-6 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-[18%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,#22c55e_0,transparent_70%)] opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[100px] bottom-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,#3b82f6_0,transparent_70%)] opacity-10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px] lg:max-w-[820px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_10%_0,#fef3c7_0,#f59e0b_40%,#854d0e_100%)] shadow-[0_18px_45px_rgba(234,179,8,0.45)]">
            <BookOpen className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-50 md:text-[2.4rem]">
            Create your{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">ILES</span>{" "}
            account
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Select your role and get started
          </p>
        </motion.div>

        {/* Role Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {roleConfig.map((r, index) => (
            <motion.button key={r.role} type="button"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.15 + index * 0.05 }}
              onClick={() => handleRoleSelect(r.role)}
              className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border bg-slate-950 px-4 py-3 text-left transition hover:-translate-y-px hover:border-yellow-300/70 hover:shadow-[0_14px_28px_rgba(15,23,42,0.9)] ${
                selectedRole === r.role
                  ? "border-yellow-300/90 shadow-[0_0_0_1px_rgba(250,204,21,0.7),0_16px_34px_rgba(15,23,42,0.95)]"
                  : "border-slate-400/40"
              }`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.accentClass}`}>
                <r.icon className="h-4 w-4 text-slate-50" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-slate-200">{r.label}</p>
                <p className="text-[0.7rem] text-slate-400">{r.description}</p>
              </div>
              {selectedRole === r.role && (
                <div className="absolute right-2.5 top-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSignUp}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 rounded-2xl border border-slate-500/45 bg-slate-900/95 p-7 shadow-[0_22px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl lg:p-8">

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]" />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]" />
          </div>

          {/* Student Number - student role only */}
          {selectedRole === "student" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-col gap-1.5"
            >

              <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                Student Number <span className="text-yellow-400">*</span>
              </label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="e.g. 24/U/0763"
                className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-600 focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]"
              />
              <p className="text-[0.65rem] text-slate-500">
                Required for student accounts.
              </p>
            </motion.div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">Password</label>
            <div className="relative flex items-center">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 pr-9 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-50 transition">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>


          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">Confirm Password</label>
            <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]" />
          </div>
          

          <button type="submit" disabled={!selectedRole || loading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-4 py-3 font-semibold text-slate-900 shadow-[0_18px_40px_rgba(234,179,8,0.45)] transition enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-1 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-yellow-400 hover:underline">Sign In</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;