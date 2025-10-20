import { useEffect, useState } from "react";
import api, { setAuthToken } from "../api";
import { toast } from "react-toastify";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [addresses, setAddresses] = useState([
    { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" },
  ]);

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" },
    ]);
  };

  const removeAddress = (i) => {
    setAddresses(addresses.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      window.location.href = "/login?redirect=/profile";
      return;
    }
    setAuthToken(userInfo.token);
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setUser(data);
        setForm({
          name: data.name,
          phone: data.phone || "",
          password: "",
          confirmPassword: "",
        });
        setAddresses(data.addresses?.length ? data.addresses : addresses);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await api.put("/api/users/profile", {
        name: form.name,
        phone: form.phone,
        password: form.password || undefined,
        addresses,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setAuthToken(data.token);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "700px" }}>
        <h3 className="text-center fw-bold text-primary mb-4">
          <i className="bi bi-person-circle me-2"></i>My Profile
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <hr className="my-4" />
          <h5 className="fw-bold text-secondary">Addresses</h5>

          {addresses.map((addr, i) => (
            <div key={i} className="border rounded p-3 mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h6>Address #{i + 1}</h6>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeAddress(i)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="row g-2 mt-2">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    value={addr.fullName}
                    onChange={(e) => handleAddressChange(i, "fullName", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Phone"
                    value={addr.phone}
                    onChange={(e) => handleAddressChange(i, "phone", e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <input
                    className="form-control"
                    placeholder="Address Line 1"
                    value={addr.addressLine1}
                    onChange={(e) => handleAddressChange(i, "addressLine1", e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <input
                    className="form-control"
                    placeholder="Address Line 2"
                    value={addr.addressLine2}
                    onChange={(e) => handleAddressChange(i, "addressLine2", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="City"
                    value={addr.city}
                    onChange={(e) => handleAddressChange(i, "city", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="State"
                    value={addr.state}
                    onChange={(e) => handleAddressChange(i, "state", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Pincode"
                    value={addr.postalCode}
                    onChange={(e) => handleAddressChange(i, "postalCode", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline-secondary mb-3" onClick={addAddress}>
            + Add New Address
          </button>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
