// src/services/api.js

import axios from "axios";

// =========================
// 🌐 BASE URL (SAFE)
// =========================
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://eoffice-97mv.onrender.com";

// =========================
// 🚀 AXIOS INSTANCE
// =========================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 🔥 important (Render cold start)
});

// =========================
// 🔐 GET TOKEN SAFELY
// =========================
const getToken = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    const user = JSON.parse(rawUser);

    // ✅ support both formats
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
      error.message;

    console.error("API Error:", message);

    // 🔥 Handle unauthorized
    if (status === 401) {
      localStorage.removeItem("user");

      // avoid reload loop
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // 🔥 Handle network error (very common on Render cold start)
    if (!error.response) {
      console.error("Network error / backend may be sleeping");
    }

    return Promise.reject(error);
  }
);

// =========================
// 📦 EXPORT
// =========================
export default API;