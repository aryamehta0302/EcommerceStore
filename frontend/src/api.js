// frontend/src/api.js
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL });

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

// Rehydrate auth on page load / refresh
try {
  const stored = JSON.parse(localStorage.getItem("userInfo"));
  if (stored?.token) {
    setAuthToken(stored.token);
  }
} catch {
  // ignore malformed/missing data
}

export default api;