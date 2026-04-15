import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthTokens, clearAuthTokens, getAuthTokens } from '../lib/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const restoreSession = async () => {
      const { access } = getAuthTokens();
      if (access) {
        try {
          const userData = await apiClient.get('/auth/me/');
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          clearAuthTokens();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const signIn = async (identifier, password) => {
  try {
    const data = await apiClient.post('/auth/login/', { identifier, password });
    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return { success: true, role: data.user.role };
  } catch (err) {
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
    const data = await apiClient.post('/auth/register/', payload);
    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

  const signOut = () => {
    clearAuthTokens();
    setUser(null);
    setIsAuthenticated(false);
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

