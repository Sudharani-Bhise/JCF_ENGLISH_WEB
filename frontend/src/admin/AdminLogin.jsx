import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAdminAuth } from "../context/AdminAuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Forgot password states
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    setMessage(null);
    if (!email) return setMessage({ type: "error", text: "Please enter email first" });
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      setMessage({ type: "success", text: data.otp ? `OTP (dev): ${data.otp}` : "OTP sent" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setMessage(null);
    if (!otp || !newPassword) return setMessage({ type: "error", text: "Provide OTP and new password" });
    if (newPassword.length < 6) return setMessage({ type: "error", text: "Password must be 6+ chars" });
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setMessage({ type: "success", text: data.message || "Password reset successful. Please login." });
      setOtp("");
      setNewPassword("");
      setOtpSent(false);
      setForgotMode(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔐 basic validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const result = await login(email, password);
    if (!result || !result.success) {
      setError(result?.message || "Login failed");
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">

      <Motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl
        shadow-2xl w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Admin Login
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="mb-4 text-center text-red-400 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg
          bg-white/20 outline-none
          focus:ring-2 focus:ring-pink-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg
          bg-white/20 outline-none
          focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-full font-semibold
          bg-linear-to-r from-pink-500 to-orange-500
          hover:scale-105 transition shadow-lg"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setForgotMode((s) => !s)}
            className="text-sm text-pink-300 underline"
          >
            Forgot password?
          </button>
        </div>

        {forgotMode && (
          <div className="mt-6 bg-white/5 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Reset Admin Password</h3>

            {message && (
              <p className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-300'} mb-2`}>{message.text}</p>
            )}

            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded bg-white/10"
                />
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-2 rounded bg-pink-500 text-white"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded bg-white/10"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded bg-white/10"
                />
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading}
                  className="w-full py-2 rounded bg-green-500 text-white"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}

          </div>
        )}

        <p className="text-xs text-gray-300 text-center mt-6">
          Authorized Admins Only
        </p>
      </Motion.form>
    </div>
  );
}