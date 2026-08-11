import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaRulerHorizontal, FaTimes } from "react-icons/fa";
import api from "../api";
import { toast } from "react-toastify";
import { readCart, writeCart, readWishlistIds, writeWishlistIds } from "../utils/userStorage";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL"];
const FOOTWEAR_SIZES = ["6", "7", "8", "9", "10", "11", "12"];
const ONE_SIZE = ["One Size"];

const CLOTHING_CATEGORIES = ["women", "men", "clothing", "apparel", "new-in", "edit"];
const FOOTWEAR_CATEGORIES = ["footwear", "shoes", "sneakers", "boots", "sandals", "heels", "loafers"];

// Returns { sizes, type } where type is "clothing" | "footwear" | "one-size"
// — used both to pick the options list and to decide which UI (size guide,
// label wording, chart columns) to show.
function getSizeConfig(product) {
  const category = (product?.category || "").toLowerCase();

  if (FOOTWEAR_CATEGORIES.some((c) => category.includes(c))) {
    return { sizes: FOOTWEAR_SIZES, type: "footwear" };
  }
  if (CLOTHING_CATEGORIES.some((c) => category.includes(c))) {
    return { sizes: CLOTHING_SIZES, type: "clothing" };
  }
  return { sizes: ONE_SIZE, type: "one-size" };
}

const CLOTHING_SIZE_CHART = [
  { size: "XS", chest: "34-36", waist: "28-30", hip: "35-37" },
  { size: "S", chest: "36-38", waist: "30-32", hip: "37-39" },
  { size: "M", chest: "38-40", waist: "32-34", hip: "39-41" },
  { size: "L", chest: "40-42", waist: "34-36", hip: "41-43" },
  { size: "XL", chest: "42-44", waist: "36-38", hip: "43-45" },
];

