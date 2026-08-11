import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    role: "Verified client · Mumbai",
    rating: 5,
    text: "The quality is far beyond what I expected. Delivery was swift and the packaging felt like unwrapping something truly precious.",
  },
  {
    name: "Arjun Mehta",
    role: "Verified client · Delhi",
    rating: 5,
    text: "My go-to house for tailored fits. Sizing is precise and the client service handled my exchange with quiet, effortless care.",
  },
  {
    name: "Sana Kapoor",
    role: "Verified client · Bengaluru",
    rating: 5,
    text: "A beautifully curated edit. The site itself feels considered — every detail whispers craftsmanship rather than shouts it.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TestimonialStrip() {
  return (
    <section
      className="position-relative w-100"
      style={{
        width: "100%",
        padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 6vw, 6rem)",
        background: "#0a0a0a",
        color: "#f5f1e8",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
          <span
            style={{ width: 40, height: 1, background: "#c9a96a" }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#c9a96a",
            }}
          >
            The Clientele
          </span>
          <span
            style={{ width: 40, height: 1, background: "#c9a96a" }}
          />
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Cherished by a discerning few
        </h2>
        <p
          className="mx-auto mt-2"
          style={{
            maxWidth: 560,
            color: "rgba(245,241,232,0.6)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          Quiet notes from clients who have brought the Maison into their
          everyday.
        </p>
      </div>

      {/* Cards */}
      <motion.div
        className="row g-3 g-lg-4 justify-content-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            className="col-12 col-md-6 col-lg-4"
            variants={cardVariants}
          >
            <article
              className="h-100 position-relative d-flex flex-column"
              style={{
                padding: "1.75rem 1.75rem",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                border: "1px solid rgba(201,169,106,0.15)",
                borderRadius: 4,
                transition: "border-color .4s ease, transform .4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,169,106,0.45)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,169,106,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaQuoteLeft
                size={20}
                style={{ color: "#c9a96a", opacity: 0.8, marginBottom: "1rem" }}
              />

              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  color: "rgba(245,241,232,0.9)",
                  marginBottom: "1.5rem",
                  flexGrow: 1,
                }}
              >
                “{t.text}”
              </p>

              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,169,106,0.4), transparent)",
                  marginBottom: "1rem",
                }}
              />

              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1rem",
                      color: "#f5f1e8",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.66rem",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(245,241,232,0.45)",
                      marginTop: 3,
                    }}
                  >
                    {t.role}
                  </div>
                </div>
                <div className="d-flex gap-1" style={{ color: "#c9a96a" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      size={11}
                      opacity={i < t.rating ? 1 : 0.2}
                    />
                  ))}
                </div>
              </div>
            </article>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}