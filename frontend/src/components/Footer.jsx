import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="tm-footer mt-auto">
      <div className="container">
        <div className="row gy-4">
          {/* Brand */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <motion.h5
              className="fw-bold mb-2"
              style={{
                fontFamily: "'Outfit', sans-serif",
                background: "linear-gradient(135deg, var(--primary-light), var(--accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.2rem",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              🛍️ TrendMart
            </motion.h5>
            <small style={{ color: "#6b7280" }}>
              Made with ❤️ by Arya Mehta
            </small>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4 text-center">
            <h6>Contact</h6>
            <small style={{ lineHeight: 1.8 }}>
              📞 +91 63533 62927<br />
              ✉️ support@trendmart.in
            </small>
          </div>

          {/* Socials */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <h6>Follow Us</h6>
            <div className="tm-footer-social d-flex justify-content-center justify-content-md-end gap-3">
              {[
                { icon: "bi-facebook", href: "#" },
                { icon: "bi-instagram", href: "#" },
                { icon: "bi-twitter-x", href: "#" },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "30px 0 15px" }} />

        <div className="text-center">
          <small style={{ color: "#4b5563", fontSize: "0.8rem" }}>
            © {currentYear} TrendMart. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
