import { motion as Motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

import student1 from "../assets/media/testimonials/student1.jpg";
import student2 from "../assets/media/testimonials/student2.jpg";
import student3 from "../assets/media/testimonials/student3.jpg";
import student4 from "../assets/media/testimonials/student4.jpg";
import student5 from "../assets/media/testimonials/student5.jpg";
import student6 from "../assets/media/testimonials/student6.jpg";
import student7 from "../assets/media/testimonials/student7.jpg";
import student8 from "../assets/media/testimonials/student8.jpg";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

/* 🔹 DEFAULT testimonials (fallback) */
const defaultTestimonials = [
  { name: "Parth Dhondekar", text: "My English confidence improved a lot.", img: student1 },
  { name: "Shrushti Hole", text: "Daily speaking practice helped me speak fluently.", img: student2 },
  { name: "Vishesh Patil", text: "Best English classes with practical teaching.", img: student3 },
  { name: "Soham Nalegaonkar", text: "Friendly environment and excellent guidance.", img: student4 },
  { name: "Isha Munje", text: "I can speak English confidently now.", img: student5 },
  { name: "Krushnai Kadu", text: "Very supportive trainer and clear explanation.", img: student6 },
  { name: "Bhavika Bagdi", text: "Grammar and speaking both improved.", img: student7 },
  { name: "Ninad Deshmukh", text: "Highly recommended for spoken English.", img: student8 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        if (data.testimonials && data.testimonials.length > 0) {
          // Combine default + new testimonials and reverse (newest first)
          const combined = [...defaultTestimonials, ...data.testimonials];
          setTestimonials(combined.reverse());
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setTestimonials(defaultTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-20">

      {/* ===== HEADING ===== */}
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        className="text-center px-6 mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          What Our Students Say ❤
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Real feedback from students who gained confidence & fluency in English.
        </p>
</Motion.div>

      {/* ===== TESTIMONIALS SCROLL ===== */}
      <div className="relative px-6 md:px-20 overflow-hidden">
        {/* LEFT ARROW */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full z-10 text-white font-bold"
        >
          ◀
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full z-10 text-white font-bold"
        >
          ▶
        </button>

        <Motion.div
          ref={scrollRef}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="flex gap-8 overflow-x-auto overflow-y-visible pb-6 scroll-smooth no-scrollbar"
        >
        {testimonials.map((item, index) => (
          <Motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            className="min-w-70 sm:min-w-80 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 shrink-0 text-center"
          >
            {/* PHOTO */}
            <img
              src={item.img || student1}
              alt={item.name}
              className="w-20 h-20 rounded-full mx-auto object-cover mb-4
              border-4 border-pink-400"
            />

            {/* NAME */}
            <h3 className="text-lg font-semibold">{item.name}</h3>

            {/* STARS */}
            <div className="flex justify-center my-2 text-yellow-400">
              ★★★★★
            </div>

            {/* FEEDBACK */}
            <p className="text-gray-300 text-sm leading-relaxed">
              “{item.text}”
            </p>
          </Motion.div>        ))}        </Motion.div>
      </div>
    </div>
  );
}