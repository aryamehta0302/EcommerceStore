import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import HeroCarousel from "../components/HeroCarousel";
import CategoryStrip from "../components/CategoryStrip";
import DealOfTheDay from "../components/DealOfTheDay";
import BrandStrip from "../components/BrandStrip";
import TestimonialStrip from "../components/TestimonialStrip";
import Animated3DBackground from "../components/Animated3DBackground";
import { toast } from "react-toastify";

// Real stock footage/photos (Pexels, free to use). Swap for your own shoot
// whenever you have one — same slide shape (type/src/poster) works for both.
const heroSlides = [
  {
    id: "slide-1",
    type: "video",
    src: "/images/video1.mp4",
    poster:
      "https://images.pexels.com/videos/9512048/pexels-photo-9512048.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200",
    eyebrow: "New Season Edit",
    title: "Discover Your Style",
    text: "Premium fashion from Navsari, Gujarat — curated just for you.",
    cta: "Shop Now",
  },
  {
    id: "slide-2",
    type: "video",
    src: "/images/video2.mp4",
    poster:
      "https://images.pexels.com/videos/7305168/pexels-photo-7305168.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200",
    eyebrow: "Runway Edit",
    title: "Runway Looks, Real-World Ready",
    text: "Editorial-grade styles reworked for everyday wear — statement pieces without the drama.",
    cta: "Explore the Edit",
  },
  {
    id: "slide-3",
    type: "video",
    src: "/images/video3.mp4",
    poster:
      "https://images.pexels.com/videos/9512048/pexels-photo-9512048.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200",
    eyebrow: "Flash Sale",
    title: "Up to 50% Off Select Styles",
    text: "Limited-time savings across our most-loved pieces. Once they're gone, they're gone.",
    cta: "Shop the Sale",
  },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pageData, setPageData] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const pageNumber = params.get("pageNumber") || 1;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setShowAll(false);
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

  const handleCategorySelect = (categoryQuery) => {
    navigate(`/?keyword=${encodeURIComponent(categoryQuery)}`);
  };

  const scrollToTrending = () => {
    const target = document.getElementById("trending-products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 500, behavior: "smooth" });
  };


  const INITIAL_VISIBLE = 4;
  const visibleProducts = !keyword && !showAll ? products.slice(0, INITIAL_VISIBLE) : products;
  const hasMoreToShow = !keyword && !showAll && products.length > INITIAL_VISIBLE;

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
    <>
      
      {!keyword && (
        <HeroCarousel slides={heroSlides} onCtaClick={scrollToTrending} />
      )}

      <div className="container my-4">
        {/* Search-results banner stays inside the container as a contained card */}
        {keyword && (
          <motion.div
            className="tm-search-hero"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="tm-search-eyebrow">Search Results</span>
            <span className="tm-search-divider">—</span>
            <h1 className="tm-search-title">"{keyword}"</h1>
            {!loading && (
              <>
                <span className="tm-search-divider">—</span>
                <span className="tm-search-count">
                  {products.length} match{products.length === 1 ? "" : "es"}
                </span>
              </>
            )}
          </motion.div>
        )}

        <style>{`
          .tm-search-hero {
            display: flex;
            align-items: baseline;
            justify-content: center;
            flex-wrap: wrap;
            gap: 14px;
            padding: 28px 24px 32px;
            margin-bottom: 8px;
            border-bottom: 1px solid var(--tm-line);
          }
          .tm-search-eyebrow {
            font-size: 10px;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: var(--tm-gold);
          }
          .tm-search-divider { font-size: 13px; color: var(--tm-line); }
          .tm-search-title {
            font-family: "Playfair Display", serif;
            font-size: clamp(24px, 3.5vw, 34px);
            margin: 0;
            line-height: 1;
          }
          .tm-search-count {
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--tm-muted);
            white-space: nowrap;
          }
        `}</style>

        {!keyword && (
          <>
            <div className="mt-4">
              <CategoryStrip onSelect={handleCategorySelect} />
            </div>

            {!loading && products.length > 0 && (
              <DealOfTheDay products={products.slice(0, 3)} />
            )}
          </>
        )}

        {/* PRODUCTS HEADING */}
        {!keyword && !loading && products.length > 0 && (
          <motion.div
            id="trending-products"
            className="tm-trending-head"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div>
              <span className="tm-trending-eyebrow">Curated</span>
              <h2 className="tm-trending-title">Trending Pieces</h2>
              <p className="tm-trending-sub">Hand-picked collection for you</p>
            </div>
            {hasMoreToShow ? (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="tm-trending-action"
              >
                View All <span className="tm-trending-arrow">→</span>
              </button>
            ) : showAll ? (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="tm-trending-action tm-trending-action--muted"
              >
                Show less
              </button>
            ) : null}
          </motion.div>
        )}

        <style>{`
          .tm-trending-head {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--tm-line);
          }
          .tm-trending-eyebrow {
            display: block;
            font-size: 10px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: var(--tm-gold);
            margin-bottom: 8px;
          }
          .tm-trending-title {
            font-family: "Playfair Display", serif;
            font-size: clamp(24px, 3vw, 32px);
            margin: 0 0 6px;
          }
          .tm-trending-sub {
            margin: 0;
            font-size: 13px;
            color: var(--tm-muted);
          }
          .tm-trending-action {
            background: none;
            border: none;
            padding: 0;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--tm-gold);
            white-space: nowrap;
            cursor: pointer;
          }
          .tm-trending-action--muted { color: var(--tm-muted); }
          .tm-trending-arrow { font-size: 13px; }
        `}</style>

        <div className="position-relative">
          {!keyword && <Animated3DBackground opacity={0.14} />}
          <div className="position-relative" style={{ zIndex: 1 }}>
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
                  {visibleProducts.map((p, i) => (
                    <div key={p._id} className="col-6 col-md-4 col-lg-3">
                      <ProductCard product={p} index={i} />
                    </div>
                  ))}
                </div>

                {pageData.pages > 1 && (keyword || showAll) && (
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
        </div>
      </div>

    
      {!keyword && !loading && products.length > 0 && (
        <>
          <BrandStrip />
          <TestimonialStrip />
        </>
      )}
    </>
  );
}