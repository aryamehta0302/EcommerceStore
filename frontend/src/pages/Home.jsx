import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

export default function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [pageData, setPageData] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Get keyword from URL (like ?keyword=shoes)
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

  return (
    <div className="container my-4">
      <div className="bg-light p-4 rounded mb-4 text-center shadow-sm">
        <h1 className="fw-bold mb-1">
          {keyword ? `Search results for "${keyword}"` : "Discover Your Style"}
        </h1>
        <p className="text-muted">
          {keyword
            ? "Explore the best matches for your search."
            : "Premium fashion from Navsari, Gujarat."}
        </p>
      </div>

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <>
          <div className="row g-4">
            {products.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {pageData.pages > 1 && (
            <div className="mt-4 d-flex justify-content-center">
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
