import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Payment() {
  const [method, setMethod] = useState("upi");
  const [confirmed, setConfirmed] = useState(false);
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const total = JSON.parse(localStorage.getItem("cart") || "[]")
    .reduce((a, i) => a + i.price * i.qty, 0);

  const handlePayment = () => {
    if (method === "cod") {
      setConfirmed(true);
    } else {
      alert("📱 Please scan the QR code and complete your payment!");
    }
  };

  const methods = [
    { id: "upi", icon: "📱", label: "UPI / GPay", desc: "Scan & Pay" },
    { id: "card", icon: "💳", label: "Card", desc: "Visa / Mastercard" },
    { id: "cod", icon: "💵", label: "Cash on Delivery", desc: "Pay at doorstep" },
  ];

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Steps */}
      <div className="tm-steps">
        <div className="tm-step done">
          <div className="tm-step-number"><i className="bi bi-check"></i></div>
          <span className="d-none d-sm-inline">Shipping</span>
        </div>
        <div className="tm-step-line done"></div>
        <div className="tm-step active">
          <div className="tm-step-number">2</div>
          <span className="d-none d-sm-inline">Payment</span>
        </div>
        <div className="tm-step-line"></div>
        <div className={`tm-step ${confirmed ? "done" : ""}`}>
          <div className="tm-step-number">{confirmed ? <i className="bi bi-check"></i> : "3"}</div>
          <span className="d-none d-sm-inline">Complete</span>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <motion.div
          className="glass-card p-4 w-100"
          style={{ maxWidth: "600px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="mb-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Choose Payment Method
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
            Total: <strong className="text-gradient">₹{total.toFixed(2)}</strong>
          </p>

          {/* Payment method cards */}
          <div className="row g-3 mb-4">
            {methods.map((m) => (
              <div className="col-4" key={m.id}>
                <motion.div
                  className={`payment-method-card ${method === m.id ? "selected" : ""}`}
                  onClick={() => setMethod(m.id)}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="pm-icon">{m.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{m.label}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{m.desc}</div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* UPI QR */}
          <AnimatePresence>
            {method === "upi" && (
              <motion.div
                className="text-center mb-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Scan this QR to pay via GPay / BHIM:</p>
                <img
                  src={`${backendUrl}/uploads/gpay-qr.jpg`}
                  alt="GPay QR Code"
                  width="180"
                  className="rounded"
                  style={{ border: "2px solid var(--border)" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/180?text=QR+Not+Found";
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="btn-gradient-success w-100"
            onClick={handlePayment}
            whileTap={{ scale: 0.96 }}
            style={{ padding: "12px" }}
          >
            <i className="bi bi-shield-check me-2"></i>Confirm Payment
          </motion.button>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                className="mt-4 p-4 text-center"
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  borderRadius: "var(--radius)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎉</div>
                <h5 className="fw-bold" style={{ color: "var(--success)" }}>Order Placed Successfully!</h5>
                <p style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Expected delivery:{" "}
                  <strong>{new Date(Date.now() + 5 * 86400000).toDateString()}</strong>
                </p>
                <small style={{ color: "var(--text-muted)" }}>Shipping from Navsari, Gujarat</small>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
