import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { roleLabels } from "@/data/mockData";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Briefcase, Shield, ArrowRight, Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import "./SignUp.css";

const roleConfig = [
    { role: "student", icon: GraduationCap, description: "Submit logbooks, track progress, view scores", gradient: "from-blue-500 to-cyan-400", glow: "glow-blue" },
    { role: "workplace_supervisor", icon: Briefcase, description: "Review logs, approve submissions, evaluate students", gradient: "from-emerald-500 to-teal-400", glow: "glow-emerald" },
    { role: "academic_supervisor", icon: BookOpen, description: "Monitor progress, submit academic evaluations", gradient: "from-violet-500 to-purple-400", glow: "glow-violet" },
    { role: "admin", icon: Shield, description: "Manage placements, oversee system, generate reports", gradient: "from-amber-500 to-orange-400", glow: "glow-gold" },
];

const rolePaths = {
    student: "/student",
    workplace_supervisor: "/supervisor/workplace",
    academic_supervisor: "/supervisor/academic",
    admin: "/admin",
};

const SignUp = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        setError("");
        if (!selected) {
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
        const result = signUp(name, email, password, selected);
        if (result.success) {
            navigate(rolePaths[selected]);
        } else {
            setError(result.error || "Sign up failed.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-bg-grid bg-grid-pattern" />
            <div className="signup-glow-1" />
            <div className="signup-glow-2" />
            <div className="signup-glow-3" />

            <div className="signup-content-wrapper">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="signup-header"
                >
                    <div className="signup-logo-container gradient-gold shadow-gold">
                        <BookOpen className="signup-logo-icon" />
                    </div>
                    <h1 className="signup-title font-display">
                        Create your <span className="text-gradient-gold">ILES</span> account
                    </h1>
                    <p className="signup-subtitle">
                        <Sparkles className="signup-subtitle-icon" />
                        Select your role and get started
                    </p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="signup-role-grid"
                >
                    {roleConfig.map((r, i) => (
                        <motion.button
                            type="button"
                            key={r.role}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                            onClick={() => setSelected(r.role)}
                            className={`signup-role-card ${selected === r.role ? `selected ${r.glow}` : "unselected"}`}
                        >
                            <div className="signup-role-hover-overlay" />
                            <div className={`signup-role-icon-box bg-gradient-to-br ${r.gradient}`}>
                                <r.icon className="signup-role-icon" />
                            </div>
                            <p className="signup-role-name">{roleLabels[r.role]}</p>
                            <p className="signup-role-desc">{r.description}</p>
                            {selected === r.role && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="signup-role-selected-icon"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-accent" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Sign Up Form */}
                <motion.form
                    onSubmit={handleSignUp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="card-premium signup-form"
                >
                    {error && (
                        <div className="signup-error-box">
                            <AlertCircle className="signup-error-icon" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="signup-label">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="input-premium signup-input"
                        />
                    </div>
                    <div>
                        <label className="signup-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@university.edu"
                            className="input-premium signup-input"
                        />
                    </div>
                    <div>
                        <label className="signup-label">Password</label>
                        <div className="signup-password-wrapper">
                            <input
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="input-premium signup-password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="signup-password-toggle"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="signup-label">Confirm Password</label>
                        <input
                            type={showPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="input-premium signup-input"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!selected}
                        className="btn-primary signup-submit-btn"
                    >
                        Create Account
                        <ArrowRight className="signup-submit-icon" />
                    </button>
                    <p className="signup-footer-text">
                        Already have an account?{" "}
                        <Link to="/login" className="signup-link">
                            Sign In
                        </Link>
                    </p>
                </motion.form>
            </div>
        </div>
    );
};

export default SignUp;
