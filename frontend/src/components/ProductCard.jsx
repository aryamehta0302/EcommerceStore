import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card h-100 border-0 shadow-sm product-card">
      <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
        <img
          src={product.image}
          className="card-img-top p-2 rounded"
          alt={product.name}
          style={{ height: "250px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h6 className="fw-semibold text-truncate">{product.name}</h6>
          <p className="text-muted small mb-1">{product.brand}</p>
          <h5 className="fw-bold text-primary mb-0">₹{product.price}</h5>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="text-warning small">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </div>
            <small className="text-muted">({product.numReviews || 0})</small>
          </div>
        </div>
      </Link>
    </div>
  );
}
