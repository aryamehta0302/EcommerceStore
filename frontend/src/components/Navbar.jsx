import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import DarkToggle from "./DarkToggle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Load user
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo"));
    setUser(stored);
  }, []);

  // Cart count
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((a, i) => a + (i.qty || 1), 0));
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => { window.removeEventListener("storage", updateCount); clearInterval(interval); };
  }, []);

  // Live search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) { setSuggestions([]); return; }
      try {
        const { data } = await api.get(`/api/products?keyword=${search}`);
        setSuggestions(data.products.slice(0, 5));
      } catch (err) { console.error("Search error:", err); }
    };
    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?keyword=${encodeURIComponent(search)}`);
      setSuggestions([]);
      setNavExpanded(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setNavExpanded(false);
    navigate("/");
  };

  return (
    <nav className="tm-navbar d-flex align-items-center">
      <div className="container-fluid px-3 d-flex align-items-center justify-content-between">
        {/* BRAND */}
        <Link to="/" className="navbar-brand text-decoration-none" onClick={() => setNavExpanded(false)}>
          🛍️ TrendMart
        </Link>

        {/* TOGGLER */}
        <button
          className="d-lg-none btn btn-link text-light p-0"
          onClick={() => setNavExpanded(!navExpanded)}
          aria-label="Toggle navigation"
          style={{ fontSize: "1.4rem" }}
        >
          <i className={`bi ${navExpanded ? "bi-x-lg" : "bi-list"}`}></i>
        </button>

        {/* DESKTOP NAV */}
        <div className="d-none d-lg-flex align-items-center flex-grow-1 ms-4">
          {/* SEARCH */}
          <form className="position-relative flex-grow-1" style={{ maxWidth: "480px" }} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="tm-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: "90px" }}
            />
            <button className="tm-search-btn" type="submit">
              <i className="bi bi-search me-1"></i> Search
            </button>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  className="tm-suggestions"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((s) => (
                    <div
                      key={s._id}
                      className="tm-suggestion-item"
                      onClick={() => {
                        navigate(`/product/${s._id}`);
                        setSuggestions([]);
                        setSearch("");
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.image || "https://via.placeholder.com/40"}
                          alt={s.name}
                          width="36" height="36"
                          style={{ borderRadius: "8px", objectFit: "cover" }}
                        />
                        <span style={{ fontSize: "0.88rem", fontWeight: 500, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.name}
                        </span>
                      </div>
                      <span className="text-gradient" style={{ fontWeight: 700, fontSize: "0.9rem" }}>₹{s.price}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* RIGHT LINKS */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {user && (
              <Link
                className="nav-link position-relative"
                to="/cart"
                style={{ color: "#d1d5db", fontSize: "1.2rem" }}
              >
                <i className="bi bi-bag"></i>
                {cartCount > 0 && <span className="tm-cart-badge">{cartCount}</span>}
              </Link>
            )}

            {user ? (
              <div className="position-relative">
                <button
                  className="btn btn-link text-light text-decoration-none d-flex align-items-center gap-1"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ fontSize: "0.9rem", fontWeight: 500 }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: "1.1rem" }}></i>
                  {user.name || "User"}
                  <i className="bi bi-chevron-down" style={{ fontSize: "0.7rem" }}></i>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="tm-dropdown position-absolute end-0 mt-2"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        className="tm-dropdown-item"
                        to="/profile"
                        onClick={() => { setDropdownOpen(false); setNavExpanded(false); }}
                      >
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                      {user.isAdmin && (
                        <Link
                          className="tm-dropdown-item"
                          to="/admin"
                          onClick={() => { setDropdownOpen(false); setNavExpanded(false); }}
                        >
                          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                        </Link>
                      )}
                      <div className="tm-dropdown-divider"></div>
                      <button
                        className="tm-dropdown-item"
                        onClick={handleLogout}
                        style={{ color: "var(--danger)" }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-gradient"
                onClick={() => setNavExpanded(false)}
                style={{ fontSize: "0.85rem", padding: "8px 20px" }}
              >
                Sign In
              </Link>
            )}

            <DarkToggle />
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {navExpanded && (
          <motion.div
            className="d-lg-none position-fixed"
            style={{ top: "var(--navbar-h)", left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1090 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNavExpanded(false)}
          >
            <motion.div
              className="p-4"
              style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile search */}
              <form className="position-relative mb-3" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ borderRadius: "50px", padding: "10px 18px" }}
                />
              </form>

              <div className="d-flex flex-column gap-2">
                {user && (
                  <Link className="btn btn-ghost w-100" to="/cart" onClick={() => setNavExpanded(false)}>
                    <i className="bi bi-bag me-2"></i>Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                )}
                {user ? (
                  <>
                    <Link className="btn btn-ghost w-100" to="/profile" onClick={() => setNavExpanded(false)}>
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                    {user.isAdmin && (
                      <Link className="btn btn-ghost w-100" to="/admin" onClick={() => setNavExpanded(false)}>
                        <i className="bi bi-speedometer2 me-2"></i>Admin
                      </Link>
                    )}
                    <button className="btn btn-danger-soft w-100" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </>
                ) : (
                  <Link className="btn-gradient w-100 text-center d-block" to="/login" onClick={() => setNavExpanded(false)}>
                    Sign In
                  </Link>
                )}
                <div className="mt-2 d-flex justify-content-center">
                  <DarkToggle />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
