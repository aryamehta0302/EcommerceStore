import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      fetchProduct(); // reload reviews
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
    toast.success("Added to cart!");
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center text-danger mt-5">Product not found</p>;

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-start">
        {/* LEFT: Product Image */}
        <div className="col-md-5 text-center">
          <div className="p-3 rounded shadow-sm bg-white dark:bg-dark">
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "420px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="col-md-7">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.brand}</p>
          <div className="d-flex align-items-center mb-2">
            <div className="text-warning me-2">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </div>
            <span className="text-muted small">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <h4 className="text-primary fw-semibold mb-3">₹{product.price}</h4>

          <p className="mb-3">
            {product.description || "No description available."}
          </p>

          <button className="btn btn-primary btn-lg px-4" onClick={addToCart}>
            <i className="bi bi-cart-plus me-2"></i>Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-5">
        <h4 className="fw-bold mb-3">Customer Reviews</h4>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((r, i) => (
            <div
              key={i}
              className="border-bottom pb-3 mb-3"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <strong>{r.name}</strong>
                <span className="text-warning">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className="mb-1 small text-muted">{new Date(r.createdAt).toDateString()}</p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>

      {/* ADD REVIEW */}
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Write a Review</h5>
          <div className="mb-3">
            <label className="form-label fw-semibold">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="form-select"
            >
              <option value="">Select rating</option>
              <option value="5">★★★★★ - Excellent</option>
              <option value="4">★★★★☆ - Good</option>
              <option value="3">★★★☆☆ - Average</option>
              <option value="2">★★☆☆☆ - Poor</option>
              <option value="1">★☆☆☆☆ - Terrible</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Comment:</label>
            <textarea
              rows="3"
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button
            className="btn btn-success"
            disabled={submitting}
            onClick={submitReview}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
