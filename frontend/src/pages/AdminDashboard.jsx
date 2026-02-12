import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";

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

  const markDelivered = async (id) => {
    try {
      await api.put(`/api/orders/${id}/deliver`);
      toast.success("Marked delivered");
      loadAll();
    } catch { toast.error("Failed"); }
  };

  return (
    <motion.div
      className="container my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-center mb-4" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
        <span className="text-gradient">Admin Dashboard</span>
      </h3>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Products", value: products.length, icon: "bi-box" },
          { label: "Users", value: users.length, icon: "bi-people" },
          { label: "Orders", value: orders.length, icon: "bi-receipt" },
        ].map((s, i) => (
          <div className="col-4" key={i}>
            <motion.div
              className="tm-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <i className={`bi ${s.icon}`} style={{ fontSize: "1.5rem", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}></i>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="d-flex justify-content-center mb-4">
        <div className="tm-tab-pills">
          {["products", "users", "orders"].map((tab) => (
            <button
              key={tab}
              className={`tm-tab-pill ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="tm-loader mx-auto"></div></div>
      ) : (
        <>
          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              className="row g-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((p, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                  <motion.div
                    className="solid-card p-3 h-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <img src={p.image} alt={p.name} className="img-fluid rounded mb-2" style={{ height: "140px", objectFit: "cover", width: "100%" }} />
                    <h6 className="fw-semibold mb-1" style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h6>
                    <p className="text-gradient fw-bold mb-2" style={{ fontSize: "0.9rem" }}>₹{p.price}</p>
                    <motion.button
                      className="btn-danger-soft btn-sm w-100"
                      onClick={() => deleteProduct(p._id)}
                      whileTap={{ scale: 0.95 }}
                      style={{ borderRadius: "8px", fontSize: "0.8rem", padding: "6px" }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </motion.button>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              className="solid-card overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="table-responsive">
                <table className="tm-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Admin</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-semibold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          {u.isAdmin ? (
                            <span style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>Admin</span>
                          ) : (
                            <span style={{ background: "rgba(107,114,128,0.1)", color: "var(--text-muted)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>User</span>
                          )}
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
              className="solid-card overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="table-responsive">
                <table className="tm-table">
                  <thead>
                    <tr><th>Order ID</th><th>User</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{o._id.slice(-8)}</td>
                        <td className="fw-semibold">{o.user?.name}</td>
                        <td className="text-gradient fw-bold">₹{o.totalPrice}</td>
                        <td>
                          {o.isPaid ? (
                            <span style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>
                              {new Date(o.paidAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>No</span>
                          )}
                        </td>
                        <td>
                          {o.isDelivered ? (
                            <span style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>
                              {new Date(o.deliveredAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>Pending</span>
                          )}
                        </td>
                        <td>
                          {!o.isDelivered && (
                            <motion.button
                              className="btn-gradient-success"
                              onClick={() => markDelivered(o._id)}
                              whileTap={{ scale: 0.95 }}
                              style={{ fontSize: "0.75rem", padding: "5px 12px" }}
                            >
                              Deliver
                            </motion.button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
