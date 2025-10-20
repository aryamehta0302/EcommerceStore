import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import ToastContainer from "./components/ToastContainer.jsx";
import api, { setAuthToken } from "./api";

const u = JSON.parse(localStorage.getItem("userInfo"));
if (u && u.token) setAuthToken(u.token);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);
