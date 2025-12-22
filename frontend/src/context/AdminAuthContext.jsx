/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [adminReady, setAdminReady] = useState(false);

  // Load admin from localStorage on initial mount
  useEffect(() => {
    try {
      const adminUser = localStorage.getItem("adminUser");
      const adminToken = localStorage.getItem("adminToken");
      
      if (adminUser && adminToken) {
        const user = JSON.parse(adminUser);
        if (user.role === "admin") {
          setAdmin(user);
        }
      }
    } catch (err) {
      console.error('Failed to load admin from localStorage:', err);
      // Clear invalid data
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    }
    // Mark as ready after attempting to load
    setAdminReady(true);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Use separate keys for admin to avoid conflicts with user auth
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.token);
        setAdmin(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, login, logout, adminReady }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
