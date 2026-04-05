import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// =========================
// 🔐 SAFE ROOT ELEMENT
// =========================
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// =========================
// 🚀 RENDER APP
// =========================
createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);