import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { readWishlistIds, writeWishlistIds } from "../utils/userStorage";

// TODO(backend): there's no wishlist endpoint/User field yet, so this is
// stored client-side in localStorage for now (scoped per-user via userStorage.js).
// Once userModel.js/userRoutes.js have a real wishlist array, swap
// readWishlistIds/writeWishlistIds below for API calls (e.g. GET/POST
// /api/users/wishlist) and this component's public behavior (heart toggles,
// persists, reflects state) stays the same.

export default function ProductCard({ product, index = 0 }) {
  // TODO(backend): productModel.js currently only has a single `image`
  // field. This falls back gracefully to that single image, but once the
  // schema has a real `images: [String]` array, product.images will be
  // used automatically — no other change needed here.
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "https://via.placeholder.com/300"];

  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const sync = () => setWishlisted(readWishlistIds().includes(product._id));
    sync();
    window.addEventListener("wishlist:change", sync);
    window.addEventListener("auth:change", sync); // re-check when a different user logs in/out
    return () => {
      window.removeEventListener("wishlist:change", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, [product._id]);

  const goToImage = (i, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setActiveImage(((i % images.length) + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      goToImage(activeImage + (delta < 0 ? 1 : -1));
    }
    setTouchStartX(null);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const current = readWishlistIds();
    const isIn = current.includes(product._id);
    const next = isIn ? current.filter((id) => id !== product._id) : [...current, product._id];

    writeWishlistIds(next);
    setWishlisted(!isIn);
    toast[isIn ? "info" : "success"](isIn ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      className="tm-pc h-100"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        {/* Image slider */}
        <div
          className="tm-pc-img-wrap position-relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[activeImage]}
              src={images[activeImage]}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          </AnimatePresence>

          {/* Wishlist toggle */}
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={toggleWishlist}
            className="tm-pc-wish"
          >
            {wishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          </button>

          {/* Prev/next arrows (multi-image only, shown on hover) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => goToImage(activeImage - 1, e)}
                className="tm-pc-arrow tm-pc-arrow-left"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => goToImage(activeImage + 1, e)}
                className="tm-pc-arrow tm-pc-arrow-right"
              >
                <FaChevronRight size={11} />
              </button>

              {/* Dot indicators */}
              <div className="tm-pc-dots">
                {images.map((_, i) => (
                  <span
                    key={i}
                    role="button"
                    aria-label={`Show image ${i + 1}`}
                    onClick={(e) => goToImage(i, e)}
                    className={`tm-pc-dot ${activeImage === i ? "active" : ""}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="tm-pc-overlay-btn">
            <span className="tm-pc-view-btn">View Details →</span>
          </div>
        </div>

        {/* Body */}
        <div className="tm-pc-body">
          <div className="tm-pc-name">{product.name}</div>
          <div className="tm-pc-brand">{product.brand}</div>

          <div className="d-flex justify-content-between align-items-center mt-1">
            <span className="tm-pc-price">₹{product.price}</span>
            <div className="d-flex align-items-center gap-1">
              <span className="tm-pc-rating">
                {"★".repeat(Math.round(product.rating || 0))}
                {"☆".repeat(5 - Math.round(product.rating || 0))}
              </span>
              <small className="tm-pc-reviews">
                ({product.numReviews || 0})
              </small>
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .tm-pc {
          background: var(--tm-card);
          border: 1px solid var(--tm-line);
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .tm-pc:hover {
          border-color: var(--tm-gold);
          transform: translateY(-4px);
        }

        .tm-pc-img-wrap {
          position: relative;
          overflow: hidden;
          background: var(--tm-bg);
        }
        .tm-pc-img-wrap img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .tm-pc:hover .tm-pc-img-wrap img {
          transform: scale(1.06);
        }

        .tm-pc-wish {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(250,247,242,0.92);
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 10px rgba(0,0,0,0.25);
          color: var(--tm-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }
        .tm-pc-wish:hover { transform: scale(1.08); }

        .tm-pc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(250,247,242,0.9);
          color: #141210;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .tm-pc-arrow-left { left: 8px; }
        .tm-pc-arrow-right { right: 8px; }
        .tm-pc:hover .tm-pc-arrow { opacity: 1; }

        .tm-pc-dots {
          position: absolute;
          bottom: 8px;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          gap: 4px;
          justify-content: center;
        }
        .tm-pc-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.55);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          cursor: pointer;
          display: inline-block;
        }
        .tm-pc-dot.active {
          width: 14px;
          background: var(--tm-gold);
        }

        .tm-pc-overlay-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent 0%, rgba(0,0,0,0.65) 100%);
          padding: 40px 14px 14px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.35s ease;
        }
        .tm-pc:hover .tm-pc-overlay-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .tm-pc-view-btn {
          display: block;
          width: 100%;
          text-align: center;
          background: rgba(250,247,242,0.95);
          color: #141210;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          border-radius: 50px;
          padding: 8px 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .tm-pc-body { padding: 16px 18px; }

        .tm-pc-name {
          font-family: "Playfair Display", serif;
          font-size: 1rem;
          color: var(--tm-fg);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tm-pc-brand {
          font-size: 0.7rem;
          color: var(--tm-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 500;
        }

        .tm-pc-price {
          font-family: "Playfair Display", serif;
          font-weight: 600;
          font-size: 1.15rem;
          color: var(--tm-gold);
        }

        .tm-pc-rating {
          color: var(--tm-gold);
          font-size: 0.78rem;
          letter-spacing: 1px;
        }

        .tm-pc-reviews {
          color: var(--tm-muted);
          font-size: 0.7rem;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  );
}