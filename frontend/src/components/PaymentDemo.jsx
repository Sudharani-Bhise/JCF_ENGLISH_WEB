import { useState } from "react";

export default function PaymentDemo() {
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handlePay = (e) => {
    e.preventDefault();
    // Simple validation
    if (card.length !== 16 || !/^\d+$/.test(card)) {
      setError("Enter a valid 16-digit card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Enter expiry as MM/YY.");
      return;
    }
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      setError("Enter a valid 3-digit CVV.");
      return;
    }
    setError("");
    setSuccess(true);
  };

  return (
    <div style={{ maxWidth: 350, margin: "40px auto", padding: 24, borderRadius: 12, background: "#fff", boxShadow: "0 2px 8px #0002" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Demo Payment Gateway</h2>
      {success ? (
        <p style={{ color: "green", textAlign: "center" }}>Payment Successful! (Demo)</p>
      ) : (
        <form onSubmit={handlePay}>
          <input
            placeholder="Card Number"
            value={card}
            onChange={e => setCard(e.target.value)}
            maxLength={16}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            required
          /><br/>
          <input
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            maxLength={5}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            required
          /><br/>
          <input
            placeholder="CVV"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            maxLength={3}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            required
          /><br/>
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <button type="submit" style={{ width: "100%", padding: 10, background: "#ff4b2b", color: "#fff", border: "none", borderRadius: 6 }}>
            Pay
          </button>
        </form>
      )}
    </div>
  );
}