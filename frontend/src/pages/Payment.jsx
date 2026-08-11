import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../api";
import { readCart, writeCart } from "../utils/userStorage";

const METHODS = [
  { id: "upi", label: "UPI / Cards", desc: "Razorpay Secure Checkout" },
  { id: "cod", label: "Cash on Delivery", desc: "Pay at doorstep" },
];

const RAZORPAY_KEY_ID = "rzp_test_THm65My3EIBaQd"; // public key — safe on frontend

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("upi");
  const [confirmed, setConfirmed] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const cart = readCart();
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "null");

  useEffect(() => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      navigate("/cart");
    } else if (!shippingAddress) {
      toast.error("Please add a shipping address first");
      navigate("/checkout");
    }
  }, []);

  const itemsPrice = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingPrice = 0;
  const taxPrice = +(itemsPrice * 0.05).toFixed(2);
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const orderItems = cart.map((item) => ({
    product: item._id,
    name: item.name,
    qty: item.qty,
    price: item.price,
    image: item.image,
    size: item.size,
  }));

  const orderData = {
    orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };

  // Cash on Delivery — creates the order directly, no payment gateway needed
  const handleCOD = async () => {
    try {
      setPlacing(true);
      const { data } = await api.post("/api/orders", {
        ...orderData,
        paymentMethod: "Cash on Delivery",
      });
      writeCart([]);
      localStorage.removeItem("shippingAddress");
      setPlacedOrder(data);
      setConfirmed(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Razorpay — creates a Razorpay order, opens checkout modal, verifies on success
  const handleRazorpay = async () => {
    try {
      setPlacing(true);

      const { data: razorpayOrder } = await api.post("/api/payment/razorpay/order", {
        amount: totalPrice,
      });

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "TrendMart",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const { data } = await api.post("/api/payment/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData,
            });

            writeCart([]);
            localStorage.removeItem("shippingAddress");
            setPlacedOrder(data);
            setConfirmed(true);
            toast.success("Payment successful! Order placed.");
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            toast.info("Payment cancelled");
          },
        },
        prefill: {
          name: shippingAddress?.fullName || "",
          contact: shippingAddress?.phone || "",
        },
        theme: { color: "#d4af37" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start payment");
      setPlacing(false);
    }
  };

  const handlePayment = () => {
    if (method === "cod") handleCOD();
    else handleRazorpay();
  };

  return (
    <motion.div
      className="pay-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="pay-steps">
        <div className="pay-step done">
          <div className="pay-step-number">✓</div>
          <span>Shipping</span>
        </div>
        <div className="pay-step-line done" />
        <div className={`pay-step ${confirmed ? "done" : "active"}`}>
          <div className="pay-step-number">{confirmed ? "✓" : "2"}</div>
          <span>Payment</span>
        </div>
        <div className="pay-step-line" />
        <div className={`pay-step ${confirmed ? "done" : ""}`}>
          <div className="pay-step-number">{confirmed ? "✓" : "3"}</div>
          <span>Complete</span>
        </div>
      </div>

      <div className="pay-center">
        <motion.div
          className="pay-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {!confirmed && (
            <>
              <h1 className="pay-title">Choose Payment Method</h1>
              <p className="pay-total">
                Total: <strong>₹{totalPrice.toFixed(2)}</strong>
              </p>

              <div className="pay-methods">
                {METHODS.map((m) => (
                  <motion.button
                    key={m.id}
                    type="button"
                    className={`pay-method-btn ${method === m.id ? "selected" : ""}`}
                    onClick={() => setMethod(m.id)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="pay-method-label">{m.label}</div>
                    <div className="pay-method-desc">{m.desc}</div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {method === "upi" && (
                  <motion.p
                    className="pay-gateway-note"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    You'll be redirected to Razorpay's secure checkout to complete payment via UPI, card, netbanking, or wallet.
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                className="pay-confirm-btn"
                onClick={handlePayment}
                disabled={placing}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
              >
                {placing ? (
                  <span className="pay-btn-loading">
                    <span className="pay-spinner" />
                    {method === "cod" ? "Placing order…" : "Opening payment…"}
                  </span>
                ) : method === "cod" ? (
                  "Place Order"
                ) : (
                  "Pay with Razorpay"
                )}
              </motion.button>
            </>
          )}

          <AnimatePresence>
            {confirmed && placedOrder && (
              <motion.div
                className="pay-success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="pay-success-icon">✓</div>
                <h2 className="pay-success-title">Order Placed Successfully</h2>
                <p className="pay-success-sub">
                  Expected delivery: <strong>{new Date(placedOrder.estimatedDelivery).toDateString()}</strong>
                </p>
                <span className="pay-success-id">Order ID: {placedOrder._id}</span>

                <div className="pay-success-actions">
                  <button className="pay-success-btn-solid" onClick={() => navigate(`/orders/${placedOrder._id}`)}>
                    View Order
                  </button>
                  <button className="pay-success-btn-outline" onClick={() => navigate("/orders")}>
                    Order History
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .pay-page { max-width: 700px; margin: 0 auto; padding: 40px 24px 96px; }

        .pay-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 44px;
        }
        .pay-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--tm-muted);
        }
        .pay-step-number {
          width: 26px; height: 26px; border-radius: 50%;
          border: 1px solid var(--tm-line);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: var(--tm-muted);
        }
        .pay-step.active .pay-step-number, .pay-step.done .pay-step-number {
          background: var(--tm-gold); border-color: var(--tm-gold); color: #0b0b0c;
        }
        .pay-step.active span, .pay-step.done span { color: var(--tm-gold); font-weight: 600; }
        .pay-step-line { width: 40px; height: 1px; background: var(--tm-line); }
        .pay-step-line.done { background: var(--tm-gold); }

        .pay-center { display: flex; justify-content: center; }
        .pay-card {
          width: 100%; max-width: 520px;
          border: 1px solid var(--tm-line);
          padding: 36px;
        }
        .pay-title {
          font-family: "Playfair Display", serif;
          font-size: 22px; font-weight: 500;
          margin: 0 0 8px;
        }
        .pay-total {
          font-size: 13px; color: var(--tm-muted); margin-bottom: 26px;
        }
        .pay-total strong { color: var(--tm-gold); font-size: 16px; }

        .pay-methods {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 18px;
        }
        .pay-method-btn {
          border: 1px solid var(--tm-line);
          background: transparent;
          padding: 16px 10px;
          text-align: center;
          cursor: pointer;
          transition: border-color .2s ease, background .2s ease;
        }
        .pay-method-btn:hover { border-color: var(--tm-gold); }
        .pay-method-btn.selected { background: var(--tm-gold); border-color: var(--tm-gold); }
        .pay-method-label {
          font-size: 12.5px; font-weight: 600; color: var(--tm-fg, inherit); margin-bottom: 3px;
        }
        .pay-method-btn.selected .pay-method-label { color: #0b0b0c; }
        .pay-method-desc { font-size: 10.5px; color: var(--tm-muted); }
        .pay-method-btn.selected .pay-method-desc { color: rgba(11,11,12,0.7); }

        .pay-gateway-note {
          font-size: 12px; color: var(--tm-muted); margin: 0 0 20px;
          overflow: hidden; line-height: 1.6;
        }

        .pay-confirm-btn {
          width: 100%;
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
        .pay-confirm-btn:hover:not(:disabled) { opacity: 0.88; }
        .pay-confirm-btn:disabled { opacity: 0.6; cursor: default; }

        .pay-btn-loading { display: inline-flex; align-items: center; justify-content: center; gap: 10px; }
        .pay-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(11,11,12,0.3);
          border-top-color: #0b0b0c;
          border-radius: 50%;
          animation: pay-spin 0.7s linear infinite;
        }
        @keyframes pay-spin { to { transform: rotate(360deg); } }

        .pay-success { text-align: center; padding: 12px 0; }
        .pay-success-icon {
          width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid var(--tm-gold); color: var(--tm-gold);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin: 0 auto 18px;
        }
        .pay-success-title {
          font-family: "Playfair Display", serif;
          font-size: 22px; font-weight: 500;
          margin: 0 0 10px;
        }
        .pay-success-sub { font-size: 13px; color: var(--tm-muted); margin: 0 0 6px; }
        .pay-success-id { font-size: 11.5px; color: var(--tm-muted); }

        .pay-success-actions { display: flex; gap: 12px; justify-content: center; margin-top: 28px; }
        .pay-success-btn-solid, .pay-success-btn-outline {
          padding: 11px 22px;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity .2s ease, background .2s ease, color .2s ease;
        }
        .pay-success-btn-solid {
          background: var(--tm-gold); border: 1px solid var(--tm-gold); color: #0b0b0c;
        }
        .pay-success-btn-solid:hover { opacity: 0.88; }
        .pay-success-btn-outline {
          background: transparent; border: 1px solid var(--tm-line); color: var(--tm-muted);
        }
        .pay-success-btn-outline:hover { border-color: var(--tm-gold); color: var(--tm-gold); }

        @media (max-width: 480px) {
          .pay-card { padding: 26px; }
          .pay-step span { display: none; }
          .pay-success-actions { flex-direction: column; }
        }
      `}</style>
    </motion.div>
  );
}