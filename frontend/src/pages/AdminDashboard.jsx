// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function AdminDashboard(){
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadAll = async () => {
    try {
      const [pRes, uRes, oRes] = await Promise.all([api.get("/api/products?limit=50"), api.get("/api/users"), api.get("/api/orders")]);
      setProducts(pRes.data.products || []);
      setUsers(uRes.data || []);
      setOrders(oRes.data || []);
    } catch (err) {
      toast.error("Failed to load admin data");
    }
  };

  useEffect(()=>{ loadAll(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    try { await api.delete(`/api/products/${id}`); toast.success("Deleted"); loadAll(); } catch { toast.error("Delete failed"); }
  };

  const markDelivered = async (id) => {
    try { await api.put(`/api/orders/${id}/deliver`); toast.success("Marked delivered"); loadAll(); } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h3>Admin Dashboard</h3>

      <section className="mb-4">
        <h5>Products (sample)</h5>
        <div className="row g-3">
          {products.map(p => (
            <div className="col-md-3" key={p._id}>
              <div className="card p-2">
                <img src={p.image} alt={p.name} className="img-fluid mb-2" />
                <strong>{p.name}</strong>
                <p className="mb-1">₹{p.price}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-danger" onClick={()=>deleteProduct(p._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h5>Users</h5>
        <table className="table table-sm table-bordered">
          <thead><tr><th>Name</th><th>Email</th><th>Admin</th></tr></thead>
          <tbody>{users.map(u=>(<tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.isAdmin ? "Yes":"No"}</td></tr>))}</tbody>
        </table>
      </section>

      <section>
        <h5>Orders</h5>
        <table className="table table-sm table-bordered">
          <thead><tr><th>Order</th><th>User</th><th>Total</th><th>Paid</th><th>Delivered</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.user?.name}</td>
                <td>₹{o.totalPrice}</td>
                <td>{o.isPaid ? new Date(o.paidAt).toLocaleDateString() : "No"}</td>
                <td>{o.isDelivered ? new Date(o.deliveredAt).toLocaleDateString() : "No"}</td>
                <td><button className="btn btn-sm btn-success" onClick={()=>markDelivered(o._id)}>Deliver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
