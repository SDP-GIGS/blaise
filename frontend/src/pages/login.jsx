import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  BookOpen, ArrowRight, Sparkles, Eye, EyeOff, AlertCircle,
} from "lucide-react";

const rolePaths = {
  student:               "/student",
  workplace_supervisor:  "/supervisor/workplace",
  academic_supervisor:   "/supervisor/academic",
  admin:                 "/admin",
};

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await signIn(identifier, password);
    setLoading(false);

    if (result.success && result.role && rolePaths[result.role]) {
      navigate(rolePaths[result.role]);
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#111827_0,#020617_45%,#000_100%)] p-6 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-[18%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,#22c55e_0,transparent_70%)] opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[100px] bottom-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,#3b82f6_0,transparent_70%)] opacity-10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_10%_0,#fef3c7_0,#f59e0b_40%,#854d0e_100%)] shadow-[0_18px_45px_rgba(234,179,8,0.45)]">
            <BookOpen className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-50 md:text-[2.4rem]">
            Sign in to{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              ILES
            </span>
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Internship Logging &amp; Evaluation System
          </p>
        </motion.div>

        <motion.form onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-4 rounded-2xl border border-slate-500/45 bg-slate-900/95 p-7 shadow-[0_22px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Identifier field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">
              Student Number or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="24/U/0763 or admin@iles.com"
              className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]"
            />
            <p className="text-[10px] text-slate-500">
              Students use their student number · Supervisors and admins use email
            </p>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-slate-400">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-400/40 bg-slate-950 px-4 py-3 pr-9 text-sm text-slate-50 outline-none transition focus:-translate-y-px focus:border-yellow-400/90 focus:shadow-[0_0_0_1px_rgba(250,204,21,0.6)]"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-50">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-4 py-3 font-semibold text-slate-900 shadow-[0_18px_40px_rgba(234,179,8,0.45)] transition hover:-translate-y-px disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-1 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;