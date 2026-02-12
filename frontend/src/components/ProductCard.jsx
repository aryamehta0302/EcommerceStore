import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      className="product-card h-100"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        {/* Image */}
        <div className="card-img-wrap">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
          />
          <div className="card-img-overlay-btn">
            <span
              className="btn btn-sm w-100"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#111",
                fontWeight: 700,
                borderRadius: "50px",
                fontSize: "0.8rem",
                padding: "8px 16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              View Details →
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          <div className="product-name">{product.name}</div>
          <div className="product-brand">{product.brand}</div>

          <div className="d-flex justify-content-between align-items-center mt-1">
            <span className="product-price">₹{product.price}</span>
            <div className="d-flex align-items-center gap-1">
              <span className="product-rating">
                {"★".repeat(Math.round(product.rating || 0))}
                {"☆".repeat(5 - Math.round(product.rating || 0))}
              </span>
              <small style={{ color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 500 }}>
                ({product.numReviews || 0})
              </small>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
