import { motion as Motion } from "framer-motion";
import { useState, useEffect } from "react";
import useRequireLogin from "../hooks/useRequireLogin";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const defaultCourses = [
  {
    id: "spoken-beginner",
    title: "Spoken English (Beginner)",
    desc: "Basic speaking skills & confidence building",
    duration: "3 Months",
    level: "Beginner",
    price: "₹2999",
  },
  {
    id: "kids",
    title: "Kids English Batch",
    desc: "Fun learning, basics & pronunciation",
    duration: "6 Months",
    level: "Kids",
    price: "₹2499",
  },
  {
    id: "personality",
    title: "Personality Development",
    desc: "Confidence, body language & public speaking",
    duration: "6 Month",
    level: "All Levels",
    price: "₹3499",
  },
  {
    id: "spoken-advanced",
    title: "Spoken English (Advanced)",
    desc: "Fluency, interviews & real-life communication",
    duration: "6 Months",
    level: "Advanced",
    price: "₹5999",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Courses() {
  const requireLogin = useRequireLogin();
  const [courses, setCourses] = useState(defaultCourses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        const data = await res.json();
        if (data.courses && data.courses.length > 0) {
          // Map database courses to include necessary fields for display
          const mappedApiCourses = data.courses.map(c => ({
            id: c._id,
            title: c.name,
            desc: c.description || 'Course description',
            duration: c.duration || '3 Months',
            level: c.level || 'All Levels',
            price: `₹${c.price || 0}`
          }));
          
          // Merge: Keep defaults + add new ones from API that aren't in defaults
          const defaultNames = defaultCourses.map(c => c.title.toLowerCase());
          const newCourses = mappedApiCourses.filter(c => 
            !defaultNames.includes(c.title.toLowerCase())
          );
          setCourses([...defaultCourses, ...newCourses]);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* HEADER */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-16 text-center px-6"
      >
        <h1 className="text-5xl font-extrabold">
          Our <span className="text-orange-400">Courses</span>
        </h1>
        <p className="text-gray-300 mt-4">
          Choose the right English course & start speaking confidently.
        </p>
      </Motion.section>

      {/* COURSES */}
      <section className="px-6 md:px-20 pb-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Motion.div
              key={course.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-300 text-sm mt-2">{course.desc}</p>

                <div className="text-sm text-gray-400 mt-4 space-y-1">
                  <p>⏳ Duration: {course.duration}</p>
                  <p>🎯 Level: {course.level}</p>
                  <p className="text-lg text-yellow-400 font-semibold mt-2">
                    💰 Price: {course.price}
                  </p>
                </div>

                <div className="mt-4 text-sm bg-white/10 p-3 rounded-lg">
                  🎁 Free 5-Day Workshop Included
                </div>
              </div>

              <button
                onClick={() => requireLogin("/enroll")}
                className="mt-6 w-full py-3 rounded-full font-semibold
                bg-linear-to-r from-pink-500 to-orange-500
                hover:scale-105 transition"
              >
                Enroll Now 🚀
              </button>
            </Motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}