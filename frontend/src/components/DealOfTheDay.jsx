import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const DEAL_TARGET = Date.now() + 1000 * 60 * 60 * 5;
const GOLD = "var(--gold, #c9a15a)";
const GOLD_SOFT = "var(--gold-soft, #e6c987)";

function getTimeLeft() {
  const diff = Math.max(0, DEAL_TARGET - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
}

function TimeBox({ value, label }) {
  return (
    <div className="tm-deal-timebox text-center">
      <div className="tm-deal-timebox-value">{String(value).padStart(2, "0")}</div>
      <div className="tm-deal-timebox-label">{label}</div>
    </div>
  );
}

function Colon() {
  return <span className="tm-deal-colon">:</span>;
}

export default function DealOfTheDay({ products }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-5 my-4 my-lg-5 tm-deal">
      <div className="container">
        {/* Header */}
        <div className="tm-deal-header d-flex flex-column gap-4 mb-5">
          <div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span
                style={{
                  width: 40,
                  height: 1,
                  background: GOLD,
                }}
              />
              <span
                style={{
                  color: GOLD,
                  fontSize: ".7rem",
                  fontWeight: 500,
                  letterSpacing: ".4em",
                  textTransform: "uppercase",
                }}
              >
                Private Sale · Ends Tonight
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-primary, #f5f0e6)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              An Hour of Quiet Indulgence
            </h2>
            <p
              className="mt-3"
              style={{
                color: "var(--text-muted, rgba(245,240,230,.6))",
                fontSize: ".95rem",
                fontWeight: 300,
                maxWidth: 520,
                margin: 0,
              }}
            >
              A curated trio — reserved briefly, then returned to the vault.
            </p>
          </div>

          {/* Countdown */}
          <div className="tm-deal-countdown d-flex align-items-center gap-2">
            <TimeBox value={timeLeft.hours} label="Hours" />
            <Colon />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <Colon />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>

        {/* Products */}
        <div className="row g-4">
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product._id || product.id || index}
              className="col-12 col-md-6 col-lg-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="position-relative tm-deal-card">
                <div className="tm-deal-badge">
                  −{20 + index * 5}%
                </div>
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .tm-deal-header { align-items: flex-start; }
        @media(min-width: 992px) {
          .tm-deal-header {
            flex-direction: row !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
          }
        }
        .tm-deal-countdown {
          padding: 18px 26px;
          background: linear-gradient(180deg, rgba(20,18,14,.6), rgba(10,10,10,.4));
          border: 1px solid var(--border, rgba(201,161,90,.25));
          border-radius: 2px;
          backdrop-filter: blur(10px);
        }
        .tm-deal-timebox { min-width: 56px; }
        .tm-deal-timebox-value {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 1.9rem;
          color: ${GOLD_SOFT};
          line-height: 1;
          letter-spacing: .02em;
        }
        .tm-deal-timebox-label {
          margin-top: 6px;
          font-size: .58rem;
          color: rgba(245,240,230,.5);
          text-transform: uppercase;
          letter-spacing: .28em;
          font-weight: 500;
        }
        .tm-deal-colon {
          color: ${GOLD};
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          opacity: .5;
          padding: 0 4px;
          margin-top: -12px;
        }
        .tm-deal-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;
          padding: 6px 12px;
          background: linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD});
          color: #0a0a0a;
          font-family: 'Inter', sans-serif;
          font-size: .62rem;
          font-weight: 700;
          letter-spacing: .18em;
          border-radius: 0;
        }
        .tm-deal-card :global(.product-card),
        .tm-deal-card .product-card {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
}
