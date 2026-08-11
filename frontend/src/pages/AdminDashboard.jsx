import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

const TABS = ["products", "users", "orders"];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [pRes, uRes, oRes] = await Promise.all([
        api.get("/api/products?limit=50"),
        api.get("/api/users"),
        api.get("/api/orders"),
      ]);
      setProducts(pRes.data.products || []);
      setUsers(uRes.data || []);
      setOrders(oRes.data || []);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Deleted");
      loadAll();
    } catch { toast.error("Delete failed"); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      toast.success("Status updated");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <motion.div
      className="tm-admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tm-admin-head">
        <span className="tm-admin-eyebrow">Or Noir</span>
        <h1 className="tm-admin-title">Admin Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="tm-stats">
        {[
          { label: "Products", value: products.length },
          { label: "Users", value: users.length },
          { label: "Orders", value: orders.length },
        ].map((s, i) => (
          <motion.div
            className="tm-stat-card"
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="tm-stat-value">{loading ? "—" : s.value}</div>
            <div className="tm-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tm-admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tm-admin-tab ${activeTab === tab ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="tm-admin-loading"><div className="tm-loader"></div></div>
      ) : (
        <>
          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              className="tm-product-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((p, i) => (
                <motion.div
                  className="tm-admin-card"
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <img src={p.image} alt={p.name} className="tm-admin-card-img" />
                  <h3 className="tm-admin-card-name">{p.name}</h3>
                  <p className="tm-admin-card-price">₹{p.price}</p>
                  <motion.button
                    className="tm-delete-btn"
                    onClick={() => deleteProduct(p._id)}
                    whileTap={{ scale: 0.96 }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              className="tm-table-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tm-table-wrap">
                <table className="tm-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="tm-td-strong">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`tm-pill ${u.isAdmin ? "tm-pill--gold" : "tm-pill--muted"}`}>
                            {u.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              className="tm-table-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tm-table-wrap">
                <table className="tm-table">
                  <thead>
                    <tr><th>Order ID</th><th>User</th><th>Total</th><th>Paid</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const status = o.status || (o.isDelivered ? "delivered" : "pending");
                      return (
                        <tr key={o._id}>
                          <td className="tm-td-mono">{o._id.slice(-8)}</td>
                          <td className="tm-td-strong">{o.user?.name}</td>
                          <td className="tm-td-price">₹{o.totalPrice}</td>
                          <td>
                            {o.isPaid ? (
                              <span className="tm-pill tm-pill--gold">
                                {new Date(o.paidAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="tm-pill tm-pill--danger">No</span>
                            )}
                          </td>
                          <td>
                            <select
                              value={status}
                              onChange={(e) => updateStatus(o._id, e.target.value)}
                              className="tm-status-select"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}

      <style>{`
        .tm-admin { max-width: 1400px; margin: 0 auto; padding: 48px 24px 96px; }

        .tm-admin-head { text-align: center; margin-bottom: 36px; }
        .tm-admin-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--tm-gold);
          margin-bottom: 10px;
        }
        .tm-admin-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 4vw, 40px);
          margin: 0;
        }

        .tm-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 36px;
        }
        .tm-stat-card {
          border: 1px solid var(--tm-line);
          padding: 24px;
          text-align: center;
        }
        .tm-stat-value {
          font-family: "Playfair Display", serif;
          font-size: 32px;
          color: var(--tm-gold);
        }
        .tm-stat-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--tm-muted);
          margin-top: 6px;
        }

        .tm-admin-tabs {
          display: flex;
          justify-content: center;
          gap: 36px;
          margin-bottom: 36px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--tm-line);
        }
        .tm-admin-tab {
          background: none;
          border: none;
          padding: 4px 0;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--tm-muted);
          border-bottom: 1px solid transparent;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .tm-admin-tab:hover { color: var(--tm-gold); }
        .tm-admin-tab.is-active { color: var(--tm-gold); border-color: var(--tm-gold); }

        .tm-admin-loading { display: flex; justify-content: center; padding: 64px 0; }
        .tm-loader {
          width: 28px; height: 28px;
          border: 2px solid var(--tm-line);
          border-top-color: var(--tm-gold);
          border-radius: 50%;
          animation: tm-spin 0.8s linear infinite;
        }
        @keyframes tm-spin { to { transform: rotate(360deg); } }

        .tm-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .tm-admin-card {
          border: 1px solid var(--tm-line);
          padding: 14px;
        }
        .tm-admin-card-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          margin-bottom: 12px;
        }
        .tm-admin-card-name {
          font-family: "Playfair Display", serif;
          font-size: 14px;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tm-admin-card-price {
          font-size: 13px;
          font-weight: 600;
          color: var(--tm-gold);
          margin: 0 0 12px;
        }
        .tm-delete-btn {
          width: 100%;
          background: transparent;
          border: 1px solid var(--tm-line);
          color: var(--tm-muted);
          padding: 8px;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .tm-delete-btn:hover { border-color: #b3261e; color: #b3261e; }

        .tm-table-card { border: 1px solid var(--tm-line); }
        .tm-table-wrap { overflow-x: auto; }
        .tm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tm-table thead th {
          text-align: left;
          padding: 14px 20px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--tm-muted);
          border-bottom: 1px solid var(--tm-line);
        }
        .tm-table tbody td {
          padding: 14px 20px;
          border-bottom: 1px solid var(--tm-line);
        }
        .tm-table tbody tr:last-child td { border-bottom: none; }
        .tm-td-strong { font-weight: 600; }
        .tm-td-mono { font-family: monospace; font-size: 12px; color: var(--tm-muted); }
        .tm-td-price { color: var(--tm-gold); font-weight: 600; }

        .tm-pill {
          display: inline-block;
          padding: 4px 12px;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--tm-line);
          color: var(--tm-muted);
        }
        .tm-pill--gold { border-color: var(--tm-gold); color: var(--tm-gold); }
        .tm-pill--muted { color: var(--tm-muted); }
        .tm-pill--danger { border-color: #b3261e; color: #b3261e; }

        .tm-status-select {
          background: transparent;
          border: 1px solid var(--tm-line);
          color: var(--tm-gold);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 10px;
          cursor: pointer;
        }

        @media (max-width: 720px) {
          .tm-stats { grid-template-columns: 1fr; }
          .tm-admin-tabs { gap: 20px; }
        }
      `}</style>
    </motion.div>
  );
}