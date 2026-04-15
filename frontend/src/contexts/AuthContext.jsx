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
      
      setAuthTokens({ access: data.access, refresh: data.refresh });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, role: data.user.role, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed.' };
    }
  };

  const signUp = async (name, email, password, role) => {
    try {
      const data = await apiClient.post('/auth/register/', {
        full_name: name, email, password, role
      }, { requiresAuth: false });
      setAuthTokens({ access: data.access, refresh: data.refresh });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, role: data.user.role, user: data.user };
    } catch (error) {
      return { success: false, error: error.message || 'Sign up failed.' };
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

