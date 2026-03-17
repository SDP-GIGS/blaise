import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext();

const API_URL = 'http://127.0.0.1:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

   const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, role: data.user.role, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed.' };
      }
    } catch (error) {
      return { success: false, error: 'Could not connect to server.' };
    }
  };

  const signUp = (name, email, password, role) => {
    const existing = users.find((u) => u.email === email);

    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      role,
      name,
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);

    return {
      success: true,
      role,
      user: newUser,
    };
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut }}>
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
