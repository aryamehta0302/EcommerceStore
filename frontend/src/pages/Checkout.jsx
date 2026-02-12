import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Checkout() {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Steps */}
      <div className="tm-steps">
        <div className="tm-step active">
          <div className="tm-step-number">1</div>
          <span className="d-none d-sm-inline">Shipping</span>
        </div>
        <div className="tm-step-line"></div>
        <div className="tm-step">
          <div className="tm-step-number">2</div>
          <span className="d-none d-sm-inline">Payment</span>
        </div>
        <div className="tm-step-line"></div>
        <div className="tm-step">
          <div className="tm-step-number">3</div>
          <span className="d-none d-sm-inline">Complete</span>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <motion.div
          className="glass-card p-4 w-100"
          style={{ maxWidth: "560px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="mb-4" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            <i className="bi bi-geo-alt me-2 text-gradient"></i>Shipping Address
          </h4>

          <form onSubmit={handleNext}>
            <div className="mb-3">
              <label className="tm-label">Street Address</label>
              <textarea
                className="form-control"
                required
                rows="2"
                placeholder="Enter your full address"
                style={{ borderRadius: "var(--radius-sm)" }}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="tm-label">City</label>
                <input
                  className="form-control"
                  required
                  placeholder="Enter city"
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="col-md-6">
                <label className="tm-label">PIN Code</label>
                <input
                  className="form-control"
                  required
                  placeholder="6-digit PIN code"
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-gradient w-100"
              whileTap={{ scale: 0.96 }}
              style={{ padding: "12px", marginTop: "8px" }}
            >
              Continue to Payment <i className="bi bi-arrow-right ms-2"></i>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
