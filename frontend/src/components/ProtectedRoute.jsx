import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user) {
    // not logged in → go to login
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }

  // ✅ everything okay — render child component
  return children;
}
