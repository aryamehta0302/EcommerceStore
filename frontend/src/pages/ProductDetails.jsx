import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
    } catch {
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReview = async () => {
    if (!rating || !comment.trim()) return toast.error("Please add rating and comment");
    try {
      setSubmitting(true);
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c._id === product._id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedToCart(true);
    toast.success("Added to cart!");
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5"><div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-lg)" }}></div></div>
          <div className="col-md-7">
            <div className="skeleton skeleton-line" style={{ width: "70%", height: "28px", marginBottom: "16px" }}></div>
            <div className="skeleton skeleton-line" style={{ width: "40%", height: "18px", marginBottom: "12px" }}></div>
            <div className="skeleton skeleton-line" style={{ width: "30%", height: "22px", marginBottom: "20px" }}></div>
            <div className="skeleton skeleton-line" style={{ width: "100%", height: "60px" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center mt-5" style={{ color: "var(--danger)" }}>Product not found</p>;

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="row g-4 g-lg-5 align-items-start">
        {/* LEFT: Product Image */}
        <motion.div
          className="col-md-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="solid-card p-4 text-center"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "420px", objectFit: "contain", transition: "transform 0.3s ease" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </motion.div>

        {/* RIGHT: Product Info */}
        <motion.div
          className="col-md-7"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{product.name}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{product.brand}</p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span style={{ color: "var(--warning)", fontSize: "1rem", letterSpacing: "2px" }}>
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <h3 className="text-gradient" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, marginBottom: "16px" }}>
            ₹{product.price}
          </h3>

          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {product.description || "No description available."}
          </p>

          <motion.button
            className={addedToCart ? "btn-gradient-success" : "btn-gradient"}
            style={{ fontSize: "1rem", padding: "12px 30px" }}
            onClick={addToCart}
            whileTap={{ scale: 0.96 }}
          >
            {addedToCart ? (
              <><i className="bi bi-check-circle me-2"></i>Added!</>
            ) : (
              <><i className="bi bi-cart-plus me-2"></i>Add to Cart</>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* REVIEWS */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: "20px" }}>
          Customer Reviews
        </h4>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {product.reviews.map((r, i) => (
              <motion.div
                key={i}
                className="review-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), var(--accent))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: "0.75rem"
                    }}>
                      {r.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <strong style={{ fontSize: "0.9rem" }}>{r.name}</strong>
                  </div>
                  <span style={{ color: "var(--warning)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: "6px" }}>
                  {new Date(r.createdAt).toDateString()}
                </p>
                <p style={{ marginBottom: 0, color: "var(--text-secondary)" }}>{r.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>No reviews yet. Be the first to review!</p>
        )}
      </motion.div>

      {/* ADD REVIEW */}
      <motion.div
        className="glass-card p-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h5 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: "16px" }}>
          Write a Review
        </h5>
        <div className="mb-3">
          <label className="tm-label">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="form-select"
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            <option value="">Select rating</option>
            <option value="5">★★★★★ — Excellent</option>
            <option value="4">★★★★☆ — Good</option>
            <option value="3">★★★☆☆ — Average</option>
            <option value="2">★★☆☆☆ — Poor</option>
            <option value="1">★☆☆☆☆ — Terrible</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="tm-label">Comment</label>
          <textarea
            rows="3"
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            style={{ borderRadius: "var(--radius-sm)" }}
          ></textarea>
        </div>
        <motion.button
          className="btn-gradient-success"
          disabled={submitting}
          onClick={submitReview}
          whileTap={{ scale: 0.96 }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
