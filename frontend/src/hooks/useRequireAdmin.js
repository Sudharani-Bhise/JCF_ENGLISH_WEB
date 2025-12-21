// frontend/src/hooks/useRequireAdmin.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function useRequireAdmin() {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    if (!admin && (!rawUser || !token)) {
      navigate("/admin-login");
    }
  }, [admin, navigate]);
}