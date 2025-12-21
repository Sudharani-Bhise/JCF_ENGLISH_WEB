import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]
      text-white px-4"
    >
      <Motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl
        rounded-3xl p-10 text-center shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-green-400 mb-4">
          🎉 Enrollment Successful!
        </h2>

        <p className="text-gray-300 mb-6">
          You have successfully enrolled in the course.  
          Our team will contact you soon.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-full font-semibold
          bg-linear-to-r from-pink-500 to-orange-500
          hover:scale-105 transition"
        >
          Go to Home 🏠
        </button>
      </Motion.div>
    </div>
  );
}