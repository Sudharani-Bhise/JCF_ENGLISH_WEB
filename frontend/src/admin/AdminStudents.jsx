import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useRequireAdmin from "../hooks/useRequireAdmin";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useRequireAdmin();

  useEffect(() => {
    // Fetch students from backend
    const token = localStorage.getItem("adminToken");
    const currentUser = JSON.parse(localStorage.getItem("adminUser") || 'null');
    
    // If not admin, don't fetch
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/admin-login");
      return;
    }

    fetch(`${API_BASE}/admin/users`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          navigate("/admin-login");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setStudents(data.users || []);
      })
      .catch(err => console.error('Failed to fetch students:', err));
  }, [navigate]);

  // Delete student function
  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
      setStudents(students.filter(s => s._id !== id));
    } else {
      alert("Failed to delete student");
    }
  };

  return (
    <div className="min-h-screen p-8 text-white
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"
    >
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        👩‍🎓 Students List
      </h1>

      {students.length === 0 ? (
        <p className="text-gray-400">No students registered yet</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students
            .filter(student => student.role !== "admin")
            .map((student) => (
              <Motion.div
                key={student._id} // <-- fix here
                whileHover={{ scale: 1.04 }}
                className="bg-white/10 backdrop-blur-xl
                rounded-2xl p-6 shadow-xl"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {student.name}
                </h2>

                <p className="text-sm text-gray-300 mb-3">
                  📧 {student.email}
                </p>

                <div className="text-sm">
                  <p className="font-medium mb-1">📚 Enrolled Courses:</p>

                  {student.courses?.length > 0 ? (
                    <ul className="list-disc ml-5 text-gray-300">
                      {student.courses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">
                      No courses enrolled
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(student._id)}
                  className="mt-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </Motion.div>
            ))}
        </div>
      )}
    </div>
  );
}