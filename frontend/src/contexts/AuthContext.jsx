import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiError, getAuthTokens } from "@/lib/apiClient";
import { authService } from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("iles_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const tokens = getAuthTokens();
    return Boolean(tokens.access || tokens.refresh);
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const tokens = getAuthTokens();

      if (!tokens.access && !tokens.refresh) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem("iles_user", JSON.stringify(currentUser));
      } catch (error) {
        authService.logout();
        localStorage.removeItem("iles_user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email and password required." };
    }

    try {
      const authenticatedUser = await authService.login({ email, password });
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem("iles_user", JSON.stringify(authenticatedUser));
      return { success: true, role: authenticatedUser.role, user: authenticatedUser };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in right now. Please try again.";
      return { success: false, error: message };
    }
  };

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
    try {
      const registeredUser = await authService.register({
        fullName: name,
        email,
        password,
        role,
      });
      setUser(registeredUser);
      setIsAuthenticated(true);
      localStorage.setItem("iles_user", JSON.stringify(registeredUser));
      return { success: true, role: registeredUser.role, user: registeredUser };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to create account right now. Please try again.";
      return { success: false, error: message };
    }
  };

  const signOut = () => {
    authService.logout();
    localStorage.removeItem("iles_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAuthLoading, signIn, signUp, signOut }}
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
