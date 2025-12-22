import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        const data = await res.json();
        
        if (data.courses && user.courses && user.courses.length > 0) {
          // Match enrolled courses with course details
          // user.courses contains course names
          const details = data.courses.filter(course => {
            const courseNameLower = (course.name || course.title || '').toLowerCase().trim();
            return user.courses.some(enrolled => {
              const enrolledLower = enrolled.toLowerCase().trim();
              // Exact match or partial match
              return courseNameLower === enrolledLower || 
                     courseNameLower.includes(enrolledLower) || 
                     enrolledLower.includes(courseNameLower);
            });
          });
          
          // Use matched courses, or create fallback from user.courses
          if (details.length > 0) {
            setCourseDetails(details);
          } else {
            // Fallback: show enrolled course names with "Check admin" message
            setCourseDetails(
              user.courses.map(name => ({ 
                _id: name, 
                name, 
                duration: 'Contact admin', 
                price: 0 
              }))
            );
          }
        } else if (user.courses && user.courses.length > 0) {
          // No courses found in database, show enrolled names
          setCourseDetails(
            user.courses.map(name => ({ 
              _id: name, 
              name, 
              duration: 'Contact admin', 
              price: 0 
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        // Still show enrolled courses even if fetch fails
        if (user.courses && user.courses.length > 0) {
          setCourseDetails(
            user.courses.map(name => ({ 
              _id: name, 
              name, 
              duration: 'Contact admin', 
              price: 0 
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.courses && user.courses.length > 0) {
      fetchCourseDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.name} 👋
      </h1>

      <div className="bg-white/10 p-6 rounded-xl max-w-4xl">
        <h2 className="text-xl mb-6">🎓 Enrolled Courses</h2>

        {loading ? (
          <p>Loading course details...</p>
        ) : courseDetails.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {courseDetails.map((course) => (
              <div key={course._id} className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-400">{course.name}</h3>
                <div className="text-sm text-gray-300 mt-2 space-y-1">
                  <p>⏳ Duration: {course.duration}</p>
                  <p>💰 Price: ₹{course.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No courses enrolled yet</p>
        )}

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-8 text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}