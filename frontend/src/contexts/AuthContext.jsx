import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = (email, password) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return {
        success: true,
        role: foundUser.role,
        user: foundUser,
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password',
      };
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