const FOOTWEAR_SIZE_CHART = [
  { size: "6", uk: "5", eu: "39", cm: "24" },
  { size: "7", uk: "6", eu: "40", cm: "25" },
  { size: "8", uk: "7", eu: "41", cm: "26" },
  { size: "9", uk: "8", eu: "42", cm: "27" },
  { size: "10", uk: "9", eu: "43", cm: "28" },
  { size: "11", uk: "10", eu: "44", cm: "29" },
  { size: "12", uk: "11", eu: "45", cm: "30" },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

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
    setSelectedSize(null);
  }, [id]);

  const { sizes: sizeOptions, type: sizeType } = useMemo(() => getSizeConfig(product), [product]);
  const isOneSize = sizeType === "one-size";
  const isFootwear = sizeType === "footwear";

  // Auto-select "One Size" for non-clothing/non-footwear products so the
  // user isn't forced to click a selector that doesn't meaningfully apply.
  useEffect(() => {
    if (isOneSize) setSelectedSize(sizeOptions[0]);
  }, [isOneSize, sizeOptions]);

  useEffect(() => {
    const sync = () => setWishlisted(readWishlistIds().includes(id));
    sync();
    window.addEventListener("wishlist:change", sync);
    window.addEventListener("auth:change", sync);
    return () => {
      window.removeEventListener("wishlist:change", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, [id]);

  const toggleWishlist = () => {
    const current = readWishlistIds();
    const isIn = current.includes(id);
    const next = isIn ? current.filter((x) => x !== id) : [...current, id];
    writeWishlistIds(next);
    setWishlisted(!isIn);
    toast[isIn ? "info" : "success"](isIn ? "Removed from wishlist" : "Added to wishlist");
  };

  const submitReview = async () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.info("Please sign in to write a review");
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

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
    if (!selectedSize) {
      toast.error(isFootwear ? "Please select a shoe size" : "Please select a size");
      return;
    }
    const cart = readCart();
    const existing = cart.find((c) => c._id === product._id && c.size === selectedSize);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1, size: selectedSize });
    writeCart(cart);
    setAddedToCart(true);
    toast.success(
      isOneSize ? "Added to cart!" : `Added to cart · Size ${selectedSize}`
    );
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-layout">
          <div className="pd-skeleton-img" />
          <div className="pd-skeleton-info">
            <div className="pd-skel-line" style={{ width: "70%", height: 28 }} />
            <div className="pd-skel-line" style={{ width: "40%", height: 16 }} />
            <div className="pd-skel-line" style={{ width: "30%", height: 22 }} />
            <div className="pd-skel-line" style={{ width: "100%", height: 60 }} />
          </div>
        </div>
        <style>{`
          .pd-page { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
          .pd-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
          .pd-skeleton-img, .pd-skel-line {
            border-radius: 2px;
            background: linear-gradient(100deg, var(--tm-line) 30%, rgba(255,255,255,0.06) 50%, var(--tm-line) 70%);
            background-size: 200% 100%;
            animation: pd-shimmer 1.6s ease-in-out infinite;
          }
          .pd-skeleton-img { height: 500px; }
          .pd-skeleton-info { display: flex; flex-direction: column; gap: 16px; }
          @keyframes pd-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          @media (max-width: 860px) { .pd-layout { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    );
  }

  if (!product) return <p className="pd-notfound">Product not found</p>;

  return (
    <motion.div
      className="pd-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="pd-layout">
        {/* LEFT: Single image */}
        <motion.div
          className="pd-gallery"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="pd-gallery-main">
            <img
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.name}
            />
            <button
              className="pd-wish"
              onClick={toggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Info */}
        <motion.div
          className="pd-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="pd-brand">{product.brand}</p>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-rating-row">
            <span className="pd-stars">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span className="pd-reviews-count">({product.numReviews || 0} reviews)</span>
          </div>

          <div className="pd-price">₹{product.price}</div>

          {/* Size selector — clothing: XS–XL, footwear: numeric, everything else: One Size */}
          <div className="pd-size-block">
            <div className="pd-size-row">
              <span className="pd-label">
                {isOneSize ? "Size" : isFootwear ? "Select Shoe Size" : "Select Size"}
              </span>
              {!isOneSize && (
                <button className="pd-size-guide-link" onClick={() => setSizeGuideOpen(true)}>
                  <FaRulerHorizontal size={11} /> Size Guide
                </button>
              )}
            </div>

            {isOneSize ? (
              <div className="pd-one-size-badge">One Size</div>
            ) : (
              <div className="pd-size-options">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    className={`pd-size-btn ${isFootwear ? "footwear" : ""} ${selectedSize === s ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {isFootwear ? `UK ${s}` : s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="pd-desc">{product.description || "No description available."}</p>

          <motion.button
            className={`pd-add-btn ${addedToCart ? "added" : ""}`}
            onClick={addToCart}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
          >
            {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
          </motion.button>
        </motion.div>
      </div>

      {/* Size Guide Modal — content adapts to clothing vs footwear */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            className="pd-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSizeGuideOpen(false)}
          >
            <motion.div
              className="pd-modal"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pd-modal-head">
                <h3>Size Guide</h3>
                <button onClick={() => setSizeGuideOpen(false)} aria-label="Close">
                  <FaTimes />
                </button>
              </div>

              {isFootwear ? (
                <>
                  <p className="pd-modal-note">US sizing shown on product · UK / EU / cm reference</p>
                  <table className="pd-size-table">
                    <thead>
                      <tr>
                        <th>US</th>
                        <th>UK</th>
                        <th>EU</th>
                        <th>CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FOOTWEAR_SIZE_CHART.map((row) => (
                        <tr key={row.size}>
                          <td>{row.size}</td>
                          <td>{row.uk}</td>
                          <td>{row.eu}</td>
                          <td>{row.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <p className="pd-modal-note">All measurements in inches</p>
                  <table className="pd-size-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Chest</th>
                        <th>Waist</th>
                        <th>Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLOTHING_SIZE_CHART.map((row) => (
                        <tr key={row.size}>
                          <td>{row.size}</td>
                          <td>{row.chest}</td>
                          <td>{row.waist}</td>
                          <td>{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews */}
      <motion.div
        className="pd-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h4 className="pd-section-title">Customer Reviews</h4>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="pd-review-list">
            {product.reviews.map((r, i) => (
              <motion.div
                key={r._id || i}
                className="pd-review"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="pd-review-top">
                  <div className="pd-review-avatar">{r.name?.charAt(0)?.toUpperCase() || "U"}</div>
                  <div className="pd-review-meta">
                    <strong>{r.name}</strong>
                    <span className="pd-review-date">{new Date(r.createdAt).toDateString()}</span>
                  </div>
                  <span className="pd-review-stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="pd-review-text">{r.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="pd-no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </motion.div>

      {/* Add Review */}
      <motion.div
        className="pd-card pd-write-review"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h5 className="pd-section-title" style={{ marginBottom: 18 }}>Write a Review</h5>

        <div className="pd-form-field">
          <label className="pd-label">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="pd-select"
          >
            <option value="">Select rating</option>
            <option value="5">★★★★★ — Excellent</option>
            <option value="4">★★★★☆ — Good</option>
            <option value="3">★★★☆☆ — Average</option>
            <option value="2">★★☆☆☆ — Poor</option>
            <option value="1">★☆☆☆☆ — Terrible</option>
          </select>
        </div>

        <div className="pd-form-field">
          <label className="pd-label">Comment</label>
          <textarea
            rows="3"
            className="pd-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
          />
        </div>

        <motion.button
          className="pd-submit-btn"
          disabled={submitting}
          onClick={submitReview}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </motion.button>
      </motion.div>

      <style>{`
        .pd-page { max-width: 1200px; margin: 0 auto; padding: 40px 24px 96px; }
        .pd-notfound { text-align: center; color: #b3261e; padding: 80px 0; font-size: 14px; }

        .pd-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          margin-bottom: 60px;
        }

        .pd-gallery-main {
          position: relative;
          border: 1px solid var(--tm-line);
          overflow: hidden;
          background: var(--tm-card);
        }
        .pd-gallery-main img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }
        .pd-wish {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          width: 38px; height: 38px; border-radius: 50%; border: none;
          background: rgba(250,247,242,0.92); backdrop-filter: blur(6px);
          color: var(--tm-gold); display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.25);
          transition: transform 0.15s ease;
        }
        .pd-wish:hover { transform: scale(1.08); }

        .pd-info { display: flex; flex-direction: column; }
        .pd-brand {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--tm-muted); margin: 0 0 6px;
        }
        .pd-name {
          font-family: "Playfair Display", serif; font-size: 32px;
          margin: 0 0 14px; letter-spacing: -0.01em; font-weight: 500;
        }
        .pd-rating-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .pd-stars { color: var(--tm-gold); font-size: 15px; letter-spacing: 2px; }
        .pd-reviews-count { font-size: 12px; color: var(--tm-muted); }

        .pd-price {
          font-family: "Playfair Display", serif; font-size: 26px;
          font-weight: 600; color: var(--tm-gold); margin-bottom: 24px;
        }

        .pd-size-block { margin-bottom: 24px; }
        .pd-size-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .pd-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tm-muted); }
        .pd-size-guide-link {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; border: none; color: var(--tm-gold);
          font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 3px;
        }
        .pd-size-options { display: flex; gap: 10px; flex-wrap: wrap; }
        .pd-size-btn {
          min-width: 46px; height: 46px;
          padding: 0 10px;
          border: 1px solid var(--tm-line);
          background: transparent;
          color: var(--tm-fg, inherit);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: border-color .2s ease, background .2s ease, color .2s ease;
        }
        .pd-size-btn.footwear { min-width: 58px; }
        .pd-size-btn:hover { border-color: var(--tm-gold); color: var(--tm-gold); }
        .pd-size-btn.selected {
          background: var(--tm-gold); border-color: var(--tm-gold); color: #0b0b0c;
        }

        .pd-one-size-badge {
          display: inline-block;
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 9px 20px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        .pd-desc { color: var(--tm-muted); line-height: 1.75; font-size: 14px; margin-bottom: 28px; }

        .pd-add-btn {
          background: var(--tm-gold); border: 1px solid var(--tm-gold); color: #0b0b0c;
          padding: 14px; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; width: 100%; max-width: 320px;
          transition: opacity .2s ease;
        }
        .pd-add-btn:hover { opacity: 0.88; }
        .pd-add-btn.added { background: transparent; color: var(--tm-gold); }

        .pd-modal-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .pd-modal {
          background: var(--tm-bg); border: 1px solid var(--tm-line);
          padding: 28px; max-width: 440px; width: 100%;
        }
        .pd-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .pd-modal-head h3 { font-family: "Playfair Display", serif; font-size: 20px; margin: 0; font-weight: 500; }
        .pd-modal-head button { background: transparent; border: none; color: var(--tm-muted); cursor: pointer; font-size: 16px; }
        .pd-modal-head button:hover { color: var(--tm-gold); }
        .pd-modal-note { font-size: 11px; color: var(--tm-muted); margin: 4px 0 16px; }
        .pd-size-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .pd-size-table th, .pd-size-table td {
          padding: 9px 8px; text-align: center; border-bottom: 1px solid var(--tm-line);
        }
        .pd-size-table th { color: var(--tm-gold); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; font-size: 10.5px; }
        .pd-size-table td { color: var(--tm-muted); }

        .pd-section { margin-bottom: 32px; }
        .pd-section-title {
          font-family: "Playfair Display", serif; font-size: 20px;
          margin: 0 0 22px; font-weight: 500;
        }
        .pd-review-list { display: flex; flex-direction: column; gap: 16px; }
        .pd-review { border: 1px solid var(--tm-line); padding: 18px; }
        .pd-review-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .pd-review-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--tm-gold); color: #0b0b0c;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px; flex-shrink: 0;
        }
        .pd-review-meta { display: flex; flex-direction: column; flex: 1; }
        .pd-review-meta strong { font-size: 13.5px; }
        .pd-review-date { font-size: 11px; color: var(--tm-muted); }
        .pd-review-stars { color: var(--tm-gold); font-size: 12.5px; letter-spacing: 1px; }
        .pd-review-text { color: var(--tm-muted); font-size: 13.5px; line-height: 1.6; margin: 0; }
        .pd-no-reviews { color: var(--tm-muted); font-size: 13.5px; }

        .pd-card { border: 1px solid var(--tm-line); padding: 26px; }
        .pd-form-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
        .pd-select, .pd-textarea {
          background: transparent; border: 1px solid var(--tm-line); color: var(--tm-fg, inherit);
          font-size: 13.5px; padding: 10px 12px; outline: none; transition: border-color .2s ease;
          font-family: inherit;
        }
        .pd-select:focus, .pd-textarea:focus { border-color: var(--tm-gold); }
        .pd-textarea { resize: vertical; }

        .pd-submit-btn {
          background: var(--tm-gold); border: 1px solid var(--tm-gold); color: #0b0b0c;
          padding: 12px 26px; font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; transition: opacity .2s ease;
        }
        .pd-submit-btn:hover:not(:disabled) { opacity: 0.88; }
        .pd-submit-btn:disabled { opacity: 0.6; cursor: default; }

        @media (max-width: 860px) {
          .pd-layout { grid-template-columns: 1fr; gap: 32px; }
          .pd-gallery-main img { height: 400px; }
        }
        @media (max-width: 480px) {
          .pd-page { padding: 28px 16px 72px; }
          .pd-name { font-size: 26px; }
          .pd-size-btn { min-width: 42px; height: 42px; }
        }
      `}</style>
    </motion.div>
  );
}