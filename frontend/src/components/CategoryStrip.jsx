import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    id: 1,
    title: "Men",
    subtitle: "Modern Essentials",
    image: "/categories/men.jpg",
    query: "men",
  },
  {
    id: 2,
    title: "Women",
    subtitle: "Elegant Collection",
    image: "/categories/women.jpg",
    query: "women",
  },
  {
    id: 3,
    title: "Kids",
    subtitle: "Playful Fashion",
    image: "/categories/kids.jpg",
    query: "kids",
  },
  {
    id: 4,
    title: "Footwear",
    subtitle: "Walk in Style",
    image: "/categories/footwear.jpg",
    query: "footwear",
  },
  {
    id: 5,
    title: "Accessories",
    subtitle: "Complete Your Look",
    image: "/categories/accessories.jpg",
    query: "accessories",
  },
  {
    id: 6,
    title: "Sale",
    subtitle: "Limited Offers",
    image: "/categories/sale.jpg",
    query: "sale",
    badge: "SALE",
  },
];

export default function CategoryStrip({ onSelect }) {
  const navigate = useNavigate();

  const handleSelect = (query) => {
    if (onSelect) {
      onSelect(query);
    } else {
      navigate(`/category/${query}`);
    }
  };

  return (
    <section className="tm-strip">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="tm-strip-head"
      >
        <span className="tm-eyebrow">Discover</span>
        <h2 className="tm-heading">Shop By Category</h2>
        <p className="tm-sub">
          Explore our handpicked collections inspired by luxury fashion and timeless elegance.
        </p>
      </motion.div>

      <div className="tm-grid">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.07 }}
            whileHover={{ y: -8 }}
            className="tm-card"
            onClick={() => handleSelect(category.query)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelect(category.query);
            }}
          >
            <motion.img
              src={category.image}
              alt={category.title}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.7 }}
              className="tm-card-img"
            />

            <div className="tm-card-overlay" />

            {category.badge && (
              <div className="tm-card-badge">{category.badge}</div>
            )}

            <div className="tm-card-content">
              <span className="tm-card-subtitle">{category.subtitle}</span>
              <h3 className="tm-card-title">{category.title}</h3>
              <motion.span whileHover={{ x: 6 }} className="tm-card-cta">
                Shop Collection <span className="tm-card-arrow">→</span>
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .tm-strip { max-width: 1400px; margin: 0 auto; padding: 80px 24px; }

        .tm-strip-head { text-align: center; margin-bottom: 56px; }
        .tm-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--tm-gold);
          margin-bottom: 12px;
        }
        .tm-heading {
          font-family: "Playfair Display", serif;
          font-size: clamp(32px, 5vw, 48px);
          margin: 0 0 16px;
        }
        .tm-sub {
          max-width: 560px;
          margin: 0 auto;
          color: var(--tm-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .tm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
        }

        .tm-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          height: 340px;
          border: 1px solid var(--tm-line);
        }

        .tm-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .tm-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1) 55%, transparent);
        }

        .tm-card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 14px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          border: 1px solid var(--tm-gold);
        }

        .tm-card-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px;
          color: #fff;
        }

        .tm-card-subtitle {
          display: block;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 8px;
        }

        .tm-card-title {
          font-family: "Playfair Display", serif;
          font-size: 30px;
          margin: 0 0 14px;
        }

        .tm-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--tm-gold);
        }

        .tm-card-arrow { font-size: 14px; }

        @media (max-width: 768px) {
          .tm-card { height: 300px; }
        }
      `}</style>
    </section>
  );
}