import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../api";
import { readCart } from "../utils/userStorage";

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.info("Please sign in to place an order");
      navigate("/login?redirect=/checkout");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setForm((f) => ({
          ...f,
          fullName: data.name || "",
          phone: data.phone || "",
        }));
      } catch {
        // fall back to cached userInfo if the profile fetch fails
        try {
          const parsed = JSON.parse(userInfo);
          setForm((f) => ({
            ...f,
            fullName: parsed.name || "",
            phone: parsed.phone || "",
          }));
        } catch {
          // ignore malformed data
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const cart = readCart();
    if (!cart.length) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    localStorage.setItem("shippingAddress", JSON.stringify(form));
    navigate("/payment");
  };

  return (
    <motion.div
      className="co-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="co-steps">
        <div className="co-step active">
          <div className="co-step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step">
          <div className="co-step-number">2</div>
          <span>Payment</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step">
          <div className="co-step-number">3</div>
          <span>Complete</span>
        </div>
      </div>

      <div className="co-center">
        <motion.div
          className="co-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="co-title">Shipping Address</h1>

          <form onSubmit={handleNext} className="co-form">
            <div className="co-row">
              <div className="co-field">
                <label className="co-label">Full Name</label>
                <input
                  className="co-input"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={onChange}
                  placeholder={loadingProfile ? "Loading…" : "Your full name"}
                />
              </div>
              <div className="co-field">
                <label className="co-label">Phone</label>
                <input
                  className="co-input"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={onChange}
                  placeholder={loadingProfile ? "Loading…" : "10-digit mobile number"}
                />
              </div>
            </div>

            <div className="co-field">
              <label className="co-label">Address Line 1</label>
              <textarea
                className="co-input co-textarea"
                name="addressLine1"
                required
                rows="2"
                value={form.addressLine1}
                onChange={onChange}
                placeholder="House no., street, area"
              />
            </div>

            <div className="co-field">
              <label className="co-label">Address Line 2 (optional)</label>
              <input
                className="co-input"
                name="addressLine2"
                value={form.addressLine2}
                onChange={onChange}
                placeholder="Landmark, apartment, etc."
              />
            </div>

            <div className="co-row co-row-3">
              <div className="co-field">
                <label className="co-label">City</label>
                <input
                  className="co-input"
                  name="city"
                  required
                  value={form.city}
                  onChange={onChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="co-field">
                <label className="co-label">State</label>
                <input
                  className="co-input"
                  name="state"
                  required
                  value={form.state}
                  onChange={onChange}
                  placeholder="Enter state"
                />
              </div>
              <div className="co-field">
                <label className="co-label">PIN Code</label>
                <input
                  className="co-input"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={onChange}
                  placeholder="6-digit PIN code"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="co-submit-btn"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
            >
              Continue to Payment →
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .co-page { max-width: 700px; margin: 0 auto; padding: 40px 24px 96px; }

        .co-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 44px;
        }
        .co-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--tm-muted);
        }
        .co-step-number {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1px solid var(--tm-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: var(--tm-muted);
        }
        .co-step.active .co-step-number {
          background: var(--tm-gold); border-color: var(--tm-gold); color: #0b0b0c;
        }
        .co-step.active span { color: var(--tm-gold); font-weight: 600; }
        .co-step-line { width: 40px; height: 1px; background: var(--tm-line); }

        .co-center { display: flex; justify-content: center; }
        .co-card {
          width: 100%;
          border: 1px solid var(--tm-line);
          padding: 36px;
        }
        .co-title {
          font-family: "Playfair Display", serif;
          font-size: 24px; font-weight: 500;
          margin: 0 0 28px;
        }

        .co-form { display: flex; flex-direction: column; gap: 20px; }
        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .co-row-3 { grid-template-columns: 1fr 1fr 1fr; }

        .co-field { display: flex; flex-direction: column; gap: 8px; }
        .co-label {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--tm-muted);
        }
        .co-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--tm-line);
          color: var(--tm-fg, inherit);
          font-size: 14.5px;
          padding: 8px 2px;
          outline: none;
          font-family: inherit;
          transition: border-color .3s ease;
        }
        .co-input::placeholder { color: var(--tm-muted); opacity: 0.6; }
        .co-input:focus { border-color: var(--tm-gold); }
        .co-textarea { resize: vertical; }

        .co-submit-btn {
          margin-top: 8px;
          background: var(--tm-gold);
          border: 1px solid var(--tm-gold);
          color: #0b0b0c;
          padding: 14px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .2s ease;
        }
        .co-submit-btn:hover { opacity: 0.88; }

        @media (max-width: 640px) {
          .co-row, .co-row-3 { grid-template-columns: 1fr; }
          .co-card { padding: 26px; }
          .co-step span { display: none; }
        }
      `}</style>
    </motion.div>
  );
}