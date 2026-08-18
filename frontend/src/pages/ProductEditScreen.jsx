import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

export default function ProductEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    countInStock: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setFormData({
          name: data.name || "",
          price: data.price ?? "",
          image: data.image || "",
          brand: data.brand || "",
          countInStock: data.countInStock ?? "",
          description: data.description || "",
        });
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put(`/api/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });

      // Sanity check: confirm the server actually returned the updated
      // product (not just a 200 with an empty/unexpected body). If this
      // fails, the PUT "succeeded" over HTTP but didn't really persist.
      if (!data || !data._id) {
        toast.error("Server did not confirm the update — please check backend logs");
        setSaving(false);
        return;
      }

      toast.success("Product updated");
      // `replace: true` avoids leaving the edit page in browser history,
      // and passing state forces AdminDashboard's effect (keyed on
      // location.key) to refire and refetch fresh data.
      navigate("/admin", { replace: true, state: { refreshedAt: Date.now() } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="tm-loader" style={{ margin: "0 auto" }}></div>
        <style>{`
          .tm-loader {
            width: 28px; height: 28px;
            border: 2px solid var(--tm-line, #ddd);
            border-top-color: var(--tm-gold, #b8963e);
            border-radius: 50%;
            animation: tm-spin 0.8s linear infinite;
          }
          @keyframes tm-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: 560 }}>
      <h1
        className="mb-4"
        style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(24px, 3vw, 32px)" }}
      >
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label">Product name</label>
          <input
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <label className="form-label">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <label className="form-label">Image URL</label>
          <input
            name="image"
            placeholder="https://..."
            value={formData.image}
            onChange={handleChange}
            className="form-control"
            required
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              style={{ marginTop: 10, maxHeight: 140, objectFit: "cover" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        <div>
          <label className="form-label">Brand</label>
          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <label className="form-label">Stock quantity</label>
          <input
            name="countInStock"
            type="number"
            placeholder="Stock quantity"
            value={formData.countInStock}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}