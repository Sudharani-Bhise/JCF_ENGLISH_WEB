import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.name} 👋
      </h1>

      <div className="bg-white/10 p-6 rounded-xl max-w-xl">
        <h2 className="text-xl mb-4">🎓 Enrolled Courses</h2>

        {/* Support both shapes: user.courses (array of strings) and user.enrolledCourses (array of course objects) */}
        {( (user.courses && user.courses.length > 0) || (user.enrolledCourses && user.enrolledCourses.length > 0) ) ? (
          <ul className="list-disc ml-5">
            {(user.courses && user.courses.length > 0 ? user.courses : user.enrolledCourses).map((course, idx) => (
              <li key={idx}>{typeof course === 'string' ? course : (course.name || course)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No courses enrolled yet</p>
        )}

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-6 text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}