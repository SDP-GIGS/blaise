import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import "./login.css";

// Map each role to its dashboard route
const rolePaths = {
  student: "/student",
  workplace_supervisor: "/supervisor/workplace",
  academic_supervisor: "/supervisor/academic",
  admin: "/admin",
};

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result =  signIn(email, password);

    if (result.success && result.role && rolePaths[result.role]) {
      navigate(rolePaths[result.role]);
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="login-grid-pattern" />
      <div className="login-blob-left" />
      <div className="login-blob-right" />

      <div className="login-card-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="login-header"
        >
          <div className="login-logo">
            <BookOpen className="login-logo-icon" />
          </div>
          <h1 className="login-title">
            Sign in to <span className="login-title-highlight">ILES</span>
          </h1>
          <p className="login-subtitle">
            <Sparkles className="login-subtitle-icon" />
            Internship Logging &amp; Evaluation System
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="login-form"
        >
          {error && (
            <div className="login-error">
              <AlertCircle className="login-error-icon" />
              {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-password-wrapper">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input login-input-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="login-toggle-password"
              >
                {showPass ? (
                  <EyeOff className="login-toggle-password-icon" />
                ) : (
                  <Eye className="login-toggle-password-icon" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit">
            Sign In
            <ArrowRight className="login-submit-icon" />
          </button>

          <p className="login-footer-text">
            Don't have an account?{" "}
            <Link to="/signup" className="login-footer-link">
              Sign Up
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;

