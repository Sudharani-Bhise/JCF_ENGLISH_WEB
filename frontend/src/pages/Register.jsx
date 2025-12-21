import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register({ ...form, email: form.email.trim().toLowerCase() });
    if (!result.success) {
      alert(result.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <Motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create <span className="text-orange-400">Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/20 rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/20 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/20 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full py-3 rounded-full bg-linear-to-r from-pink-500 to-orange-500">
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-pink-400">
            Login
          </Link>
        </p>
      </Motion.div>
    </div>
  );
}