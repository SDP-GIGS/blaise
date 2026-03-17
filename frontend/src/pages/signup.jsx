import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, roleLabels } from "../data/mockData";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "./signup.css";

const roleConfig = [
  {
    role: UserRole.STUDENT,
    icon: GraduationCap,
    description: "Submit logbooks, track progress, view scores",
    accentClass: "role-accent-blue",
  },
  {
    role: UserRole.WORKPLACE_SUPERVISOR,
    icon: Briefcase,
    description: "Review logs, approve submissions, evaluate students",
    accentClass: "role-accent-emerald",
  },
  {
    role: UserRole.ACADEMIC_SUPERVISOR,
    icon: BookOpen,
    description: "Monitor progress and academic evaluations",
    accentClass: "role-accent-violet",
  },
  {
    role: UserRole.ADMIN,
    icon: Shield,
    description: "Manage placements, users and reports",
    accentClass: "role-accent-gold",
  },
];

const rolePaths = {
  [UserRole.STUDENT]: "/student",
  [UserRole.WORKPLACE_SUPERVISOR]: "/supervisor/workplace",
  [UserRole.ACADEMIC_SUPERVISOR]: "/supervisor/academic",
  [UserRole.ADMIN]: "/admin",
};

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await signUp(name, email, password, selectedRole);

    if (result.success && rolePaths[selectedRole]) {
      navigate(rolePaths[selectedRole]);
    } else {
      setError(result.error || "Sign up failed.");
    }
  };

  return (
    <div className="login-page">
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
            Create your <span className="login-title-highlight">ILES</span> account
          </h1>
          <p className="login-subtitle">
            <Sparkles className="login-subtitle-icon" />
            Select your role and get started
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="signup-role-grid"
        >
          {roleConfig.map((r, index) => (
            <motion.button
              key={r.role}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.15 + index * 0.05 }}
              onClick={() => setSelectedRole(r.role)}
              className={`signup-role-card ${
                selectedRole === r.role ? "signup-role-card--selected" : ""
              }`}
            >
              <div className={`signup-role-icon ${r.accentClass}`}>
                <r.icon className="signup-role-icon-svg" />
              </div>
              <div className="signup-role-content">
                <p className="signup-role-title">{roleLabels[r.role]}</p>
                <p className="signup-role-description">{r.description}</p>
              </div>
              {selectedRole === r.role && (
                <div className="signup-role-check">
                  <CheckCircle2 className="signup-role-check-icon" />
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        <motion.form
          onSubmit={handleSignUp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="login-form"
        >
          {error && (
            <div className="login-error">
              <AlertCircle className="login-error-icon" />
              {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="login-input"
            />
          </div>

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
                placeholder="Min. 6 characters"
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

          <div className="login-field">
            <label className="login-label">Confirm Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedRole}
            className="login-submit"
          >
            Create Account
            <ArrowRight className="login-submit-icon" />
          </button>

          <p className="login-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="login-footer-link">
              Sign In
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default SignUp;

