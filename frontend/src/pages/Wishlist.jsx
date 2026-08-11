import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { readWishlistIds, writeWishlistIds } from "../utils/userStorage";

export default function Wishlist() {
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIds(readWishlistIds());
    const sync = () => setIds(readWishlistIds());
    window.addEventListener("wishlist:change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("auth:change", sync); // reload when a different user logs in/out
    return () => {
      window.removeEventListener("wishlist:change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (ids.length === 0) { setItems([]); setLoading(false); return; }
      try {
        const results = await Promise.all(
          ids.map((id) => api.get(`/api/products/${id}`).then(r => r.data).catch(() => null))
        );
        if (!cancelled) setItems(results.filter(Boolean));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ids]);

  const clearAll = () => {
    writeWishlistIds([]);
    toast.info("Wishlist cleared");
  };

  const count = items.length;

  return (
    <div className="wl-page">
      <div className="wl-header">
        <div className="wl-header-left">
          <h1 className="wl-title">Wishlist</h1>
          {!loading && (
            <span className="wl-count">
              {count > 0 ? `${count} piece${count === 1 ? "" : "s"}` : "Empty"}
            </span>
          )}
        </div>
        {!loading && count > 0 && (
          <button className="wl-clear" onClick={clearAll}>Clear all</button>
        )}
      </div>

      {loading ? (
        <div className="wl-grid" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="wl-skeleton" key={i}>
              <div className="wl-skeleton-img" />
              <div className="wl-skeleton-line" style={{ width: "70%" }} />
              <div className="wl-skeleton-line" style={{ width: "40%" }} />
            </div>
          ))}
        </div>
      ) : count === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="wl-empty"
        >
          <svg className="wl-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z" />
          </svg>
          <p>Your wishlist is empty.</p>
          <Link to="/" className="wl-cta">Discover the collection →</Link>
        </motion.div>
      ) : (
        <motion.div layout className="wl-grid">
          <AnimatePresence>
            {items.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <style>{`
        .wl-page { max-width: 1400px; margin: 0 auto; padding: 32px 24px 96px; }

        .wl-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--tm-line);
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .wl-header-left { display: flex; align-items: baseline; gap: 12px; }
        .wl-title {
          font-family: "Playfair Display", serif;
          font-size: 26px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .wl-count { font-size: 12px; letter-spacing: 0.05em; color: var(--tm-muted); }
        .wl-clear {
          background: transparent;
          border: 1px solid var(--tm-gold);
          color: var(--tm-gold);
          padding: 8px 18px;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: background .25s ease, color .25s ease;
        }
        .wl-clear:hover { background: var(--tm-gold); color: #0b0b0c; }

        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 36px 28px;
        }

        .wl-empty {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 90px 20px; color: var(--tm-muted);
        }
        .wl-empty-icon { width: 34px; height: 34px; margin-bottom: 18px; color: var(--tm-gold); opacity: 0.6; }
        .wl-empty p { font-size: 14px; margin-bottom: 4px; }
        .wl-cta {
          display: inline-block; margin-top: 14px; color: var(--tm-gold);
          text-decoration: none; letter-spacing: 0.2em; text-transform: uppercase;
          font-size: 11.5px; border-bottom: 1px solid transparent; transition: border-color .2s ease;
        }
        .wl-cta:hover { border-color: var(--tm-gold); }

        .wl-skeleton { display: flex; flex-direction: column; gap: 10px; }
        .wl-skeleton-img {
          aspect-ratio: 3 / 4; border-radius: 2px;
          background: linear-gradient(100deg, var(--tm-line) 30%, rgba(255,255,255,0.06) 50%, var(--tm-line) 70%);
          background-size: 200% 100%; animation: wl-shimmer 1.6s ease-in-out infinite;
        }
        .wl-skeleton-line {
          height: 10px; border-radius: 2px;
          background: linear-gradient(100deg, var(--tm-line) 30%, rgba(255,255,255,0.06) 50%, var(--tm-line) 70%);
          background-size: 200% 100%; animation: wl-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes wl-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 480px) {
          .wl-page { padding: 24px 16px 72px; }
          .wl-header { padding-bottom: 14px; margin-bottom: 28px; }
          .wl-title { font-size: 22px; }
          .wl-grid { gap: 28px 18px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
        }
      `}</style>
    </div>
  );
}