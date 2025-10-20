import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      className="btn btn-outline-light btn-sm fw-semibold"
      onClick={toggleTheme}
      style={{
        fontSize: "0.9rem",
        borderRadius: "8px",
        padding: "6px 12px",
        minWidth: "120px",
      }}
    >
      {theme === "dark" ? "Dark Mode: ON" : "Dark Mode: OFF"}
    </button>
  );
}
