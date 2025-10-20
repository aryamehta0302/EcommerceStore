import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item._id === id ? { ...item, qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.info("Item removed from cart");
  };

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0).toFixed(2);

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {cart.map((item) => (
              <div
                key={item._id}
                className="card mb-3 shadow-sm border-0"
                style={{ borderRadius: "12px" }}
              >
                <div className="row g-0 align-items-center">
                  <div className="col-3 col-md-2 text-center p-2">
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: "90px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-9 col-md-10">
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="text-start">
                        <h6 className="card-title fw-semibold mb-1">
                          {item.name}
                        </h6>
                        <p className="text-muted small mb-1">{item.brand}</p>
                        <p className="fw-bold text-primary mb-0">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="d-flex align-items-center mt-2 mt-md-0">
                        <div className="input-group input-group-sm me-3" style={{ width: "90px" }}>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQty(item._id, item.qty - 1)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(item._id, Number(e.target.value))
                            }
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQty(item._id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeItem(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0 p-3" style={{ borderRadius: "12px" }}>
              <h5 className="fw-bold mb-3 text-center">🧾 Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Items:</span>
                <span>{cart.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </div>
              <hr />
              <h5 className="fw-bold text-success d-flex justify-content-between">
                <span>Total:</span>
                <span>₹{total}</span>
              </h5>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
