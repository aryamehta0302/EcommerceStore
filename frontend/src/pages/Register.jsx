import { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // Password strength
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: score, label: "Weak", color: "var(--danger)" };
    if (score <= 3) return { level: score, label: "Medium", color: "var(--warning)" };
    return { level: score, label: "Strong", color: "var(--success)" };
  }, [password]);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/register", { name, email, phone, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setAuthToken(data.token);
      toast.success("Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <motion.div
        className="auth-card"
        style={{ maxWidth: "460px" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🚀</div>
          <h3 className="text-gradient mb-1">Create Account</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Join TrendMart today</p>
        </div>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="tm-label">Full Name</label>
            <div className="position-relative">
              <input
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{ borderRadius: "var(--radius-sm)", paddingLeft: "40px" }}
              />
              <i className="bi bi-person" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
            </div>
          </div>

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

          <div className="mb-3">
            <label className="tm-label">Phone number</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                style={{ borderRadius: "var(--radius-sm)", paddingLeft: "40px" }}
              />
              <i className="bi bi-telephone" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
            </div>
          </div>

          <div className="mb-3">
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
            {password && (
              <div className="mt-2">
                <div className="strength-bar">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${(strength.level / 5) * 100}%`,
                      background: strength.color,
                    }}
                  ></div>
                </div>
                <small style={{ color: strength.color, fontWeight: 600, fontSize: "0.75rem" }}>
                  {strength.label}
                </small>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="tm-label">Confirm password</label>
            <div className="position-relative">
              <input
                type="password"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ borderRadius: "var(--radius-sm)", paddingLeft: "40px" }}
              />
              <i className="bi bi-shield-lock" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to={`/login?redirect=${redirect}`} style={{ fontWeight: 600 }}>Sign in</Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
