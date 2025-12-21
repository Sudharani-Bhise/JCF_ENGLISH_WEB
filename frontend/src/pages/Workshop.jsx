import { motion as Motion } from "framer-motion";
import useRequireLogin from "../hooks/useRequireLogin";
import workshop1 from "../assets/media/posters/poster1.jpg";
import workshop2 from "../assets/media/posters/poster4.jpg";

const sectionAnim = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function Workshop() {
  const requireLogin = useRequireLogin();

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white"
    >
      {/* ================= HERO ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-20 text-center px-6"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Workshops &{" "}
          <span className="text-pink-400">Masterclasses</span>
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Special English sessions designed to boost confidence, fluency and
          real-life communication skills.
        </p>
      </Motion.section>

      {/* ================= WORKSHOP CARDS ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="px-6 md:px-20 pb-28"
      >
        <div className="grid md:grid-cols-2 gap-12">

          {/* ===== WORKSHOP 1 ===== */}
          <Motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            className="bg-white/10 backdrop-blur-md
            rounded-3xl shadow-2xl overflow-hidden"
          >
            <img
              src={workshop1}
              alt="Spoken English Workshop"
              className="w-full h-64 object-contain bg-black/20"
            />

            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-3">
                Free Spoken English Workshop
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed">
                Improve fluency, confidence and speaking ability with live
                interaction, practice sessions and expert guidance.
              </p>

              <ul className="text-sm text-gray-200 space-y-1 mb-6">
                <li>✔ 5-Day Special Workshop</li>
                <li>✔ Daily Speaking Practice</li>
                <li>✔ Beginner Friendly</li>
              </ul>

              <button
                onClick={() =>
                  requireLogin("/contact")
                }
                className="px-6 py-3 rounded-full font-semibold
                bg-linear-to-r from-pink-500 to-orange-500
                hover:scale-105 transition shadow-lg"
              >
                Register Now 🚀
              </button>
            </div>
          </Motion.div>

          {/* ===== WORKSHOP 2 ===== */}
          <Motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            className="bg-white/10 backdrop-blur-md
            rounded-3xl shadow-2xl overflow-hidden"
          >
            <img
              src={workshop2}
              alt="Personality Development Workshop"
              className="w-full h-64 object-contain bg-black/20"
            />

            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-3">
                Personality Development Masterclass
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed">
                Learn body language, interview confidence, public speaking
                and professional communication skills.
              </p>

              <ul className="text-sm text-gray-200 space-y-1 mb-6">
                <li>✔ Confidence Building</li>
                <li>✔ Interview Preparation</li>
                <li>✔ Communication Skills</li>
              </ul>

              <button
                onClick={() =>
                  requireLogin("/contact")
                }
                className="px-6 py-3 rounded-full font-semibold
                bg-linear-to-r from-pink-500 to-orange-500
                hover:scale-105 transition shadow-lg"
              >
                Register Now 🎯
              </button>
            </div>
          </Motion.div>

        </div>
      </Motion.section>

      {/* ================= CTA ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="py-24 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Don’t Miss These Special Sessions!
        </h2>

        <button
          onClick={() => requireLogin("/contact")}
          className="px-10 py-4 rounded-full font-semibold text-lg
          bg-linear-to-r from-pink-500 to-orange-500
          hover:scale-110 transition shadow-2xl"
        >
          Book Your Seat Now 🔥
        </button>
      </Motion.section>
    </div>
  );
}