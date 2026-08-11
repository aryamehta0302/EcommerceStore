import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import ProductCard from "../components/ProductCard";

const LABELS = {
  "new-in": "New In",
  women: "Women",
  men: "Men",
  edit: "The Edit",
};

// Controls section order. Anything not listed here falls to the end,
// sorted alphabetically by its raw category value.
const ORDER = ["new-in", "women", "men", "edit"];

function normalize(raw) {
  return (raw || "uncategorized").toString().trim().toLowerCase().replace(/\s+/g, "-");
}

function labelFor(slug) {
  if (LABELS[slug]) return LABELS[slug];
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await api.get(`/api/products`);
        const list = Array.isArray(data) ? data : data.products || [];
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sections = useMemo(() => {
    const groups = new Map();
    for (const p of products) {
      const slug = normalize(p.category);
      if (!groups.has(slug)) groups.set(slug, []);
      groups.get(slug).push(p);
    }

    const slugs = Array.from(groups.keys());
    slugs.sort((a, b) => {
      const ia = ORDER.indexOf(a);
      const ib = ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });

    return slugs.map((slug) => ({
      slug,
      label: labelFor(slug),
      items: groups.get(slug),
    }));
  }, [products]);

  return (
    <div className="all-page">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="all-hero"
      >
        <div className="all-eyebrow">Collection</div>
        <h1 className="all-title">Every Piece</h1>
        <p className="all-sub">
          {loading ? "Loading pieces…" : `${products.length} piece${products.length === 1 ? "" : "s"}`}
        </p>
      </motion.div>

      {error && !loading ? (
        <div className="all-empty">Couldn't load products. Try refreshing.</div>
      ) : !loading && sections.length === 0 ? (
        <div className="all-empty">No pieces yet.</div>
      ) : (
        sections.map((section, si) => (
          <motion.section
            key={section.slug}
            className="all-section"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: si * 0.05 }}
          >
            <div className="all-section-head">
              <h2 className="all-section-title">{section.label}</h2>
              <span className="all-section-count">
                {section.items.length} piece{section.items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="all-grid">
              {section.items.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        ))
      )}

      <style>{`
        .all-page { max-width: 1400px; margin: 0 auto; padding: 48px 24px 96px; }
        .all-hero { text-align: center; margin-bottom: 56px; padding-bottom: 32px; border-bottom: 1px solid var(--tm-line); }
        .all-eyebrow { font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--tm-gold); }
        .all-title { font-family: "Playfair Display", serif; font-size: clamp(40px, 7vw, 72px); margin: 12px 0 6px; }
        .all-sub { color: var(--tm-muted); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; }

        .all-section { margin-bottom: 64px; }
        .all-section:last-child { margin-bottom: 0; }
        .all-section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--tm-line);
        }
        .all-section-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(24px, 3vw, 34px);
          margin: 0;
        }
        .all-section-count {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--tm-muted);
          white-space: nowrap;
        }

        .all-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; }
        .all-empty { text-align: center; color: var(--tm-muted); padding: 80px 0; }
      `}</style>
    </div>
  );
}