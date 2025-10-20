// frontend/src/api.js
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const api = axios.create({ baseURL });

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;
