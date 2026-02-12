import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setAuthToken(data.token);
      toast.success(`Welcome back, ${data.name || "User"}!`);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>👋</div>
          <h3 className="text-gradient mb-1">Welcome Back</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sign in to your account</p>
        </div>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="tm-label">Email address</label>
            <div className="position-relative">
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ borderRadius: "var(--radius-sm)", paddingLeft: "40px" }}
              />
              <i className="bi bi-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
            </div>
          </div>

          <div className="mb-4">
            <label className="tm-label">Password</label>
            <div className="position-relative">
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ borderRadius: "var(--radius-sm)", paddingLeft: "40px" }}
              />
              <i className="bi bi-lock" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-gradient w-100"
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            style={{ padding: "12px" }}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            New customer?{" "}
            <Link to={`/register?redirect=${redirect}`} style={{ fontWeight: 600 }}>Create an account</Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
