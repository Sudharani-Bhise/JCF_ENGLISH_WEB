import { motion as Motion } from "framer-motion";
import { useState } from "react";
import useRequireLogin from "../hooks/useRequireLogin";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const requireLogin = useRequireLogin();
  const { user } = useAuth(); // 🔑 check login

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // <-- Add this
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setStatus("");
    // 🔐 STEP 1: Login check (EXACT like Courses)
    if (!user) {
      requireLogin("/contact");
      return;
    }

    // 🔒 STEP 2: Only logged-in users reach here
    if (!name || !email || !phone || !message) return;

    const enquiries =
      JSON.parse(localStorage.getItem("enquiries")) || [];

    const newEnquiry = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "enquiries",
      JSON.stringify([...enquiries, newEnquiry])
    );

    await fetch("http://localhost:4000/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("Message sent successfully!");
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
        } else {
          setStatus("Failed to send message.");
        }
      })
      .catch(() => {
        setStatus("Network error.");
      });
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* ===== HEADING ===== */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-16 text-center px-6"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Contact <span className="text-pink-400">JCF Institute</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Have questions? Want to join our English courses?
        </p>
      </Motion.section>

      {/* ===== CONTENT ===== */}
      <Motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        className="px-6 md:px-20 pb-24"
      >
        <div className="grid md:grid-cols-2 gap-14">

          {/* LEFT INFO */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-pink-400">
              Get In Touch
            </h2>

            <p>📍 Sangola, Maharashtra</p>
            <p>📞 +91 97308 83984</p>
            <p>✉ jcfinstitute@gmail.com</p>

            <a
              href="https://wa.me/919730883984"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 px-6 py-3 rounded-full font-semibold
              bg-linear-to-r from-green-400 to-green-600 hover:scale-105 transition"
            >
              Chat on WhatsApp 💬
            </a>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-orange-400">
              Send Us a Message
            </h2>

            <div className="space-y-5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg bg-white/20 outline-none"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-white/20 outline-none"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg bg-white/20 outline-none"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-lg bg-white/20 outline-none"
              />

              {/* 🔐 LOGIN-FIRST BUTTON */}
              <button
                onClick={handleSendMessage}
                className="w-full py-3 rounded-full font-semibold
                bg-linear-to-r from-pink-500 to-orange-500 hover:scale-105 transition"
              >
                Send Message 🚀
              </button>

              {status && <div className="mt-4 text-center">{status}</div>}
            </div>
          </div>

        </div>
      </Motion.section>
    </div>
  );
}