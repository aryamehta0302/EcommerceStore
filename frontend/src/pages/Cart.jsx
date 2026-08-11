import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { readCart, writeCart } from "../utils/userStorage";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(readCart());
    const sync = () => setCart(readCart());
    window.addEventListener("cart:change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("auth:change", sync);
    return () => {
      window.removeEventListener("cart:change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, []);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item._id === id ? { ...item, qty } : item
    );
    setCart(updated);
    writeCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    writeCart(updated);
    toast.info("Item removed from cart");
  };

  const goToCheckout = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.info("Please sign in to place an order");
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0).toFixed(2);
  const itemCount = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <motion.div
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        {cart.length > 0 && (
          <span className="cart-header-count">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <motion.div
          className="cart-empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <svg className="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
          <p className="cart-empty-title">Your cart is empty</p>
          <p className="cart-empty-sub">Looks like you haven't added anything yet.</p>
          <button className="cart-btn-outline" onClick={() => navigate("/")}>
            ← Continue Shopping
          </button>
        </motion.div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item._id}-${item.size || "default"}`}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-info">
                    <h6 className="cart-item-name">{item.name}</h6>
                    <p className="cart-item-brand">
                      {item.brand}
                      {item.size && <span className="cart-item-size"> · Size {item.size}</span>}
                    </p>
                    <span className="cart-item-price">₹{item.price.toFixed(2)}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <motion.button
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove item"
                    >
                      <i className="bi bi-trash"></i>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className="order-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h5 className="summary-title">Order Summary</h5>

            <div className="summary-row">
              <span>Items ({itemCount})</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-free">Complimentary</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <strong>Total</strong>
              <strong>₹{total}</strong>
            </div>

            <motion.button
              className="cart-btn-solid"
              onClick={goToCheckout}
              whileTap={{ scale: 0.97 }}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}

      <style>{`
        .cart-page { max-width: 1200px; margin: 0 auto; padding: 32px 24px 96px; }

        .cart-header {
          display: flex; align-items: baseline; justify-content: center; gap: 12px;
          padding-bottom: 18px; border-bottom: 1px solid var(--tm-line); margin-bottom: 40px;
        }
        .cart-title {
          font-family: "Playfair Display", serif; font-size: 26px;
          letter-spacing: -0.01em; margin: 0; color: var(--tm-fg, inherit);
        }
        .cart-header-count { font-size: 12px; letter-spacing: 0.05em; color: var(--tm-muted); }

        .cart-empty {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 90px 20px; color: var(--tm-muted);
        }
        .cart-empty-icon { width: 40px; height: 40px; margin-bottom: 20px; color: var(--tm-gold); opacity: 0.7; }
        .cart-empty-title { font-family: "Playfair Display", serif; font-size: 20px; color: var(--tm-fg, inherit); margin: 0 0 6px; }
        .cart-empty-sub { font-size: 13px; margin-bottom: 26px; }

        .cart-btn-outline {
          background: transparent; border: 1px solid var(--tm-gold); color: var(--tm-gold);
          padding: 11px 26px; font-size: 10.5px; letter-spacing: 0.24em; text-transform: uppercase;
          cursor: pointer; transition: background .25s ease, color .25s ease;
        }
        .cart-btn-outline:hover { background: var(--tm-gold); color: #0b0b0c; }

        .cart-btn-solid {
          width: 100%; background: var(--tm-gold); border: 1px solid var(--tm-gold); color: #0b0b0c;
          padding: 13px; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
          cursor: pointer; transition: opacity .2s ease;
        }
        .cart-btn-solid:hover { opacity: 0.85; }

        .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 28px; align-items: start; }

        .cart-item {
          display: flex; align-items: center; gap: 16px; padding: 14px;
          margin-bottom: 12px; border: 1px solid var(--tm-line);
        }
        .cart-item-img { height: 68px; width: 68px; flex-shrink: 0; object-fit: cover; border-radius: 2px; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-family: "Playfair Display", serif; font-size: 15px; margin: 0 0 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cart-item-brand {
          color: var(--tm-muted); font-size: 11px; letter-spacing: 0.05em;
          text-transform: uppercase; margin: 0 0 4px;
        }
        .cart-item-size { color: var(--tm-gold); font-weight: 600; }
        .cart-item-price { font-size: 14px; font-weight: 600; color: var(--tm-gold); }

        .cart-item-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .qty-control { display: flex; align-items: center; border: 1px solid var(--tm-line); }
        .qty-btn {
          border: none; background: transparent; font-weight: 600; font-size: 14px;
          padding: 5px 13px; cursor: pointer; line-height: 1; color: inherit;
        }
        .qty-value { min-width: 24px; text-align: center; font-size: 13px; }
        .remove-btn {
          border: 1px solid var(--tm-line); background: transparent; color: var(--tm-muted);
          padding: 7px 11px; cursor: pointer; transition: border-color .2s ease, color .2s ease;
        }
        .remove-btn:hover { border-color: #b3261e; color: #b3261e; }

        .order-summary { border: 1px solid var(--tm-line); padding: 24px; position: sticky; top: 90px; }
        .summary-title { font-family: "Playfair Display", serif; font-size: 17px; margin: 0 0 18px; }
        .summary-row {
          display: flex; justify-content: space-between; font-size: 13px;
          color: var(--tm-muted); margin-bottom: 10px;
        }
        .summary-free { color: var(--tm-gold); font-weight: 600; }
        .summary-divider { height: 1px; background: var(--tm-line); margin: 14px 0; }
        .summary-total { font-size: 15px; color: var(--tm-fg, inherit); margin-bottom: 22px; }

        @media (max-width: 860px) {
          .cart-layout { grid-template-columns: 1fr; }
          .order-summary { position: static; }
        }
        @media (max-width: 480px) {
          .cart-page { padding: 24px 16px 72px; }
          .cart-item { flex-wrap: wrap; }
          .cart-item-actions { width: 100%; justify-content: space-between; margin-top: 10px; }
        }
      `}</style>
    </motion.div>
  );
}