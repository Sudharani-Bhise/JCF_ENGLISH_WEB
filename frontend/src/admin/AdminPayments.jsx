import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function AdminPayments() {
  const [txs, setTxs] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTxs = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/transactions`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setTxs(data.transactions || []);
    setLoading(false);
  };

  const deleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/transactions/${id}`, { 
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` } 
    });
    if (res.ok) {
      setTxs(txs.filter(t => t._id !== id));
    }
  };

  useEffect(() => {
    (async () => { await fetchTxs(); })();
  }, []);

  const exportCSV = () => {
    const rows = [ ['Date','Email','Phone','Course','Amount','Provider','OrderId','PaymentId'] ];
    txs.forEach(t => rows.push([ new Date(t.createdAt).toLocaleString(), t.email||'', t.phone||'', t.courseName||'', t.amount||0, t.provider||'', t.orderId||'', t.paymentId||'' ]));
    const csv = rows.map(r => r.map(c => `"${(''+c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `transactions_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8 text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <h1 className="text-3xl font-bold mb-6">💳 Transactions</h1>

      <div className="mb-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search email or course" className="p-2 rounded bg-white/10" />
        <button onClick={fetchTxs} className="px-4 py-2 bg-pink-500 rounded">Search</button>
        <button onClick={exportCSV} className="px-4 py-2 bg-green-500 rounded ml-auto">Export CSV</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {txs.map(t => (
            <div key={t._id} className="bg-white/10 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{t.email || t.phone}</div>
                  <div className="text-sm text-gray-300">{t.courseName} — {t.provider}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">₹{t.amount || 0}</div>
                    <div className="text-sm text-gray-300">{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  <button onClick={() => deleteTransaction(t._id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
