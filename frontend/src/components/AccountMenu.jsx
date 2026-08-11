import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegUser, FaBoxOpen, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function AccountMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setAuthToken(null);
    window.dispatchEvent(new Event("auth:change")); // triggers Navbar/Wishlist/Cart to reload per-user data
    setOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("")
    : null;

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="tm-account" ref={ref}>
      <button
        className="tm-icon-btn"
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        {initials ? <span className="tm-initials">{initials}</span> : <FaRegUser />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="tm-account-popup"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="tm-account-head">
              <FaUserCircle size={28} />
              <div>
                <div className="tm-account-name">{user?.name || "Account"}</div>
                <div className="tm-account-email">{user?.email}</div>
              </div>
            </div>

            <div className="tm-account-divider" />

            <button className="tm-account-item" onClick={() => go("/profile")}>
              <FaRegUser /> Profile
            </button>
            {!user?.isAdmin && (
              <button className="tm-account-item" onClick={() => go("/orders")}>
                <FaBoxOpen /> Order History
              </button>
            )}
            {user?.isAdmin && (
              <button className="tm-account-item" onClick={() => go("/admin")}>
                <FaBoxOpen /> Admin Dashboard
              </button>
            )}

            <div className="tm-account-divider" />

            <button className="tm-account-item tm-account-danger" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tm-account { position: relative; }
        .tm-account-popup {
          position: absolute; top: 48px; right: 0; z-index: 90;
          width: 240px; background: var(--tm-card); border: 1px solid var(--tm-line);
          border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.28);
          padding: 14px; display: flex; flex-direction: column;
        }
        .tm-account-head { display: flex; align-items: center; gap: 10px; padding: 2px 4px 10px; color: var(--tm-fg); }
        .tm-account-name { font-weight: 600; font-size: 14px; }
        .tm-account-email { font-size: 11px; color: var(--tm-muted); }
        .tm-account-divider { height: 1px; background: var(--tm-line); margin: 6px 0; }
        .tm-account-item {
          display: flex; align-items: center; gap: 10px;
          background: transparent; border: 0; text-align: left;
          padding: 10px 8px; border-radius: 8px; font-size: 13.5px;
          color: var(--tm-fg); cursor: pointer; transition: background .2s, color .2s;
        }
        .tm-account-item:hover { background: var(--tm-line); color: var(--tm-gold); }
        .tm-account-danger:hover { color: #e5484d; }
      `}</style>
    </div>
  );
}