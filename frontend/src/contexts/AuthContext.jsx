import React, { createContext, useContext, useState } from "react";
import { mockUsers } from "@/data/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage on first render
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("iles_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("iles_user"),
  );

  // Mock signIn: check against mockUsers for authentication and role assignment
  const signIn = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email and password required." };
    }
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) {
      return { success: false, error: "Invalid email or password." };
    }
    const user = { ...found };
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem("iles_user", JSON.stringify(user));
    return { success: true, role: user.role, user };
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
    localStorage.setItem("iles_user", JSON.stringify(user));
    return { success: true, role, user };
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("iles_user");
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
