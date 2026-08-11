import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

const STEPS = ["pending", "processing", "shipped", "out_for_delivery", "delivered"];
const STEP_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="od-page">
        <div className="od-skeleton" />
        <style>{`
          .od-page { max-width: 1000px; margin: 0 auto; padding: 32px 24px; }
          .od-skeleton {
            height: 280px;
            border: 1px solid var(--tm-line);
            background: linear-gradient(100deg, var(--tm-line) 30%, rgba(255,255,255,0.06) 50%, var(--tm-line) 70%);
            background-size: 200% 100%;
            animation: od-shimmer 1.6s ease-in-out infinite;
          }
          @keyframes od-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    );
  }
  if (error) return <p className="od-error">{error}</p>;
  if (!order) return null;

  const addr = order.shippingAddress;
  const status = order.status || (order.isDelivered ? "delivered" : "pending");
  const currentIdx = STEPS.indexOf(status);

  return (
    <motion.div
      className="od-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/orders" className="od-back">← Back to Order History</Link>

      <div className="od-header">
        <h1 className="od-title">Order <span className="od-id">#{order._id}</span></h1>
      </div>

      <div className="od-layout">
        <div className="od-main">
          {/* Status tracker */}
          <motion.div
            className="od-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h6 className="od-card-title">Order Status</h6>

            <div className="od-steps">
              {STEPS.map((s, i) => (
                <div key={s} className="od-step">
                  {i > 0 && (
                    <div className={`od-step-line ${i <= currentIdx ? "done" : ""}`} />
                  )}
                  <div className={`od-step-dot ${i <= currentIdx ? "done" : ""}`}>
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  <div className={`od-step-label ${i === currentIdx ? "current" : ""} ${i <= currentIdx ? "done" : ""}`}>
                    {STEP_LABELS[s]}
                  </div>
                </div>
              ))}
            </div>

            <p className={`od-status-note ${order.isDelivered ? "delivered" : ""}`}>
              {order.isDelivered
                ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                : order.estimatedDelivery
                  ? `Estimated delivery: ${new Date(order.estimatedDelivery).toDateString()}`
                  : "Not yet delivered"}
            </p>
          </motion.div>

          {/* Shipping */}
          <motion.div
            className="od-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h6 className="od-card-title">Shipping</h6>
            <p className="od-text">{addr?.fullName}</p>
            <p className="od-text">{addr?.phone}</p>
            <p className="od-text">
              {addr?.addressLine1}
              {addr?.addressLine2 ? `, ${addr.addressLine2}` : ""}
            </p>
            <p className="od-text" style={{ marginBottom: 0 }}>
              {addr?.city}, {addr?.state} {addr?.postalCode}
            </p>
          </motion.div>

          {/* Payment */}
          <motion.div
            className="od-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h6 className="od-card-title">Payment</h6>
            <p className="od-text">Method: {order.paymentMethod}</p>
            <p className={`od-status-note ${order.isPaid ? "delivered" : "pending"}`} style={{ marginBottom: 0 }}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Payment pending"}
            </p>
          </motion.div>

          {/* Items */}
          <motion.div
            className="od-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h6 className="od-card-title">Items</h6>
            <div className="od-items">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="od-item">
                  <img
                    src={item.image || "https://via.placeholder.com/70"}
                    alt={item.name}
                    className="od-item-img"
                  />
                  <div className="od-item-info">
                    <div className="od-item-name">{item.name}</div>
                    <div className="od-item-qty">
                      Qty {item.qty} × ₹{item.price?.toFixed(2)}
                      {item.size && <span className="od-item-size"> · Size {item.size}</span>}
                    </div>
                  </div>
                  <div className="od-item-total">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          className="order-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h5 className="summary-title">Order Summary</h5>
          <div className="summary-row">
            <span>Items</span><span>₹{order.itemsPrice?.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="summary-free">
              {order.shippingPrice ? `₹${order.shippingPrice.toFixed(2)}` : "Complimentary"}
            </span>
          </div>
          <div className="summary-row">
            <span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <strong>Total</strong>
            <strong>₹{order.totalPrice?.toFixed(2)}</strong>
          </div>
        </motion.div>
      </div>

      <style>{`
        .od-page { max-width: 1100px; margin: 0 auto; padding: 32px 24px 96px; }

        .od-back {
          color: var(--tm-muted);
          font-size: 12px;
          text-decoration: none;
          letter-spacing: 0.05em;
        }
        .od-back:hover { color: var(--tm-gold); }

        .od-header {
          padding: 14px 0 18px;
          border-bottom: 1px solid var(--tm-line);
          margin: 12px 0 32px;
        }
        .od-title {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          margin: 0;
          font-weight: 500;
        }
        .od-id { color: var(--tm-gold); font-weight: 600; }

        .od-error { text-align: center; color: #b3261e; font-size: 13px; padding: 60px 0; }

        .od-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
          align-items: start;
        }

        .od-card {
          border: 1px solid var(--tm-line);
          padding: 24px;
          margin-bottom: 20px;
        }
        .od-card-title {
          font-family: "Playfair Display", serif;
          font-size: 16px;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .od-text {
          color: var(--tm-muted);
          font-size: 13px;
          margin: 0 0 4px;
        }

        /* Status tracker */
        .od-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .od-step {
          text-align: center;
          flex: 1;
          position: relative;
        }
        .od-step-line {
          position: absolute;
          top: 13px;
          right: 50%;
          width: 100%;
          height: 1px;
          background: var(--tm-line);
          z-index: 0;
        }
        .od-step-line.done { background: var(--tm-gold); }
        .od-step-dot {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--tm-line);
          background: transparent;
          color: var(--tm-muted);
          font-size: 11px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }
        .od-step-dot.done {
          border-color: var(--tm-gold);
          background: var(--tm-gold);
          color: #0b0b0c;
        }
        .od-step-label {
          font-size: 10.5px;
          letter-spacing: 0.03em;
          color: var(--tm-muted);
          font-weight: 500;
        }
        .od-step-label.done { color: var(--tm-gold); }
        .od-step-label.current { font-weight: 700; }

        .od-status-note {
          margin: 22px 0 0;
          font-size: 12.5px;
          color: var(--tm-muted);
        }
        .od-status-note.delivered { color: var(--tm-gold); }
        .od-status-note.pending { color: #b8860b; }

        /* Items */
        .od-items { display: flex; flex-direction: column; gap: 16px; }
        .od-item { display: flex; align-items: center; gap: 14px; }
        .od-item-img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .od-item-info { flex: 1; min-width: 0; }
        .od-item-name {
          font-size: 13.5px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .od-item-qty { font-size: 11.5px; color: var(--tm-muted); margin-top: 2px; }
        .od-item-total { font-size: 13.5px; font-weight: 600; color: var(--tm-gold); flex-shrink: 0; }

        /* Summary */
        .order-summary {
          border: 1px solid var(--tm-line);
          padding: 24px;
          position: sticky;
          top: 90px;
        }
        .summary-title {
          font-family: "Playfair Display", serif;
          font-size: 17px;
          margin: 0 0 18px;
          font-weight: 500;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--tm-muted);
          margin-bottom: 10px;
        }
        .summary-free { color: var(--tm-gold); font-weight: 600; }
        .summary-divider { height: 1px; background: var(--tm-line); margin: 14px 0; }
        .summary-total { font-size: 15px; color: inherit; margin-bottom: 0; }

        @media (max-width: 860px) {
          .od-layout { grid-template-columns: 1fr; }
          .order-summary { position: static; }
        }
        @media (max-width: 480px) {
          .od-page { padding: 24px 16px 72px; }
          .od-step-label { font-size: 9px; }
        }
      `}</style>
    </motion.div>
  );
}