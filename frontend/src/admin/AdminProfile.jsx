import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProfile() {
  const { admin, setAdmin } = useAdminAuth();
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (admin) setName(admin.name || "");
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!name) return setMessage({ type: "error", text: "Name is required" });
    if (newPassword && newPassword.length < 6)
      return setMessage({ type: "error", text: "New password must be at least 6 characters" });

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:4000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // update context & localStorage
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      setAdmin(data.user);
      setOldPassword("");
      setNewPassword("");
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile">
      <h2>Admin Profile</h2>
      {message && (
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Only required when changing password"
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave empty to keep current password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
