import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/enquiries`)
      .then((res) => res.json())
      .then((data) => setEnquiries(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } else {
      alert('Failed to delete enquiry');
    }
  };

  return (
    <div className="min-h-screen p-8 text-white
      bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <h1 className="text-3xl font-bold mb-8">
        📩 Student Enquiries
      </h1>
      {enquiries.length === 0 ? (
        <p className="text-gray-300">
          No enquiries received yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {enquiries.map((e) => (
            <div
              key={e._id}
              className="
                bg-white/10 backdrop-blur-xl
                rounded-xl p-6 shadow-xl
                border border-white/10
              "
            >
              <h3 className="text-xl font-semibold mb-2">
                {e.name}
              </h3>
              <p className="text-gray-300 text-sm mb-1">
                📧 {e.email}
              </p>
              <p className="text-gray-300 text-sm mb-3">
                🕒 {new Date(e.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-200 mb-4">
                {e.message}
              </p>
              <button
                className="mt-2 px-4 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
                onClick={() => handleDelete(e._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}