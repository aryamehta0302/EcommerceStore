import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHeart, FaRegUser, FaSearch, FaShoppingBag, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import api from "../api";
import AccountMenu from "./AccountMenu";
import { readWishlistIds, readCart } from "../utils/userStorage";

const THEME_KEY = "tm_theme";

const CATEGORIES = [
  { label: "New In", slug: "new-in" },
  { label: "Women", slug: "women" },
  { label: "Men", slug: "men" },
  { label: "Sale", slug: "sale" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [wishCount, setWishCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return (localStorage.getItem(THEME_KEY) || "dark") === "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch { }
  }, [dark]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const sync = () => setWishCount(readWishlistIds().length);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("wishlist:change", sync);
    window.addEventListener("auth:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("wishlist:change", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, []);

  useEffect(() => {
    const sync = () => setCartCount(readCart().reduce((sum, item) => sum + (item.qty || 1), 0));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart:change", sync);
    window.addEventListener("auth:change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart:change", sync);
      window.removeEventListener("auth:change", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      const stored = localStorage.getItem("userInfo");
      if (!stored) { setUser(null); return; }
      try {
        const { data } = await api.get("/api/users/profile");
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) setUser(null);
      }
    };
    fetchUser();
    window.addEventListener("auth:change", fetchUser);
    return () => {
      cancelled = true;
      window.removeEventListener("auth:change", fetchUser);
    };
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return null;
    return user.name.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase()).join("");
  }, [user]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setDrawer(false);
    navigate(`/?keyword=${encodeURIComponent(q)}`);
  };

  const isAdmin = !!user?.isAdmin;
  const brandHref = isAdmin ? "/admin" : "/";

  return (
    <>
      <div className="tm-announce">
        Complimentary shipping worldwide · Private atelier appointments
      </div>

      <header className={`tm-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="tm-nav-inner">
          <div className="tm-nav-left">
            <button
              className="tm-icon-btn d-lg-none"
              aria-label="Menu"
              onClick={() => setDrawer(true)}
            >
              <FaBars />
            </button>
            {!isAdmin && (
              <button
                className="tm-icon-btn d-none d-lg-inline-flex"
                aria-label="Search"
                onClick={() => setSearchOpen(v => !v)}
              >
                <FaSearch />
              </button>
            )}
          </div>

          <Link to={brandHref} className="tm-brand" onClick={() => setDrawer(false)}>
            <span className="tm-brand-name">TREND MART</span>
            <span className="tm-brand-sub">Or Noir · Est. 1897</span>
          </Link>

          <div className="tm-nav-right">
            <button
              className="tm-icon-btn"
              aria-label="Toggle theme"
              onClick={() => setDark(v => !v)}
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            {!isAdmin && (
              <>
                <NavLink to="/wishlist" className="tm-icon-btn tm-wish" aria-label="Wishlist">
                  <FaHeart />
                  {wishCount > 0 && <span className="tm-badge">{wishCount}</span>}
                </NavLink>

                <NavLink to="/cart" className="tm-icon-btn tm-wish" aria-label="Bag">
                  <FaShoppingBag />
                  {cartCount > 0 && <span className="tm-badge">{cartCount}</span>}
                </NavLink>
              </>
            )}

            {user ? (
              <AccountMenu user={user} />
            ) : (
              <NavLink to="/login" className="tm-icon-btn" aria-label="Account">
                <FaRegUser />
              </NavLink>
            )}
          </div>
        </div>

        {!isAdmin && (
          <nav className="tm-nav-cats d-none d-lg-flex">
            {CATEGORIES.map((c) => (
              <NavLink
                key={c.slug}
                to={`/category/${c.slug}`}
                className={({ isActive }) => `tm-cat ${isActive ? "is-active" : ""}`}
              >
                {c.label}
              </NavLink>
            ))}
          </nav>
        )}

        {!isAdmin && (
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="tm-search-wrap"
              >
                <form className="tm-search-form" onSubmit={submitSearch}>
                  <FaSearch className="tm-search-icon" />
                  <input
                    autoFocus
                    className="tm-search-input"
                    placeholder="Search timepieces, jewelry, leather…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="button" className="tm-search-close" onClick={() => setSearchOpen(false)}>
                    <FaTimes />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </header>

      <AnimatePresence>
        {drawer && (
          <motion.aside
            className="tm-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="tm-drawer-top">
              <span className="tm-brand-name">TREND MART</span>
              <button className="tm-icon-btn" onClick={() => setDrawer(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            {!isAdmin && (
              <form className="tm-search-form tm-search-form--drawer" onSubmit={submitSearch}>
                <FaSearch className="tm-search-icon" />
                <input
                  className="tm-search-input"
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            )}

            <nav className="tm-drawer-nav">
              {!isAdmin && CATEGORIES.map((c) => (
                <NavLink
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className="tm-drawer-link"
                  onClick={() => setDrawer(false)}
                >
                  {c.label}
                </NavLink>
              ))}
              {!isAdmin && (
                <>
                  <NavLink to="/wishlist" className="tm-drawer-link" onClick={() => setDrawer(false)}>
                    Wishlist ({wishCount})
                  </NavLink>
                  <NavLink to="/cart" className="tm-drawer-link" onClick={() => setDrawer(false)}>
                    Bag ({cartCount})
                  </NavLink>
                </>
              )}
              <NavLink to={user ? (isAdmin ? "/admin" : "/account") : "/login"} className="tm-drawer-link" onClick={() => setDrawer(false)}>
                {user ? (isAdmin ? "Dashboard" : "Account") : "Sign In"}
              </NavLink>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <style>{`
        :root[data-theme="dark"] {
          --tm-bg: #0b0b0c; --tm-fg: #f5efe3; --tm-muted: #9a9187;
          --tm-line: rgba(212,175,55,0.18); --tm-gold: #d4af37; --tm-card: #141315;
        }
        :root[data-theme="light"] {
          --tm-bg: #faf7f2; --tm-fg: #141210; --tm-muted: #6b6259;
          --tm-line: rgba(20,18,16,0.12); --tm-gold: #b8892b; --tm-card: #ffffff;
        }
        body { background: var(--tm-bg); color: var(--tm-fg); }

        .tm-announce {
          background: #000; color: var(--tm-gold);
          font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
          text-align: center; padding: 8px 12px; border-bottom: 1px solid var(--tm-line);
        }
        .tm-nav {
          position: sticky; top: 0; z-index: 60;
          background: color-mix(in oklab, var(--tm-bg) 82%, transparent);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          transition: box-shadow .3s ease, background .3s ease;
        }
        .tm-nav.is-scrolled { box-shadow: 0 1px 0 var(--tm-line); }
        .tm-nav-inner {
          max-width: 1400px; margin: 0 auto; padding: 14px 24px;
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px;
        }
        .tm-nav-left { display: flex; gap: 10px; }
        .tm-nav-right { display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
        .tm-icon-btn {
          width: 40px; height: 40px; border-radius: 999px;
          border: 1px solid transparent; background: transparent; color: var(--tm-fg);
          display: inline-flex; align-items: center; justify-content: center;
          position: relative; cursor: pointer; transition: color .25s, border-color .25s, background .25s;
        }
        .tm-icon-btn:hover { color: var(--tm-gold); border-color: var(--tm-line); }
        .tm-initials { font-size: 11px; font-weight: 700; letter-spacing: .08em; }
        .tm-wish .tm-badge {
          position: absolute; top: 4px; right: 4px; min-width: 18px; height: 18px;
          padding: 0 5px; border-radius: 999px; background: var(--tm-gold); color: #0b0b0c;
          font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
        }

        .tm-brand { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; }
        .tm-brand-name {
          font-family: "Playfair Display", "Cormorant Garamond", serif;
          font-size: 26px; letter-spacing: 0.34em; font-weight: 500;
        }
        .tm-brand-sub {
          margin-top: 4px; font-size: 9.5px; letter-spacing: 0.5em;
          text-transform: uppercase; color: var(--tm-gold);
        }

        .tm-nav-cats {
          max-width: 1400px; margin: 0 auto; padding: 6px 24px 14px;
          display: flex; justify-content: center; gap: 44px;
        }
        .tm-cat {
          font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--tm-muted); text-decoration: none; padding-bottom: 4px;
          border-bottom: 1px solid transparent; transition: color .25s, border-color .25s;
        }
        .tm-cat:hover, .tm-cat.is-active { color: var(--tm-gold); border-color: var(--tm-gold); }

        .tm-search-wrap { overflow: hidden; border-top: 1px solid var(--tm-line); }
        .tm-search-form {
          max-width: 1000px; margin: 0 auto; padding: 22px 24px;
          display: flex; align-items: center; gap: 14px;
        }
        .tm-search-icon { color: var(--tm-gold); font-size: 18px; }
        .tm-search-input {
          flex: 1; background: transparent; border: 0; outline: 0;
          color: var(--tm-fg); font-size: 22px; letter-spacing: 0.02em;
          font-family: "Playfair Display", serif;
          padding: 14px 6px; border-bottom: 1px solid var(--tm-line);
        }
        .tm-search-input::placeholder { color: var(--tm-muted); }
        .tm-search-close {
          background: transparent; border: 0; color: var(--tm-muted); cursor: pointer;
        }
        .tm-search-close:hover { color: var(--tm-gold); }

        .tm-drawer {
          position: fixed; inset: 0 30% 0 0; z-index: 80; background: var(--tm-bg);
          border-right: 1px solid var(--tm-line); padding: 18px 20px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .tm-drawer-top { display: flex; justify-content: space-between; align-items: center; }
        .tm-search-form--drawer { padding: 6px 0; }
        .tm-search-form--drawer .tm-search-input { font-size: 18px; }
        .tm-drawer-nav { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
        .tm-drawer-link {
          font-family: "Playfair Display", serif; font-size: 24px;
          color: var(--tm-fg); text-decoration: none;
        }
        .tm-drawer-link:hover { color: var(--tm-gold); }

        @media (max-width: 640px) {
          .tm-nav-inner { padding: 12px 16px; }
          .tm-brand-name { font-size: 20px; letter-spacing: 0.3em; }
          .tm-brand-sub { font-size: 8.5px; }
        }
      `}</style>
    </>
  );
}