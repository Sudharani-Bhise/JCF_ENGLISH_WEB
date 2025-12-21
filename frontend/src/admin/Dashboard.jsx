import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8">

      {/* ===== HEADER ===== */}
      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-10 text-pink-400"
      >
        Admin Dashboard
      </Motion.h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <Motion.div
          variants={cardAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-300 text-sm">Courses</p>
          <h2 className="text-4xl font-bold text-orange-400">5+</h2>
        </Motion.div>

        <Motion.div
          variants={cardAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-300 text-sm">Student Videos</p>
          <h2 className="text-4xl font-bold text-yellow-400">11+</h2>
        </Motion.div>

        <Motion.div
          variants={cardAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-300 text-sm">Testimonials</p>
          <h2 className="text-4xl font-bold text-green-400">8+</h2>
        </Motion.div>

        <Motion.div
          variants={cardAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
        >
          <p className="text-gray-300 text-sm">Enquiries</p>
          <h2 className="text-4xl font-bold text-pink-400">Demo</h2>
        </Motion.div>

      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Quick Actions
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link to="/admin/courses">
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-pink-500 to-orange-500
            rounded-2xl p-6 shadow-2xl font-semibold text-center"
          >
            📚 Manage Courses
          </Motion.div>
        </Link>

        <Link to="/admin/videos">
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-blue-500 to-indigo-600
            rounded-2xl p-6 shadow-2xl font-semibold text-center"
          >
            🎥 Student Videos
          </Motion.div>
        </Link>

        <Link to="/admin/testimonials">
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-green-500 to-emerald-600
            rounded-2xl p-6 shadow-2xl font-semibold text-center"
          >
            💬 Testimonials
          </Motion.div>
        </Link>

        <Link to="/admin/enquiries">
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-yellow-500 to-orange-600
            rounded-2xl p-6 shadow-2xl font-semibold text-center"
          >
            📩 Enquiries
          </Motion.div>
        </Link>

       <Link
        to="/admin/students">
        <Motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-linear-to-r from-yellow-500 to-orange-600
            rounded-2xl p-6 shadow-2xl font-semibold text-center"
          >
        👩‍🎓 Students
        </Motion.div>
        </Link>
      </div>
    </div>
  );
}