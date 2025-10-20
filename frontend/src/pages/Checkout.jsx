import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <form className="col-md-6 mx-auto" onSubmit={handleNext}>
      <h3>Checkout</h3>
      <div className="mb-3">
        <label>Address</label>
        <textarea className="form-control" required />
      </div>
      <div className="mb-3">
        <label>City</label>
        <input className="form-control" required />
      </div>
      <div className="mb-3">
        <label>Pin Code</label>
        <input className="form-control" required />
      </div>
      <button type="submit" className="btn btn-success w-100">Continue to Payment</button>
    </form>
  );
}
