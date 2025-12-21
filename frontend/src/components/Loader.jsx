// import { motion } from "framer-motion";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";
// import Loader from "./Loader";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const next = location.state?.from || "/";

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = login(email, password);

//     setLoading(false);
//     if (!res.success) {
//       alert(res.message);
//       return;
//     }

//     navigate(next);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 60 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-white"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center">
//           Login to <span className="text-orange-400">JCF Institute</span>
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             placeholder="Email"
//             required
//             className="w-full px-4 py-3 rounded bg-white/20 outline-none"
//           />

//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//             placeholder="Password"
//             required
//             className="w-full px-4 py-3 rounded bg-white/20 outline-none"
//           />

//           <button className="w-full py-3 rounded-full bg-linear-to-r from-pink-500 to-orange-500">
//             Login
//           </button>

//           <p className="text-sm text-center mt-4 text-gray-300">
//             Forgot your password?{" "}
//             <span
//               onClick={() => navigate("/forgot-password")}
//               className="text-orange-400 cursor-pointer hover:underline"
//             >
//               Reset here
//             </span>
//           </p>
//         </form>

//         <p className="text-center mt-4 text-sm">
//           New user?{" "}
//           <Link to="/register" className="text-pink-400 hover:underline">
//             Register
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// }

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#24243e]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-solid"></div>
    </div>
  );
}

