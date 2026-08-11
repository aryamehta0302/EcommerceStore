import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="tm-footer mt-auto">
        <div className="container">
          <div className="row gy-4">
            {/* Brand */}
            <div className="col-12 col-md-4 text-center text-md-start">
              <motion.h5
                className="tm-footer-brand mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                TREND MART
              </motion.h5>
              <small className="tm-footer-sub">
                Or Noir · Made with care by Arya Mehta
              </small>
            </div>

            {/* Contact */}
            <div className="col-12 col-md-4 text-center">
              <h6 className="tm-footer-heading">Contact</h6>
              <small className="tm-footer-sub" style={{ lineHeight: 1.9 }}>
                +91 63533 62927<br />
                support@trendmart.in
              </small>
            </div>

            {/* Socials */}
            <div className="col-12 col-md-4 text-center text-md-end">
              <h6 className="tm-footer-heading">Follow Us</h6>
              <div className="d-flex justify-content-center justify-content-md-end gap-3">
                {[
                  { icon: "bi-facebook", href: "#" },
                  { icon: "bi-instagram", href: "#" },
                  { icon: "bi-twitter-x", href: "#" },
                ].map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    className="tm-footer-social-btn"
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="tm-footer-divider" />

          <div className="text-center">
            <small className="tm-footer-copyright">
              © {currentYear} Trend Mart. All rights reserved.
            </small>
          </div>
        </div>
      </footer>

      <style>{`
        .tm-footer {
          background: var(--tm-bg);
          color: var(--tm-muted);
          padding: 56px 0 28px;
          border-top: 1px solid var(--tm-line);
        }

        .tm-footer-brand {
          font-family: "Playfair Display", serif;
          font-weight: 500;
          font-size: 1.3rem;
          letter-spacing: 0.28em;
          color: var(--tm-fg);
          margin: 0;
        }

        .tm-footer-sub {
          color: var(--tm-muted);
          font-size: 0.82rem;
          letter-spacing: 0.02em;
        }

        .tm-footer-heading {
          font-family: "Inter", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: black;
          margin-bottom: 14px;
        }

        .tm-footer-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--tm-line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--tm-fg);
          font-size: 1rem;
          text-decoration: none;
          transition: border-color 0.25s ease, color 0.25s ease;
        }

        .tm-footer-social-btn:hover {
          border-color: var(--tm-gold);
          color: var(--tm-gold);
        }

        .tm-footer-divider {
          height: 1px;
          background: var(--tm-line);
          margin: 34px 0 18px;
        }

        .tm-footer-copyright {
          color: var(--tm-muted);
          font-size: 0.78rem;
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  );
}