import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import DarkToggle from "./DarkToggle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const navigate = useNavigate();

  // Load user
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo"));
    setUser(stored);
  }, []);

  // 🔍 Live Search Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await api.get(`/api/products?keyword=${search}`);
        setSuggestions(data.products.slice(0, 5));
      } catch (err) {
        console.error("Search error:", err);
      }
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
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm py-2">
        <div className="container-fluid px-3">
          {/* BRAND */}
          <Link
            to="/"
            className="navbar-brand fw-bold fs-5 d-flex align-items-center"
            onClick={() => setNavExpanded(false)}
          >
            🛍️ TrendMart
          </Link>

          {/* TOGGLER */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setNavExpanded(!navExpanded)}
            aria-expanded={navExpanded}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* COLLAPSE AREA */}
          <div
            className={`collapse navbar-collapse ${navExpanded ? "show" : ""}`}
            id="mainNav"
          >
            {/* SEARCH BAR */}
            <form
              className="d-flex mx-lg-auto mt-3 mt-lg-0 position-relative"
              style={{ width: "100%", maxWidth: "500px" }}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  paddingRight: "40px",
                }}
              />
              <button className="btn btn-primary ms-2" type="submit">
                <i className="bi bi-search"></i>
              </button>

              {/* Live Search Suggestion Box */}
              {suggestions.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 shadow"
                  style={{
                    top: "105%",
                    zIndex: 1050,
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {suggestions.map((s) => (
                    <li
                      key={s._id}
                      className="list-group-item d-flex align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/product/${s._id}`);
                        setSuggestions([]);
                        setSearch("");
                        setNavExpanded(false);
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.image || "https://via.placeholder.com/40"}
                          alt={s.name}
                          width="40"
                          height="40"
                          style={{
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                        <span className="small fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                          {s.name}
                        </span>
                      </div>
                      <span className="text-primary small fw-semibold">
                        ₹{s.price}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            {/* RIGHT SIDE LINKS */}
            <ul className="navbar-nav ms-auto mt-3 mt-lg-0 align-items-lg-center">
              {user && (
                <li className="nav-item me-lg-3">
                  <Link
                    className="nav-link"
                    to="/cart"
                    onClick={() => setNavExpanded(false)}
                  >
                    <i className="bi bi-cart"></i> Cart
                  </Link>
                </li>
              )}

              {/* USER / ADMIN DROPDOWN */}
              {user ? (
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link text-light dropdown-toggle"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <i className="bi bi-person-circle"></i>{" "}
                    {user.name || "User"}
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end show mt-2">
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/profile"
                          onClick={() => {
                            setDropdownOpen(false);
                            setNavExpanded(false);
                          }}
                        >
                          Profile
                        </Link>
                      </li>
                      {user.isAdmin && (
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/admin"
                            onClick={() => {
                              setDropdownOpen(false);
                              setNavExpanded(false);
                            }}
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li className="nav-item mt-2 mt-lg-0">
                  <Link
                    to="/login"
                    className="btn btn-outline-light ms-lg-2 fw-semibold w-100"
                    onClick={() => setNavExpanded(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}

              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <DarkToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* SPACER BELOW NAVBAR */}
      <div style={{ height: "80px" }}></div>
    </>
  );
}
