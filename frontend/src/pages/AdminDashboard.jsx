import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // useCallback so we can safely call this from multiple triggers
  // (mount, focus, returning from edit page) without stale closures.
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      // Cache-buster (`_t`) prevents any browser/proxy from serving a
      // stale cached response for the products GET request.
      const [pRes, uRes, oRes] = await Promise.all([
        api.get(`/api/products?limit=50&_t=${Date.now()}`),
        api.get("/api/users"),
        api.get("/api/orders"),
      ]);
      setProducts(pRes.data.products || []);
      setUsers(uRes.data || []);
      setOrders(oRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch on mount AND every time we navigate back to this route
  // (e.g. from the edit page). location.key changes on every navigation,
  // even if the path is the same, so this is more reliable than an
  // empty-dependency mount-only effect.
  useEffect(() => {
    loadAll();
  }, [loadAll, location.key]);

  // Also refetch when the browser tab regains focus, in case the data
  // changed in another tab/window.
  useEffect(() => {
    const onFocus = () => loadAll();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadAll]);

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Deleted");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
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

  const addNewProduct = async () => {
    try {
      setCreating(true);
      const { data } = await api.post("/api/products");
      toast.success("Product created — now edit its details");
      // Refresh immediately so the placeholder product shows up in the
      // list even before the user finishes editing it.
      await loadAll();
      navigate(`/admin/product/${data._id}/edit`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

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
            <>
              <div className="tm-admin-toolbar">
                <input
                  type="text"
                  className="tm-search-input"
                  placeholder="Search products by name, brand, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="tm-admin-toolbar-actions">
                  <button
                    type="button"
                    className="tm-refresh-btn"
                    onClick={loadAll}
                    title="Refresh product list"
                  >
                    ↻ Refresh
                  </button>
                  <button
                    type="button"
                    className="tm-add-btn"
                    onClick={addNewProduct}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "+ Add Product"}
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <p className="tm-empty-msg">
                  {searchTerm
                    ? `No products match "${searchTerm}".`
                    : "No products yet. Click \"+ Add Product\" to create one."}
                </p>
              ) : (
                <motion.div
                  className="tm-product-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProducts.map((p, i) => (
                    <motion.div
                      className="tm-admin-card"
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      <img src={p.image} alt={p.name} className="tm-admin-card-img" />
                      <h3 className="tm-admin-card-name">{p.name || "(untitled)"}</h3>
                      <p className="tm-admin-card-price">₹{p.price ?? 0}</p>
                      <div className="tm-admin-card-actions">
                        <button
                          className="tm-edit-btn"
                          onClick={() => navigate(`/admin/product/${p._id}/edit`)}
                        >
                          Edit
                        </button>
                        <motion.button
                          className="tm-delete-btn"
                          onClick={() => deleteProduct(p._id)}
                          whileTap={{ scale: 0.96 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
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

        .tm-admin-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .tm-admin-toolbar-actions {
          display: flex;
          gap: 10px;
        }
        .tm-search-input {
          flex: 1;
          min-width: 200px;
          max-width: 360px;
          background: transparent;
          border: 1px solid var(--tm-line);
          color: inherit;
          padding: 10px 14px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .tm-search-input:focus { border-color: var(--tm-gold); }
        .tm-empty-msg {
          text-align: center;
          color: var(--tm-muted);
          padding: 48px 0;
          font-size: 13px;
        }
        .tm-refresh-btn {
          background: transparent;
          border: 1px solid var(--tm-line);
          color: var(--tm-muted);
          padding: 10px 16px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .tm-refresh-btn:hover { border-color: var(--tm-gold); color: var(--tm-gold); }
        .tm-add-btn {
          background: transparent;
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 10px 20px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .tm-add-btn:hover { background: var(--tm-gold); color: #fff; }
        .tm-add-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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
          background: #f2f2f2;
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
        .tm-admin-card-actions {
          display: flex;
          gap: 8px;
        }
        .tm-edit-btn {
          flex: 1;
          background: transparent;
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 8px;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .tm-edit-btn:hover { background: var(--tm-gold); color: #fff; }
        .tm-delete-btn {
          flex: 1;
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
          .tm-admin-toolbar { flex-direction: column; align-items: stretch; }
          .tm-search-input { max-width: none; }
        }
      `}</style>
    </motion.div>
  );
}