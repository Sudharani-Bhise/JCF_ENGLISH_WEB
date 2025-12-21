import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password); // calls /api/auth/login
    if (!result || !result.success) {
      setError(result?.message || "Login failed");
      return;
    }
    // After login, verify stored user role is admin
    const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!u || u.role !== 'admin') {
      setError('Not an admin');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <Motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login to <span className="text-orange-400">JCF Institute</span>
        </h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded bg-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded bg-white/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-3 rounded-full bg-linear-to-r from-pink-500 to-orange-500">
            Login
          </button>

          <p className="text-sm text-center mt-4 text-gray-300">
            Forgot your password?{" "}
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-orange-400 cursor-pointer hover:underline"
            >
              Reset here
            </span>
          </p>
        </form>

        <p className="text-center mt-4 text-sm">
          New user?{" "}
          <Link to="/register" className="text-pink-400">
            Register
          </Link>
        </p>
      </Motion.div>
    </div>
  );
}