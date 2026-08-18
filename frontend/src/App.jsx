import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/Wishlist";
import CategoryPage from "./pages/CategoryPage";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/orderDetails";
import AllProductsPage from "./pages/AllProductPages";
import ProductEditScreen from "./pages/ProductEditScreen";

// inside your <Routes>

export default function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/admin/product/:id/edit" element={<ProtectedRoute adminOnly><ProductEditScreen /></ProtectedRoute>} />

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
