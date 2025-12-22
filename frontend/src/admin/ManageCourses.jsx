import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const defaultCourses = [
  {
    _id: "1",
    name: "Spoken English (Beginner)",
    duration: "3 Months",
    price: 2999,
  },
  {
    _id: "2",
    name: "Kids English Batch",
    duration: "2 Months",
    price: 2499,
  },
  {
    _id: "3",
    name: "Personality Development",
    duration: "1 Month",
    price: 3499,
  },
  {
    _id: "4",
    name: "Spoken English (Advanced)",
    duration: "6 Months",
    price: 5999,
  },
];

export default function ManageCourses() {
  const [courses, setCourses] = useState(defaultCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.warn('No admin token, using default courses');
        // If no token but we can access page, use defaults as fallback
        setCourses(defaultCourses);
        setLoading(false);
        return;
      }
      
      const res = await fetch(`${API_BASE}/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        // If server error but we have token, still try to show message
        const errorData = await res.json().catch(() => ({}));
        console.warn('Failed to fetch courses, status:', res.status, errorData);
        
        // If 401/403, auth issue - clear token
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setError('Authentication failed. Please login again.');
        } else {
          // Other errors, show defaults as fallback
          console.warn('Using default courses as fallback');
          setCourses(defaultCourses);
        }
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      // If API returns courses, use them. Otherwise use defaults
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        console.log('Loaded courses from API:', data.courses);
        setCourses(data.courses);
      } else {
        console.warn('API returned empty courses, using defaults');
        setCourses(defaultCourses);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(`Error loading courses: ${err.message}`);
      // On network error, show defaults as fallback
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 HANDLE EDIT - Save to API */
  const handleChange = async (id, field, value) => {
    const updated = courses.map((c) =>
      c._id === id ? { ...c, [field]: value } : c
    );
    setCourses(updated);
    
    // Also save to API
    try {
      const token = localStorage.getItem('adminToken');
      const courseToUpdate = updated.find(c => c._id === id);
      const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(courseToUpdate)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to update course:', errorData.message);
      }
    } catch (err) {
      console.error('Failed to save course change:', err);
    }
  };

  /* 🔹 ADD COURSE */
  const addCourse = async () => {
    const newCourse = {
      name: "New Course",
      duration: "Duration",
      price: 0,
    };
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('No authentication token found. Please login again.');
        return;
      }
      
      const res = await fetch(`${API_BASE}/admin/courses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newCourse)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.course) {
        setCourses([...courses, data.course]);
        alert('Course added successfully!');
      }
    } catch (err) {
      console.error('Failed to add course:', err);
      alert('Failed to add course: ' + err.message);
    }
  };

  /* 🔹 DELETE COURSE */
  const deleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses(courses.filter((c) => c._id !== id));
        alert('Course deleted successfully!');
        // Re-fetch to ensure frontend stays in sync
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen p-8 text-white
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">

      <h1 className="text-3xl font-bold mb-10">
        📚 Manage Courses
      </h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-400">Loading courses...</p>
        </div>
      )}

      {/* COURSES GRID */}
      {!loading && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
          <Motion.div
            key={course._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white/15 backdrop-blur-xl
              rounded-2xl p-6 shadow-xl border border-white/10"
          >
            {/* TITLE */}
            <input
              value={course.name}
              onChange={(e) =>
                handleChange(course._id, "name", e.target.value)
              }
              className="w-full mb-3 px-3 py-2 rounded-lg
              bg-black/30 text-white font-semibold
              focus:ring-2 focus:ring-pink-400 outline-none"
            />

            {/* DURATION */}
            <input
              value={course.duration}
              onChange={(e) =>
                handleChange(course._id, "duration", e.target.value)
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
                handleChange(course._id, "price", e.target.value)
              }
              className="w-full mb-4 px-3 py-2 rounded-lg
              bg-black/30 text-white
              focus:ring-2 focus:ring-green-400 outline-none"
            />

            {/* DELETE */}
            <button
              onClick={() => deleteCourse(course._id)}
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
        </>
      )}
    </div>
  );
}