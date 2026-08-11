import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

function OrderRow({ o }) {
  const status = o.status || (o.isDelivered ? "delivered" : "pending");

  return (
    <motion.div
      className="order-item"
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={o.orderItems?.[0]?.image || "https://via.placeholder.com/100"}
        alt={o.orderItems?.[0]?.name || "Order"}
        className="order-item-img"
      />

      <div className="order-item-info">
        <h6 className="order-item-name">
          {o.orderItems?.length} item{o.orderItems?.length !== 1 ? "s" : ""}
          <span className="order-item-id"> · {o._id}</span>
        </h6>
        <p className="order-item-date">
          Placed on {new Date(o.createdAt).toLocaleDateString()}
        </p>
        <span className={`order-status status-${status}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="order-item-actions">
        <span className="order-item-price">₹{o.totalPrice?.toFixed(2)}</span>
        <Link to={`/orders/${o._id}`} className="order-details-btn">
          Details
        </Link>
      </div>
    </motion.div>
  );
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("current");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const current = orders.filter((o) => (o.status || (o.isDelivered ? "delivered" : "pending")) !== "delivered");
  const delivered = orders.filter((o) => (o.status || (o.isDelivered ? "delivered" : "pending")) === "delivered");
  const list = tab === "current" ? current : delivered;

  return (
    <motion.div
      className="oh-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="oh-header">
        <h1 className="oh-title">Order History</h1>
        {!loading && !error && orders.length > 0 && (
          <span className="oh-header-count">{orders.length} order{orders.length === 1 ? "" : "s"}</span>
        )}
      </div>

      {!loading && !error && orders.length > 0 && (
        <div className="oh-tabs">
          <button
            className={`oh-tab ${tab === "current" ? "active" : ""}`}
            onClick={() => setTab("current")}
          >
            Current ({current.length})
          </button>
          <button
            className={`oh-tab ${tab === "delivered" ? "active" : ""}`}
            onClick={() => setTab("delivered")}
          >
            Delivered ({delivered.length})
          </button>
        </div>
      )}

      {loading ? (
        <div className="oh-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-skeleton" />
          ))}
        </div>
      ) : error ? (
        <p className="oh-error">{error}</p>
      ) : orders.length === 0 ? (
        <motion.div
          className="oh-empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <svg className="oh-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
            <path d="M3 8l9 5 9-5" />
            <path d="M12 13v8" />
          </svg>
          <p className="oh-empty-title">No orders yet</p>
          <p className="oh-empty-sub">When you place an order, it'll show up here.</p>
          <button className="oh-btn-outline" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </motion.div>
      ) : list.length === 0 ? (
        <p className="oh-empty-tab">
          {tab === "current" ? "No orders in progress." : "No delivered orders yet."}
        </p>
      ) : (
        <div className="oh-list">
          <AnimatePresence>
            {list.map((o) => <OrderRow key={o._id} o={o} />)}
          </AnimatePresence>
        </div>
      )}

      <style>{`
        .oh-page { max-width: 1000px; margin: 0 auto; padding: 32px 24px 96px; }

        .oh-header {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 12px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--tm-line);
          margin-bottom: 24px;
        }
        .oh-title {
          font-family: "Playfair Display", serif;
          font-size: 26px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .oh-header-count {
          font-size: 12px;
          letter-spacing: 0.05em;
          color: var(--tm-muted);
        }

        /* Tabs */
        .oh-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }
        .oh-tab {
          background: transparent;
          border: 1px solid var(--tm-line);
          color: var(--tm-muted);
          padding: 9px 20px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .2s ease;
        }
        .oh-tab:hover { border-color: var(--tm-gold); color: var(--tm-gold); }
        .oh-tab.active {
          background: var(--tm-gold);
          border-color: var(--tm-gold);
          color: #0b0b0c;
          font-weight: 600;
        }

        /* Order rows */
        .oh-list { display: flex; flex-direction: column; gap: 12px; }

        .order-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
          border: 1px solid var(--tm-line);
        }
        .order-item-img {
          height: 64px;
          width: 64px;
          flex-shrink: 0;
          object-fit: cover;
          border-radius: 2px;
        }
        .order-item-info { flex: 1; min-width: 0; }
        .order-item-name {
          font-family: "Playfair Display", serif;
          font-size: 14.5px;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .order-item-id {
          font-family: inherit;
          font-weight: 400;
          font-size: 11px;
          color: var(--tm-muted);
        }
        .order-item-date {
          font-size: 11.5px;
          color: var(--tm-muted);
          margin: 0 0 8px;
        }
        .order-status {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid;
        }
        .status-pending { color: #b8860b; border-color: #b8860b; }
        .status-processing { color: #4f7cff; border-color: #4f7cff; }
        .status-shipped { color: #8b5cf6; border-color: #8b5cf6; }
        .status-out_for_delivery { color: #d946a0; border-color: #d946a0; }
        .status-delivered { color: var(--tm-gold); border-color: var(--tm-gold); }

        .order-item-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .order-item-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--tm-gold);
        }
        .order-details-btn {
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 8px 18px;
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background .2s ease, color .2s ease;
        }
        .order-details-btn:hover { background: var(--tm-gold); color: #0b0b0c; }

        /* Skeleton */
        .order-skeleton {
          height: 92px;
          border: 1px solid var(--tm-line);
          background: linear-gradient(100deg, var(--tm-line) 30%, rgba(255,255,255,0.06) 50%, var(--tm-line) 70%);
          background-size: 200% 100%;
          animation: oh-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes oh-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty states */
        .oh-error { text-align: center; color: #b3261e; font-size: 13px; }
        .oh-empty-tab { text-align: center; padding: 40px 0; color: var(--tm-muted); font-size: 13px; }

        .oh-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 90px 20px;
          color: var(--tm-muted);
        }
        .oh-empty-icon {
          width: 40px;
          height: 40px;
          margin-bottom: 20px;
          color: var(--tm-gold);
          opacity: 0.7;
        }
        .oh-empty-title {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          margin: 0 0 6px;
        }
        .oh-empty-sub { font-size: 13px; margin-bottom: 26px; }
        .oh-btn-outline {
          background: transparent;
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 11px 26px;
          font-size: 10.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .25s ease, color .25s ease;
        }
        .oh-btn-outline:hover { background: var(--tm-gold); color: #0b0b0c; }

        @media (max-width: 480px) {
          .oh-page { padding: 24px 16px 72px; }
          .order-item { flex-wrap: wrap; }
          .order-item-actions { width: 100%; justify-content: space-between; margin-top: 10px; }
        }
      `}</style>
    </motion.div>
  );
}