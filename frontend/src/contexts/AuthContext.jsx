import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient, setAuthTokens, clearAuthTokens, getAuthTokens } from '../lib/apiClient';

const AuthContext = createContext();

// Retry logic for failed auth requests
const retryAuthFetch = async (fn, maxRetries = 3, delay = 500) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const initRef = useRef(false);
  const location = useLocation();

  // Store the intended destination before auth
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/') {
      sessionStorage.setItem('intendedPath', location.pathname);
    }
  }, [location.pathname]);

  // On app load, restore session and check if user is already logged in
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const restoreSession = async () => {
      const { access } = getAuthTokens();
      if (access) {
        try {
          // Retry fetching user data with exponential backoff
          const userData = await retryAuthFetch(
            () => apiClient.get('/auth/me/'),
            3,
            500
          );
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Don't immediately clear tokens - user might still be authenticated
          // but API is temporarily unavailable
          clearAuthTokens();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);


  const signIn = async (identifier, password) => {
    try {
      const data = await apiClient.post('/auth/login/', { identifier, password }, { requiresAuth: false });
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthTokens({ access: data.access, refresh: data.refresh });
      return { success: true, role: data.user.role };
    } catch (err) {
      setIsAuthenticated(false);
      return { success: false, error: err.message };
    }
  };

  const signUp = async (fullName, email, password, role, studentNumber = null) => {
    try {
      const payload = {
        full_name: fullName,
        email,
        password,
        role,
      };
      if (role === 'student' && studentNumber) {
        payload.student_number = studentNumber;
      }
      const data = await apiClient.post('/auth/register/', payload, { requiresAuth: false });
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthTokens({ access: data.access, refresh: data.refresh });
      return { success: true };
    } catch (err) {
      setIsAuthenticated(false);
      return { success: false, error: err.message };
    }
  };

  const signOut = () => {
    clearAuthTokens();
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('intendedPath');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

