/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

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
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setAdmin(data.user); // <-- Ye line add karo!
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
    <AdminAuthContext.Provider value={{ admin, setAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);

