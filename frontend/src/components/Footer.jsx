import { Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* ===== BRAND ===== */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-pink-400">
            JCF Institute
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Empowering students to speak English confidently through
            expert training, real-life practice and guidance.
          </p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "Courses", path: "/courses" },
              { name: "Students", path: "/students" },
              { name: "Teacher", path: "/teacher" },
              { name: "Testimonials", path: "/testimonials" },
              { name: "Workshop", path: "/workshop" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="hover:text-orange-400 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== CONTACT INFO ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-300 text-sm mb-2">
            📍 Sangola, Maharashtra
          </p>
          <p className="text-gray-300 text-sm mb-2">
            📞 +91 97308 83984
          </p>
          <p className="text-gray-300 text-sm">
            ✉ jcfinstitute@gmail.com
          </p>
        </div>

        {/* ===== SOCIAL MEDIA ===== */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-5 text-2xl">

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Englishspeaking_with_vaibhav"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-500 hover:scale-110 transition"
              title="YouTube"
            >
              <FaYoutube />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/vaibhav_mahalle18"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 hover:scale-110 transition"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919730883984"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-400 hover:scale-110 transition"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>

          </div>
        </div>
      </div>

      {/* ===== BOTTOM ===== */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} JCF Institute. All rights reserved.
      </div>
    </footer>
  );
}