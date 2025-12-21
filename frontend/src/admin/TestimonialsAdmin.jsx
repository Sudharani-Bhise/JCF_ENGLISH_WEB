import { useState } from "react";
import { motion as Motion } from "framer-motion";

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState(() => JSON.parse(localStorage.getItem("testimonials")) || []);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  // 🔹 Save to localStorage
  const saveToStorage = (data) => {
    localStorage.setItem("testimonials", JSON.stringify(data));
    setTestimonials(data);
  };

  // 🔹 Image upload (base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Add testimonial
  const addTestimonial = () => {
    if (!name || !text || !image) {
      alert("Please fill all fields & upload image");
      return;
    }

    const newTestimonial = {
      id: Date.now(),
      name,
      text,
      img: image,
    };

    const updated = [newTestimonial, ...testimonials];
    saveToStorage(updated);

    setName("");
    setText("");
    setImage("");
  };

  // 🔹 Delete testimonial
  const deleteTestimonial = (id) => {
    const updated = testimonials.filter((t) => t.id !== id);
    saveToStorage(updated);
  };

  return (
    <div
      className="min-h-screen p-8 text-white
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"
    >
      {/* ===== TITLE ===== */}
      <h1 className="text-3xl font-bold mb-10 text-pink-400">
        💬 Manage Testimonials
      </h1>

      {/* ===== ADD FORM ===== */}
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl
        rounded-2xl p-8 shadow-2xl mb-12 max-w-2xl"
      >
        <h2 className="text-xl font-semibold mb-6 text-orange-400">
          Add New Testimonial
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg
            bg-white/20 outline-none"
          />

          <textarea
            placeholder="Testimonial Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 rounded-lg
            bg-white/20 outline-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm"
          />

          {/* Image Preview */}
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover
              border-4 border-pink-400 mt-2"
            />
          )}

          <button
            onClick={addTestimonial}
            className="mt-4 px-8 py-3 rounded-full font-semibold
            bg-linear-to-r from-pink-500 to-orange-500
            hover:scale-105 transition"
          >
            ➕ Add Testimonial
          </button>
        </div>
      </Motion.div>

      {/* ===== LIST ===== */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <Motion.div
            key={t.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg
            rounded-2xl p-6 shadow-xl"
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover
              border-4 border-orange-400 mb-4"
            />

            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="text-gray-300 text-sm mt-2">
              “{t.text}”
            </p>

            <button
              onClick={() => deleteTestimonial(t.id)}
              className="mt-4 text-sm text-red-400 hover:underline"
            >
              🗑 Delete
            </button>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}