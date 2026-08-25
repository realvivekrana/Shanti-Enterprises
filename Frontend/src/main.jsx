// ============================================================
// SHANTI ENTERPRISES
// Frontend Entry Point
// ============================================================

import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import App from "./App";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  CartProvider,
} from "./context/CartContext";

import {
  AddressProvider,
} from "./context/AddressContext";

import ErrorBoundary from "./components/common/ErrorBoundary";

// ============================================================
// GLOBAL CSS
// ============================================================

import "./index.css";

import "./App.css";

// ============================================================
// ROOT
// ============================================================

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>

    <ErrorBoundary>

      <AuthProvider>

        <CartProvider>

          <AddressProvider>

            <App />

          </AddressProvider>

        </CartProvider>

      </AuthProvider>

    </ErrorBoundary>

  </StrictMode>
);