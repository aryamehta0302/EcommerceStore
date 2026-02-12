import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item._id === id ? { ...item, qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.info("Item removed from cart");
  };

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0).toFixed(2);
  const itemCount = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-center mb-4" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
        <span className="text-gradient">Shopping Cart</span>
      </h2>

      {cart.length === 0 ? (
        <motion.div
          className="text-center py-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🛒</div>
          <h5 className="fw-bold" style={{ color: "var(--text-secondary)" }}>Your cart is empty</h5>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Looks like you haven't added anything yet.</p>
          <button className="btn-gradient" onClick={() => navigate("/")}>
            <i className="bi bi-arrow-left me-2"></i>Continue Shopping
          </button>
        </motion.div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-12 col-lg-8">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  className="cart-item mb-3"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="row g-0 align-items-center">
                    <div className="col-3 col-md-2 text-center">
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="rounded"
                        style={{ height: "80px", width: "80px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                    <div className="col-9 col-md-10">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center ps-2">
                        <div>
                          <h6 className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>{item.name}</h6>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "4px" }}>{item.brand}</p>
                          <span className="text-gradient" style={{ fontWeight: 700 }}>₹{item.price.toFixed(2)}</span>
                        </div>

                        <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
                          <div className="d-flex align-items-center" style={{ border: "1px solid var(--border)", borderRadius: "50px", overflow: "hidden" }}>
                            <button
                              className="btn btn-sm px-3"
                              style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "1rem" }}
                              onClick={() => updateQty(item._id, item.qty - 1)}
                            >
                              −
                            </button>
                            <span style={{ padding: "0 12px", fontWeight: 600, fontSize: "0.9rem", minWidth: "30px", textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <button
                              className="btn btn-sm px-3"
                              style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "1rem" }}
                              onClick={() => updateQty(item._id, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <motion.button
                            className="btn-danger-soft btn-sm px-3 py-1"
                            onClick={() => removeItem(item._id)}
                            whileTap={{ scale: 0.9 }}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-trash"></i>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-4">
            <motion.div
              className="order-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Order Summary</h5>

              <div className="d-flex justify-content-between mb-2" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <span>Items ({itemCount})</span>
                <span>₹{total}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                <span>Shipping</span>
                <span style={{ color: "var(--success)", fontWeight: 600 }}>Free</span>
              </div>

              <hr style={{ borderColor: "var(--border)" }} />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-gradient" style={{ fontSize: "1.2rem" }}>₹{total}</strong>
              </div>

              <motion.button
                className="btn-gradient w-100"
                onClick={() => navigate("/checkout")}
                whileTap={{ scale: 0.96 }}
                style={{ padding: "12px" }}
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
