// src/services/api.js

import axios from "axios";

// =========================
// 🌐 BASE URL (SAFE)
// =========================
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "").trim() ||
  "https://eoffice-97mv.onrender.com";

// Debug (optional)
console.log("API BASE URL:", BASE_URL);

// =========================
// 🚀 AXIOS INSTANCE
// =========================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // increased for Render cold start
});

// =========================
// 🔐 GET TOKEN SAFELY
// =========================
const getToken = () => {
  try {
    const rawUser = localStorage.getItem("user");

    if (!rawUser || rawUser === "undefined") return null;

    const user = JSON.parse(rawUser);

    return user?.access_token || user?.token || null;
  } catch (err) {
    console.error("Token parse error:", err);
    return null;
  }
};

// =========================
// 🔐 REQUEST INTERCEPTOR
// =========================
API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// ❌ RESPONSE INTERCEPTOR
// =========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", message);

    // =========================
    // 🔐 HANDLE 401
    // =========================
    if (status === 401) {
      localStorage.removeItem("user");

      // safer redirect
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    // =========================
    // 🌐 NETWORK ERROR (Render Sleep)
    // =========================
    if (!error.response) {
      console.error("⚠️ Backend may be sleeping (Render cold start)");
    }

    return Promise.reject(error);
  }
);

// =========================
// 📦 EXPORT
// =========================
export default API;