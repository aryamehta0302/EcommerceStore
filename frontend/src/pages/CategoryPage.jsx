import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import ProductCard from "../components/ProductCard";

const LABELS = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  footwear: "Footwear",
  accessories: "Accessories",
  sale: "Sale",
};

const KEYWORDS = {
  "new-in": null,
  sale: null, // handled separately below, same as new-in
  women: ["women", "woman", "girl"],
  men: ["men", "boy"],
  kids: ["kids", "kid", "child", "children"],
  footwear: ["shoe", "shoes", "sneaker", "sandal", "boot", "heel", "footwear"],
  accessories: ["watch", "bag", "belt", "sunglasses", "wallet", "cap", "hat", "jewelry", "accessory", "accessories"],
};

function textOf(product) {
  return `${product.name || product.title || ""} ${product.brand || ""} ${product.category || ""}`.toLowerCase();
}

function matchesKeywords(product, keywords) {
  const text = textOf(product);
  return keywords.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(text));
}

async function fetchAllProducts() {
  const { data } = await api.get(`/api/products`);
  return Array.isArray(data) ? data : data.products || [];
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      let result = [];

      try {
        const keywords = KEYWORDS[slug];

        if (slug === "new-in") {
          const all = await fetchAllProducts();
          result = [...all]
            .sort((a, b) => {
              const da = new Date(a.createdAt || a.date || 0).getTime();
              const db = new Date(b.createdAt || b.date || 0).getTime();
              return db - da;
            })
            .slice(0, 20);
        } else if (slug === "sale") {
          // No real discount field yet — until one exists, "Sale" surfaces
          // the lowest-priced products as a stand-in so the page always
          // shows real items instead of an empty result.
          const all = await fetchAllProducts();
          result = [...all]
            .filter((p) => typeof p.price === "number")
            .sort((a, b) => a.price - b.price)
            .slice(0, 20);
        } else if (keywords) {
          try {
            const { data } = await api.get(`/api/products?keyword=${encodeURIComponent(slug)}`);
            const list = Array.isArray(data) ? data : data.products || [];
            result = list.filter((p) => matchesKeywords(p, keywords));
          } catch {
            result = [];
          }

          if (result.length === 0) {
            const all = await fetchAllProducts();
            result = all.filter((p) => matchesKeywords(p, keywords));
          }
        } else {
          result = [];
        }
      } catch {
        result = [];
      }

      if (!cancelled) {
        setProducts(result);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="cat-page">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="cat-hero"
      >
        <span className="cat-eyebrow">Collection</span>
        <span className="cat-divider">—</span>
        <h1 className="cat-title">{LABELS[slug] || slug}</h1>
        <span className="cat-divider">—</span>
        <span className="cat-count">
          {loading ? "Loading pieces…" : `${products.length} piece${products.length === 1 ? "" : "s"}`}
        </span>
      </motion.div>

      {!loading && products.length === 0 ? (
        <div className="cat-empty">No pieces in this collection yet.</div>
      ) : (
        <div className="cat-grid">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}

      <style>{`
        .cat-page { max-width: 1400px; margin: 0 auto; padding: 48px 24px 96px; }
        .cat-hero {
          display: flex;
          align-items: baseline;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--tm-line);
        }
        .cat-eyebrow { font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--tm-gold); }
        .cat-divider { font-size: 13px; color: var(--tm-line); }
        .cat-title { font-family: "Playfair Display", serif; font-size: clamp(24px, 3.5vw, 34px); margin: 0; line-height: 1; }
        .cat-count { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--tm-muted); white-space: nowrap; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; }
        .cat-empty { text-align: center; color: var(--tm-muted); padding: 80px 0; }
      `}</style>
    </div>
  );
}