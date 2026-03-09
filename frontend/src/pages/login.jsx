import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/data/mockData";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import "./Login.css";

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

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        const result = signIn(email, password);
        if (result.success && result.role) {
            navigate(rolePaths[result.role]);
        } else {
            setError(result.error || "Login failed.");
        }
    };

    return (
        <div className="login-container">
            {/* Background effects */}
            <div className="login-bg-grid bg-grid-pattern" />
            <div className="login-glow-1" />
            <div className="login-glow-2" />

            <div className="login-content-wrapper">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="login-header"
                >
                    <div className="login-logo-container gradient-gold shadow-gold">
                        <BookOpen className="login-logo-icon" />
                    </div>
                    <h1 className="login-title font-display">
                        Sign in to <span className="text-gradient-gold">ILES</span>
                    </h1>
                    <p className="login-subtitle">
                        <Sparkles className="login-subtitle-icon" />
                        Internship Logging & Evaluation System
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="card-premium login-form"
                >
                    {error && (
                        <div className="login-error-box">
                            <AlertCircle className="login-error-icon" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="login-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@university.edu"
                            className="input-premium login-input"
                        />
                    </div>
                    <div>
                        <label className="login-label">Password</label>
                        <div className="login-password-wrapper">
                            <input
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-premium login-password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="login-password-toggle"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary login-submit-btn">
                        Sign In
                        <ArrowRight className="login-submit-icon" />
                    </button>
                    <p className="login-footer-text">
                        Don't have an account?{" "}
                        <Link to="/signup" className="login-link">
                            Sign Up
                        </Link>
                    </p>
                </motion.form>
            </div>
        </div>
    );
};

export default Login;
