import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function Enroll() {
  const { user, enrollCourse } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleEnroll = async () => {
    // Create order (server will return demo order if no Razorpay configured)
    try {
      const res = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 2999 })
      });
      const data = await res.json();
      const order = data.order;

      // If Razorpay key is present, open checkout; otherwise simulate payment and enroll
      if (import.meta.env.VITE_RAZORPAY_KEY_ID && !data.demo) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'JCF Institute',
          description: 'Course enrollment',
          order_id: order.id,
          handler: async function (response) {
            // Verify server-side
            const v = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response)
            });
            const vd = await v.json();
            if (vd.ok) {
              await enrollCourse('Spoken English');
              navigate('/success');
            } else {
              alert('Payment verification failed');
            }
          }
        };
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.body.appendChild(script);
        script.onload = () => {

          const rzp = new window.Razorpay(options);
          rzp.open();
        };
      } else {
        // Demo flow - directly enroll and navigate
        await enrollCourse('Spoken English');
        navigate('/success');
        // Optionally, notify server about simulated payment
        await fetch(`${API_BASE}/payments/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ demo: true, order_id: order.id }) });
      }

    } catch (err) {
      console.error(err);
      alert('Payment failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <Motion.div className="bg-white/10 p-8 rounded-xl w-95">
        <h2 className="text-2xl font-bold mb-4">Course Enrollment</h2>

        <p>📘 Spoken English</p>
        <p>⏳ 3 / 6 Months</p>
        <p className="text-yellow-400">💰 ₹2999 / ₹5999</p>

        <button
          onClick={handleEnroll}
          className="mt-6 w-full bg-orange-500 py-3 rounded-full"
        >
          Pay Now & Enroll 🚀
        </button>
      </Motion.div>
    </div>
  );
}