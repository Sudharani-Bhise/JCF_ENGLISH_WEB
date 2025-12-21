/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const AdminAuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export function AuthProvider({ children }) {
  const safeParse = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(() => safeParse('currentUser'));
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : null;
  });

  const saveSession = (u, t) => {
    localStorage.setItem('currentUser', JSON.stringify(u));
    localStorage.setItem('token', t);
    setUser(u);
    setToken(t);
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Register failed' };
      saveSession(data.user, data.token);

      // --- demo compatibility: also persist user into localStorage 'users' array
      try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.find(u => u.email === data.user.email);
        if (!exists) {
          users.push({ name: data.user.name, email: data.user.email, password: '' }); // password not stored here
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch { /* ignore */ }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Login failed' };
      saveSession(data.user, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const enrollCourse = async (courseName) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/courses/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseName })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };
      const updatedUser = { ...user, courses: data.courses };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (newPassword) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch(`${API_BASE}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword })
      });
      if (!res.ok) return { success: false, message: 'Could not change password' };
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, enrollCourse, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const rawUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    if (rawUser && token) {
      const u = JSON.parse(rawUser);
      if (u.role === "admin") return u;
    }
    return null;
  });

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setAdmin(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const useAdminAuth = () => useContext(AdminAuthContext);