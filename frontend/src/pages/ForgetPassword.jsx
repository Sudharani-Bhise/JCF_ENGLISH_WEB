import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000/api"; // or use your env variable

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // 'email' | 'verify' | 'done'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Send OTP to user's email via backend
  const handleSendOtp = async () => {
    setMessage("");
    const res = await fetch(`${API_BASE}/auth/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep("verify");
      setMessage("OTP sent to your email.");
    } else {
      setMessage(data.message || "Failed to send OTP");
    }
  };

  // Verify OTP and reset password via backend
  const handleReset = async () => {
    setMessage("");
    const res = await fetch(`${API_BASE}/auth/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep("done");
      setMessage("Password updated successfully. Please login.");
    } else {
      setMessage(data.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="bg-white/10 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          🔐 Reset Password
        </h2>
        {message && <div className="mb-4 text-center text-orange-400">{message}</div>}

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-white/20 outline-none"
            />
            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-white/20 outline-none"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-white/20 outline-none"
            />
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition"
            >
              Reset Password
            </button>
            <button
              onClick={() => { setStep("email"); setOtp(""); }}
              className="w-full py-2 rounded-full bg-white/10 mt-2"
            >
              Use different email
            </button>
          </>
        )}

        {step === "done" && (
          <>
            <div className="mb-4 text-green-400">Password updated! Please login.</div>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}