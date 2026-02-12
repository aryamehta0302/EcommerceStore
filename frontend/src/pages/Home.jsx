import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pageData, setPageData] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const pageNumber = params.get("pageNumber") || 1;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      setProducts(data.products);
      setPageData({ page: data.page, pages: data.pages });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, pageNumber]);

  const SkeletonCard = () => (
    <div className="skeleton-card solid-card h-100">
      <div className="skeleton skeleton-img"></div>
      <div className="p-3">
        <div className="skeleton skeleton-line" style={{ width: "80%" }}></div>
        <div className="skeleton skeleton-line short" style={{ width: "40%" }}></div>
        <div className="skeleton skeleton-line" style={{ width: "55%", marginTop: "14px" }}></div>
      </div>
    </div>
  );

  return (
    <div className="container my-4">
      {/* HERO */}
      <motion.div
        className="tm-hero text-center"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {keyword ? (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Results for "{keyword}"
            </motion.h1>
            <motion.p
              className="mb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore the best matches for your search
            </motion.p>
          </>
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Discover Your <span style={{ fontStyle: "italic" }}>Style</span>
            </motion.h1>
            <motion.p
              className="mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Premium fashion from Navsari, Gujarat — curated just for you.
            </motion.p>
            <motion.button
              className="btn btn-sm px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "50px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              Shop Now <i className="bi bi-arrow-down ms-1"></i>
            </motion.button>
          </>
        )}
      </motion.div>

      {/* PRODUCTS HEADING */}
      {!keyword && !loading && products.length > 0 && (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Trending <span className="text-gradient">Products</span>
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Hand-picked collection for you
          </p>
        </motion.div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="row g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          className="text-center py-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🔍</div>
          <h5 className="fw-bold" style={{ color: "var(--text-secondary)" }}>No products found</h5>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Try a different search or browse our collection.</p>
          <button className="btn-gradient" onClick={() => navigate("/")}>
            <i className="bi bi-arrow-left me-2"></i>Back to Home
          </button>
        </motion.div>
      ) : (
        <>
          <div className="row g-4">
            {products.map((p, i) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>

          {pageData.pages > 1 && (
            <div className="mt-5">
              <Pagination
                page={pageData.page}
                pages={pageData.pages}
                onChange={(p) => (window.location.href = `/?keyword=${keyword}&pageNumber=${p}`)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
