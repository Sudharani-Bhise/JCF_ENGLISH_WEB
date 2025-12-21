import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// images
import institute1 from "../assets/media/photos/institute1.jpg";
import institute2 from "../assets/media/photos/institute2.jpg";
import institute3 from "../assets/media/photos/institute3.jpg";
import poster4 from "../assets/media/posters/poster4.jpg";
import teacher1 from "../assets/media/photos/teacher1.jpg";
import teacher2 from "../assets/media/photos/teacher2.jpg";

const courses = [
  {
    id: "spoken-beginner",
    title: "Spoken English (Beginner)",
    desc: "Confidence & daily speaking practice",
  },
  {
    id: "spoken-advanced",
    title: "Spoken English (Advanced)",
    desc: "Fluency, interviews & real life English",
  },
  {
    id: "grammar",
    title: "Grammar Course",
    desc: "Tenses, sentence structure & accuracy",
  },
  {
    id: "personality",
    title: "Personality Development",
    desc: "Confidence & public speaking",
  },
  {
    id: "kids",
    title: "Kids English Batch",
    desc: "Fun learning & pronunciation",
  },
];

const sectionAnim = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div className="w-full overflow-x-hidden bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* ================= HERO ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        animate="visible"
        className="w-full py-20 grid md:grid-cols-2 items-center px-6 md:px-20 gap-12 overflow-visible"
        >
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            Speak English <br />
            <span className="bg-linear-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 max-w-xl">
            Join JCF Institute and transform your communication skills with expert guidance.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/courses")}
              className="px-8 py-3 rounded-full font-semibold
              bg-linear-to-r from-pink-500 to-orange-500 hover:scale-105 transition"
            >
              Explore Courses
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-3 rounded-full font-semibold
              border border-white/30 hover:bg-white/10 transition"
            >
              Free Demo
            </button>
          </div>
        </div>

        <Motion.img
          src={institute1}
          className="w-full max-w-sm md:max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
          whileHover={{ scale: 1.05 }}
        />
      </Motion.section>

      {/* ================= WHY ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="py-20 bg-white/5 backdrop-blur-md"
      >
        <h2 className="text-4xl font-bold text-center mb-14">
          Why Choose <span className="text-pink-400">JCF Institute?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10 px-6 md:px-20">
          {[institute2, institute3, poster4].map((img, i) => (
            <Motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="bg-white/10 rounded-2xl p-6 shadow-xl text-center"
            >
              <img src={img} className="h-40 mx-auto mb-4 object-contain" />
              <h3 className="text-xl font-semibold">
                {i === 0
                  ? "Expert Trainers"
                  : i === 1
                  ? "Practical Learning"
                  : "Affordable Fees"}
              </h3>
            </Motion.div>
          ))}
        </div>
      </Motion.section>

      {/* ================= COURSES (ARROWS + NO LINE + NO SCROLLBAR) ================= */}
<Motion.section
  variants={sectionAnim}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
  className="py-20"
>
  <h2 className="text-4xl font-bold text-center mb-12">
    Popular <span className="text-orange-400">Courses</span>
  </h2>

  {/* OUTER WRAPPER – prevents extra scrollbar */}
  <div className="relative px-6 md:px-20 overflow-hidden">

    {/* LEFT ARROW */}
    <button
      onClick={scrollLeft}
      className="absolute left-2 top-1/2 -translate-y-1/2 
      bg-white/20 px-4 py-2 rounded-full z-10"
    >
      ◀
    </button>

    {/* RIGHT ARROW */}
    <button
      onClick={scrollRight}
      className="absolute right-2 top-1/2 -translate-y-1/2 
      bg-white/20 px-4 py-2 rounded-full z-10"
    >
      ▶
    </button>

    {/* SCROLL CONTAINER */}
    <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-visible scroll-smooth no-scrollbar py-2"
      >
      {courses.map((course) => (
        <Motion.div
          key={course.id}
          whileHover={{ y: -12 }}
          className="min-w-55 sm:min-w-70 bg-white/10 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-2">
            {course.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {course.desc}
          </p>
          <button
            onClick={() => navigate(`/courses#${course.id}`)}
            className="text-pink-400 hover:underline"
          >
            View Details →
          </button>
        </Motion.div>
      ))}
    </div>
  </div>
</Motion.section>

      {/* ================= TRAINERS ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="py-20 bg-white/5"
      >
        <h2 className="text-4xl font-bold text-center mb-14">
          Meet Our <span className="text-yellow-400">Trainers</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 px-6 md:px-32">
          {[teacher1, teacher2].map((img, i) => (
            <Motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 rounded-2xl p-6 text-center shadow-xl"
            >
              <img src={img} className="h-64 mx-auto mb-4 object-contain" />
              <h3 className="text-xl font-semibold">
                {i === 0 ? "Senior English Trainer" : "Communication Expert"}
              </h3>
            </Motion.div>
          ))}
        </div>
      </Motion.section>

      {/* ================= CTA ================= */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="py-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">
          Ready to Speak English Fluently?
        </h2>

        <button
          onClick={() => navigate("/contact")}
          className="px-10 py-4 rounded-full font-semibold text-lg
          bg-linear-to-r from-pink-500 to-orange-500 hover:scale-110 transition"
        >
          Join Now 🚀
        </button>
      </Motion.section>
    </div>
  );
}