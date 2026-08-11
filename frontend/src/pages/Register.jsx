import { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";
import { mergeGuestDataIntoUser } from "../utils/userStorage";

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

  const strength = useMemo(() => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: score, label: "Weak", color: "#b3261e" };
    if (score <= 3) return { level: score, label: "Medium", color: "#b8860b" };
    return { level: score, label: "Strong", color: "var(--tm-gold)" };
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
      mergeGuestDataIntoUser(data._id);
      toast.success("Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.12 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join TrendMart and begin curating</p>
        </motion.div>

        <form onSubmit={submit} className="auth-form">
          <motion.div className="auth-field" custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </motion.div>

          <motion.div className="auth-field" custom={1} variants={fieldVariants} initial="hidden" animate="visible">
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

          <motion.div className="auth-field" custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Phone number</label>
            <input
              type="text"
              className="auth-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </motion.div>

          <motion.div className="auth-field" custom={3} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="strength-wrap"
              >
                <div className="strength-bar">
                  <motion.div
                    className="strength-bar-fill"
                    animate={{ width: `${(strength.level / 5) * 100}%`, background: strength.color }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </motion.div>
            )}
          </motion.div>

          <motion.div className="auth-field" custom={4} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              className="auth-input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            custom={5}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner" />
                Creating account…
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          Already have an account?{" "}
          <Link to={`/login?redirect=${redirect}`} className="auth-link">Sign in</Link>
        </motion.div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 82vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 460px;
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
          margin-bottom: 28px;
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
          font-size: 30px;
          margin: 12px 0 6px;
          letter-spacing: -0.01em;
          font-weight: 500;
        }
        .auth-sub {
          font-size: 13px;
          color: var(--tm-muted);
        }

        .auth-form { position: relative; display: flex; flex-direction: column; gap: 18px; }

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
        }
        .auth-input::placeholder { color: var(--tm-muted); opacity: 0.6; }
        .auth-input:focus { border-color: var(--tm-gold); }

        .strength-wrap { margin-top: 8px; overflow: hidden; }
        .strength-bar {
          height: 2px;
          background: var(--tm-line);
          overflow: hidden;
          margin-bottom: 6px;
        }
        .strength-bar-fill { height: 100%; }
        .strength-label {
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .auth-btn {
          margin-top: 6px;
          background: var(--tm-gold);
          border: 1px solid var(--tm-gold);
          color: #0b0b0c;
          padding: 13px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
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
          margin-top: 28px;
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
          .auth-title { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}