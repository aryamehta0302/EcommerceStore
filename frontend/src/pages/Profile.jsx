import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "", phone: "", password: "", confirmPassword: "",
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) { window.location.href = "/login?redirect=/profile"; return; }
    setAuthToken(userInfo.token);
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setUser(data);
        setForm({ name: data.name, phone: data.phone || "", password: "", confirmPassword: "" });
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
        name: form.name, phone: form.phone, password: form.password || undefined,
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
      <div className="tm-profile-loading">
        <div className="tm-loader"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="tm-profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tm-profile-wrap">
        {/* Header */}
        <div className="tm-profile-head">
          <div className="tm-profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h1 className="tm-profile-name">{user?.name || "User"}</h1>
          <p className="tm-profile-email">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="tm-profile-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tm-profile-grid">
              <div className="tm-field">
                <label className="tm-label">Full Name</label>
                <input
                  className="tm-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="tm-field">
                <label className="tm-label">Phone</label>
                <input
                  className="tm-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="tm-field">
                <label className="tm-label">New Password</label>
                <input
                  type="password"
                  className="tm-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="tm-field">
                <label className="tm-label">Confirm Password</label>
                <input
                  type="password"
                  className="tm-input"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="tm-profile-actions">
              <motion.button type="submit" className="tm-save-btn" whileTap={{ scale: 0.97 }}>
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>

      <style>{`
        .tm-profile-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }
        .tm-loader {
          width: 28px;
          height: 28px;
          border: 2px solid var(--tm-line);
          border-top-color: var(--tm-gold);
          border-radius: 50%;
          animation: tm-spin 0.8s linear infinite;
        }
        @keyframes tm-spin { to { transform: rotate(360deg); } }

        .tm-profile-page { max-width: 1400px; margin: 0 auto; padding: 56px 24px 96px; }
        .tm-profile-wrap { max-width: 560px; margin: 0 auto; }

        .tm-profile-head {
          text-align: center;
          margin-bottom: 36px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--tm-line);
        }
        .tm-profile-avatar {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 50%;
          border: 1px solid var(--tm-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Playfair Display", serif;
          font-size: 22px;
          color: var(--tm-gold);
        }
        .tm-profile-name {
          font-family: "Playfair Display", serif;
          font-size: clamp(24px, 3.5vw, 32px);
          margin: 0 0 6px;
        }
        .tm-profile-email {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--tm-muted);
          margin: 0;
        }

        .tm-profile-card {
          border: 1px solid var(--tm-line);
          padding: 32px;
        }

        .tm-profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .tm-field { display: flex; flex-direction: column; gap: 8px; }
        .tm-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--tm-muted);
        }
        .tm-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--tm-line);
          padding: 8px 2px;
          font-size: 14px;
          color: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .tm-input:focus { border-color: var(--tm-gold); }
        .tm-input::placeholder { color: var(--tm-muted); }

        .tm-profile-actions {
          text-align: center;
          margin-top: 32px;
        }
        .tm-save-btn {
          background: var(--tm-gold);
          border: 1px solid var(--tm-gold);
          color: #0b0b0c;
          padding: 13px 36px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .tm-save-btn:hover { opacity: 0.85; }

        @media (max-width: 560px) {
          .tm-profile-grid { grid-template-columns: 1fr; }
          .tm-profile-card { padding: 24px; }
        }
      `}</style>
    </motion.div>
  );
}