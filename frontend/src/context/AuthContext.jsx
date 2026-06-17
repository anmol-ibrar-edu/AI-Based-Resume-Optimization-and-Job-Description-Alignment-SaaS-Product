/*
 * File: context/AuthContext.jsx
 * Purpose: Manages the authentication state of the user, providing login, registration, and logout functionality globally via React Context.
 * Missing Impact: The application would be unable to track user sessions, and protected features would become inaccessible or insecure.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await userAPI.getMe();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('token', response.data.access_token);
    await checkAuth();
    return response;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Navigation is handled by the component calling logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

