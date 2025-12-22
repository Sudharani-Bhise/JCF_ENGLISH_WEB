// frontend/src/hooks/useRequireAdmin.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function useRequireAdmin() {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rawAdmin = localStorage.getItem("adminUser");
    const adminToken = localStorage.getItem("adminToken");
    if (!admin && (!rawAdmin || !adminToken)) {
      navigate("/admin-login");
    }
  }, [admin, navigate]);
}