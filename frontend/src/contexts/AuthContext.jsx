import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock signIn: accept any email/password, assign role by email prefix
  const signIn = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email and password required." };
    }
    // Simple role assignment for demo
    let role = "student";
    if (email.startsWith("admin")) role = "admin";
    else if (email.startsWith("supervisor")) role = "workplace_supervisor";
    else if (email.startsWith("academic")) role = "academic_supervisor";
    const user = { email, role, full_name: email.split("@")[0] };
    setUser(user);
    setIsAuthenticated(true);
    return { success: true, role, user };
  };

  // Mock signUp: accept any data, store user in state
  const signUp = async (name, email, password, role) => {
    if (!name || !email || !password || !role) {
      return { success: false, error: "All fields required." };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }
    const user = { full_name: name, email, role };
    setUser(user);
    setIsAuthenticated(true);
    return { success: true, role, user };
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
