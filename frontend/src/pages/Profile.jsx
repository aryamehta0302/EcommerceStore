import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({
    name: "", phone: "", password: "", confirmPassword: "",
  });

  const [addresses, setAddresses] = useState([
    { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" },
  ]);

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([...addresses, { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" }]);
  };

  const removeAddress = (i) => {
    setAddresses(addresses.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) { window.location.href = "/login?redirect=/profile"; return; }
    setAuthToken(userInfo.token);
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setUser(data);
        setForm({ name: data.name, phone: data.phone || "", password: "", confirmPassword: "" });
        setAddresses(data.addresses?.length ? data.addresses : addresses);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await api.put("/api/users/profile", {
        name: form.name, phone: form.phone, password: form.password || undefined, addresses,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setAuthToken(data.token);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="tm-loader"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="container my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", fontSize: "1.3rem", color: "#fff", fontWeight: 700
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            {user?.name || "User"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <div className="tm-tab-pills">
            <button className={`tm-tab-pill ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
              <i className="bi bi-person me-1"></i> Profile
            </button>
            <button className={`tm-tab-pill ${activeTab === "addresses" ? "active" : ""}`} onClick={() => setActiveTab("addresses")}>
              <i className="bi bi-geo-alt me-1"></i> Addresses
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              className="glass-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="tm-label">Full Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="tm-label">Phone</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="tm-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="tm-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <motion.button type="submit" className="btn-gradient" whileTap={{ scale: 0.96 }}>
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {addresses.map((addr, i) => (
                  <motion.div
                    key={i}
                    className="glass-card p-4 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 fw-bold" style={{ fontSize: "0.9rem" }}>
                        <i className="bi bi-geo-alt me-1 text-gradient"></i>Address #{i + 1}
                      </h6>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          className="btn-danger-soft btn-sm px-3 py-1"
                          onClick={() => removeAddress(i)}
                          style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                        >
                          <i className="bi bi-trash me-1"></i>Remove
                        </button>
                      )}
                    </div>

                    <div className="row g-2">
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Full Name" value={addr.fullName} onChange={(e) => handleAddressChange(i, "fullName", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Phone" value={addr.phone} onChange={(e) => handleAddressChange(i, "phone", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-12">
                        <input className="form-control" placeholder="Address Line 1" value={addr.addressLine1} onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-12">
                        <input className="form-control" placeholder="Address Line 2" value={addr.addressLine2} onChange={(e) => handleAddressChange(i, "addressLine2", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" placeholder="City" value={addr.city} onChange={(e) => handleAddressChange(i, "city", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" placeholder="State" value={addr.state} onChange={(e) => handleAddressChange(i, "state", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" placeholder="Pincode" value={addr.postalCode} onChange={(e) => handleAddressChange(i, "postalCode", e.target.value)} style={{ borderRadius: "var(--radius-sm)" }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="d-flex gap-3 justify-content-center mt-3">
                <button type="button" className="btn-ghost" onClick={addAddress}>
                  <i className="bi bi-plus-lg me-1"></i>Add Address
                </button>
                <motion.button type="submit" className="btn-gradient" whileTap={{ scale: 0.96 }}>
                  Save All Changes
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
