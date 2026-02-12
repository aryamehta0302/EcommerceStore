import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DarkToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <button
      className={`tm-dark-toggle ${isDark ? "dark" : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="toggle-knob"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
    </button>
  );
}
