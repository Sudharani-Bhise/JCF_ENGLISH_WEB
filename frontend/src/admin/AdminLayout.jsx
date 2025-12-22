import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLayout() {
  const { admin, logout, adminReady } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure admin is not logged in
    if (adminReady && !admin) {
      navigate("/admin-login");
    }
  }, [adminReady, admin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded 
     ${isActive ? "bg-pink-500 text-white" : "text-gray-300 hover:text-pink-400"}`;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f0c29] text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/courses" className={linkClass}>
            Courses
          </NavLink>
          <NavLink to="/admin/videos" className={linkClass}>
            Videos
          </NavLink>
          <NavLink to="/admin/testimonials" className={linkClass}>
            Testimonials
          </NavLink>
          <NavLink to="/admin/enquiries" className={linkClass}>
            Enquiries 
          </NavLink>
          <NavLink to="/admin/students" className={linkClass}>
            Students
          </NavLink>
          <NavLink to="/admin/payments" className={linkClass}>
            Payments
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 text-sm text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}