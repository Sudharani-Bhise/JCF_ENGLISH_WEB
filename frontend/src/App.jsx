import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import StudentsAdmin from "./admin/AdminStudents";

// USER PAGES
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Students from "./pages/Students";
import Teacher from "./pages/Teacher";
import Testimonials from "./pages/Testimonials";
import Videos from "./pages/Videos";
import Workshop from "./pages/Workshop";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Enroll from "./pages/Enroll";
import Success from "./pages/Success";
import Profile from "./pages/Profile"; // ✅ ADD THIS
import AdminStudents from "./admin/AdminStudents";
import ForgotPassword from "./pages/ForgetPassword";
// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// ADMIN PAGES
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageCourses from "./admin/ManageCourses";
import TestimonialsAdmin from "./admin/TestimonialsAdmin";
import AdminVideos from "./admin/AdminVideos";
import AdminPayments from "./admin/AdminPayments";
import EquiriesAdmin from "./admin/EquiriesAdmin"; // ✅ FIX SPELLING

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <AdminAuthProvider>

        {/* USER NAVBAR */}
        {!isAdminRoute && <Navbar />}
        <main className={!isAdminRoute ? "pt-20 overflow-visible" : ""}>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/workshop" element={<Workshop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ENROLL FLOW */}
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/success" element={<Success />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="enquiries" element={<EquiriesAdmin />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>
        </main>
        {/* USER FOOTER */}
        {!isAdminRoute && <Footer />}

      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;