import { useState } from "react";
import { motion as Motion } from "framer-motion";

const STORAGE_KEY = "admin_courses";

const defaultCourses = [
  {
    id: 1,
    title: "Spoken English (Beginner)",
    duration: "3 Months",
    price: 2999,
  },
  {
    id: 2,
    title: "Kids English Batch",
    duration: "2 Months",
    price: 2499,
  },
  {
    id: 3,
    title: "Personality Development",
    duration: "1 Month",
    price: 3499,
  },
  {
    id: 4,
    title: "Spoken English (Advanced)",
    duration: "6 Months",
    price: 5999,
  },
];

export default function ManageCourses() {
  const [courses, setCourses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.length > 0 ? saved : defaultCourses;
  });

  /* 🔹 SAVE TO LOCAL STORAGE */
  const saveCourses = (updated) => {
    setCourses(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* 🔹 HANDLE EDIT */
  const handleChange = (id, field, value) => {
    const updated = courses.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    saveCourses(updated);
  };

  /* 🔹 ADD COURSE */
  const addCourse = () => {
    const updated = [
      ...courses,
      {
        id: Date.now(),
        title: "New Course",
        duration: "Duration",
        price: 0,
      },
    ];
    saveCourses(updated);
  };

  /* 🔹 DELETE COURSE */
  const deleteCourse = (id) => {
    const updated = courses.filter((c) => c.id !== id);
    saveCourses(updated);
  };

  return (
    <div className="min-h-screen p-8 text-white
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      <h1 className="text-3xl font-bold mb-10">
        📚 Manage Courses
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Motion.div
            key={course.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/15 backdrop-blur-xl
              rounded-2xl p-6 shadow-xl border border-white/10"
          >
            {/* TITLE */}
            <input
              value={course.title}
              onChange={(e) =>
                handleChange(course.id, "title", e.target.value)
              }
              className="w-full mb-3 px-3 py-2 rounded-lg
              bg-black/30 text-white font-semibold
              focus:ring-2 focus:ring-pink-400 outline-none"
            />

            {/* DURATION */}
            <input
              value={course.duration}
              onChange={(e) =>
                handleChange(course.id, "duration", e.target.value)
              }
              className="w-full mb-3 px-3 py-2 rounded-lg
              bg-black/30 text-white
              focus:ring-2 focus:ring-orange-400 outline-none"
            />

            {/* PRICE */}
            <input
              type="number"
              value={course.price}
              onChange={(e) =>
                handleChange(course.id, "price", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 rounded-lg
              bg-black/30 text-white
              focus:ring-2 focus:ring-green-400 outline-none"
            />

            {/* DELETE */}
            <button
              onClick={() => deleteCourse(course.id)}
              className="w-full py-2 rounded-lg text-sm
              bg-red-500/80 hover:bg-red-600 transition"
            >
              🗑 Delete Course
            </button>
          </Motion.div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={addCourse}
        className="mt-12 px-10 py-3 rounded-full font-semibold
        bg-linear-to-r from-pink-500 to-orange-500
        hover:scale-105 transition shadow-2xl"
      >
        ➕ Add New Course
      </button>
    </div>
  );
}