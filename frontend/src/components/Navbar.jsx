import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    "Home",
    "Courses",
    "Students",
    "Teacher",
    "Testimonials",
    "Workshop",
    "Contact",
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50
      bg-linear-to-r from-[#0f0c29]/90 via-[#302b63]/90 to-[#24243e]/90
      backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide
          bg-linear-to-r from-pink-400 to-orange-400
          bg-clip-text text-transparent"
        >
          JCF Institute
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <nav className="hidden md:flex items-center gap-8 text-gray-200 font-medium">

          {menuItems.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="hover:text-pink-400 transition"
            >
              {item}
            </Link>
          ))}

          {/* ===== AUTH SECTION ===== */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-pink-400
                text-pink-400 hover:bg-pink-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-full
                bg-linear-to-r from-pink-500 to-orange-500
                text-white hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* ADMIN BUTTON - Only if user is admin */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full border border-orange-400
                  text-orange-400 hover:bg-orange-400 hover:text-white transition"
                >
                  🔧 Admin
                </Link>
              )}
              
              <div className="relative">
                {/* PROFILE BUTTON */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2
                  bg-white/10 rounded-full hover:bg-white/20 transition"
                >
                  <span className="w-8 h-8 flex items-center justify-center
                    rounded-full bg-pink-500 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm">{user.name}</span>
                </button>

                {/* DROPDOWN */}
                {profileOpen && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-44
                    bg-[#1f1b3a] rounded-xl shadow-xl
                    border border-white/10 overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 hover:bg-white/10"
                    >
                      👤 My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3
                      text-red-400 hover:bg-white/10"
                    >
                      🚪 Logout
                    </button>
                  </Motion.div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* ================= HAMBURGER ================= */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-white"
        >
          ☰
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0f0c29]/95 backdrop-blur-xl
          border-t border-white/10"
        >
          <nav className="flex flex-col text-center py-6 gap-5 text-gray-200 font-medium">

            {menuItems.map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="hover:text-orange-400 transition"
              >
                {item}
              </Link>
            ))}

            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
                <Link to="/logout" onClick={() => setOpen(false)}>🔐 Logout</Link>
              </>
            ) : (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    🔧 Admin
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)}>
                  👤 My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="text-red-400"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </Motion.div>
      )} 
    </header>
  );
}