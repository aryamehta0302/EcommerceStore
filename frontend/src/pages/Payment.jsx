import { useState } from "react";

export default function Payment() {
  const [method, setMethod] = useState("upi");
  const [confirmed, setConfirmed] = useState(false);
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const total = JSON.parse(localStorage.getItem("cart") || "[]")
    .reduce((a, i) => a + i.price * i.qty, 0);

  const handlePayment = () => {
    if (method === "cod") {
      setConfirmed(true);
    } else {
      alert("📱 Please scan the QR code and complete your payment!");
    }
  };

  return (
    <div className="container text-center mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="fw-bold text-primary mb-3">Payment Options</h3>
        <h5 className="mb-3">Total Amount: ₹{total.toFixed(2)}</h5>

        <div className="my-3">
          <label className="me-3">
            <input
              type="radio"
              value="upi"
              checked={method === "upi"}
              onChange={(e) => setMethod(e.target.value)}
            />{" "}
            UPI / GPay
          </label>
          <label className="me-3">
            <input
              type="radio"
              value="card"
              checked={method === "card"}
              onChange={(e) => setMethod(e.target.value)}
            />{" "}
            Visa / Card
          </label>
          <label>
            <input
              type="radio"
              value="cod"
              checked={method === "cod"}
              onChange={(e) => setMethod(e.target.value)}
            />{" "}
            Cash on Delivery
          </label>
        </div>

        {method === "upi" && (
          <>
            <p>Scan this QR to pay via GPay / BHIM:</p>
            <img
              src={`${backendUrl}/uploads/gpay-qr.jpg`}
              alt="GPay QR Code"
              width="200"
              className="rounded shadow-sm border"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200?text=QR+Not+Found";
              }}
            />
          </>
        )}

        <button className="btn btn-success mt-4" onClick={handlePayment}>
          Confirm Payment
        </button>

        {confirmed && (
          <div className="alert alert-success mt-3">
            ✅ Order placed successfully!<br />
            Expected delivery:{" "}
            <strong>
              {new Date(Date.now() + 5 * 86400000).toDateString()}
            </strong>{" "}
            (from Navsari, Gujarat)
          </div>
        )}
      </div>
    </div>
  );
}
