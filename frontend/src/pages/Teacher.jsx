import { motion as Motion } from "framer-motion";
import teacherVideo from "../assets/media/videos/sir1.mp4";
import sirPhoto from "../assets/media/photos/sir.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,  
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Teacher() {
  return (
    <div className="w-full overflow-x-hidden 
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* ================= HEADING ================= */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-16 text-center px-6"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
          Meet Our Trainer 🎓
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Learn from an experienced English & Communication Trainer
          with practical, real-life teaching methods.
        </p>
      </Motion.section>

      {/* ================= PROFILE + VIDEO ================= */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="px-6 md:px-20 pb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* ===== PROFILE CARD ===== */}
          <Motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-white/10 backdrop-blur-xl
              rounded-3xl p-8 shadow-2xl
              flex flex-col items-center text-center
            "
          >
            {/* PHOTO */}
            <img
              src={sirPhoto}
              alt="Vaibhav Mahalle"
              className="
                w-40 h-40 sm:w-44 sm:h-44
                rounded-full object-cover
                border-4 border-pink-500
                shadow-xl mb-6
              "
            />

            <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
              Vaibhav Mahalle
            </h2>

            <p className="text-pink-400 font-medium mb-4">
              Senior English & Communication Trainer
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md">
              Helping students speak fluent English with confidence through
              daily speaking practice, interview preparation, grammar clarity
              and real-life communication techniques.
            </p>
          </Motion.div>

          {/* ===== VIDEO CARD ===== */}
          <Motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-black/40 rounded-3xl
              overflow-hidden shadow-2xl
            "
          >
            <video
              src={teacherVideo}
              controls
              preload="metadata"
              className="
                w-full aspect-video
                object-contain bg-black
              "
            />
          </Motion.div>

        </div>
      </Motion.section>

      {/* ================= QUOTE / CTA ================= */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="pb-24 text-center px-6"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
          “Confidence comes from practice, not from perfection.”
        </h2>
        <p className="text-gray-300 mb-8">
          Join JCF Institute and start your English journey today.
        </p>

        <button
          onClick={() => window.location.href = "/contact"}
          className="
            px-10 py-4 rounded-full font-semibold text-lg
            bg-linear-to-r from-pink-500 to-orange-500
            hover:scale-110 transition shadow-2xl
          "
        >
          Book Free Demo 🚀
        </button>
      </Motion.section>
    </div>
  );
}