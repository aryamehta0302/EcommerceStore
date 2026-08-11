import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";
import { mergeGuestDataIntoUser } from "../utils/userStorage";

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
      mergeGuestDataIntoUser(data._id);
      window.dispatchEvent(new Event("auth:change"));
      toast.success(`Welcome back, ${data.name || "User"}!`);

      const hasExplicitRedirect = new URLSearchParams(location.search).get("redirect");
      if (data.isAdmin && !hasExplicitRedirect) {
        navigate("/admin");
      } else {
        navigate(redirect);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="auth-glow"
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="auth-head"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <span className="auth-eyebrow">The Maison</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to continue your collection</p>
        </motion.div>

        <form onSubmit={submit} className="auth-form">
          <motion.div className="auth-field" custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Email address</label>
            <input
              type="email"
              className="auth-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div className="auth-field" custom={1} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          New customer?{" "}
          <Link to={`/register?redirect=${redirect}`} className="auth-link">Create an account</Link>
        </motion.div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 78vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          border: 1px solid var(--tm-line);
          background: var(--tm-card, transparent);
          padding: 44px 38px 36px;
          overflow: hidden;
        }
        .auth-glow {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 160px;
          background: radial-gradient(closest-side, var(--tm-gold), transparent 70%);
          filter: blur(40px);
          opacity: 0.4;
          pointer-events: none;
        }

        .auth-head {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }
        .auth-eyebrow {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--tm-gold);
        }
        .auth-title {
          font-family: "Playfair Display", serif;
          font-size: 32px;
          margin: 12px 0 6px;
          letter-spacing: -0.01em;
          font-weight: 500;
          color: var(--tm-fg, inherit);
        }
        .auth-sub {
          font-size: 13px;
          color: var(--tm-muted);
        }

        .auth-form { position: relative; display: flex; flex-direction: column; gap: 20px; }

        .auth-field { display: flex; flex-direction: column; gap: 8px; }
        .auth-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--tm-muted);
        }
        .auth-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--tm-line);
          color: var(--tm-fg, inherit);
          font-size: 15px;
          padding: 8px 2px;
          outline: none;
          transition: border-color .3s ease;
          border-radius: 0;
        }
        .auth-input::placeholder { color: var(--tm-muted); opacity: 0.6; }
        .auth-input:focus { border-color: var(--tm-gold); box-shadow: none; }

        .auth-btn {
          margin-top: 8px;
          background: var(--tm-gold);
          border: 1px solid var(--tm-gold);
          color: #0b0b0c;
          padding: 13px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          border-radius: 0;
          transition: opacity .2s ease, transform .2s ease;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; }
        .auth-btn:disabled { opacity: 0.6; cursor: default; }

        .auth-btn-loading {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .auth-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(11,11,12,0.3);
          border-top-color: #0b0b0c;
          border-radius: 50%;
          animation: auth-spin 0.7s linear infinite;
        }
        @keyframes auth-spin { to { transform: rotate(360deg); } }

        .auth-footer {
          text-align: center;
          margin-top: 30px;
          font-size: 13px;
          color: var(--tm-muted);
          position: relative;
        }
        .auth-link {
          color: var(--tm-gold);
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid transparent;
          transition: border-color .2s ease;
        }
        .auth-link:hover { border-color: var(--tm-gold); }

        @media (max-width: 480px) {
          .auth-card { padding: 34px 24px 28px; }
          .auth-title { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}