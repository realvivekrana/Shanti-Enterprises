// ============================================================
// SHANTI ENTERPRISES
// App Component
// Frontend Phase 5 - Admin
// ============================================================

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/public/HomePage";

import CategoriesPage from "./pages/public/CategoriesPage";

import ProductsPage from "./pages/public/ProductsPage";

import ProductDetailsPage from "./pages/public/ProductDetailsPage";

import CartPage from "./pages/public/CartPage";

import LoginPage from "./pages/public/LoginPage";

import UnauthorizedPage from "./pages/public/UnauthorizedPage";

import CheckoutPage from "./pages/customer/CheckoutPage";

import AddressPage from "./pages/customer/AddressPage";

import OrderSummaryPage from "./pages/customer/OrderSummaryPage";

import PaymentPage from "./pages/customer/PaymentPage";

import OrderSuccessPage from "./pages/customer/OrderSuccessPage";

import OrdersPage from "./pages/customer/OrdersPage";

import OrderDetailsPage from "./pages/customer/OrderDetailsPage";

import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";

import ProfilePage from "./pages/customer/ProfilePage";

import AddressesPage from "./pages/customer/AddressesPage";

import CustomerTestPage from "./pages/customer/CustomerTestPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import AdminTestPage from "./pages/admin/AdminTestPage";

// ============================================================
// 404
// ============================================================

function NotFoundPage() {
  return (
    <div>
      <h1>
        404
      </h1>

      <p>
        Page not found.
      </p>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          element={
            <MainLayout />
          }
        >

          {/* ==================================================
              PUBLIC
              ================================================== */}

          <Route
            path="/"
            element={
              <HomePage />
            }
          />

          <Route
            path="/categories"
            element={
              <CategoriesPage />
            }
          />

          <Route
            path="/products"
            element={
              <ProductsPage />
            }
          />

          <Route
            path="/products/:productId"
            element={
              <ProductDetailsPage />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/unauthorized"
            element={
              <UnauthorizedPage />
            }
          />

          {/* ==================================================
              CUSTOMER
              ================================================== */}

          <Route
            element={
              <ProtectedRoute />
            }
          >

            <Route
              path="/dashboard"
              element={
                <CustomerDashboardPage />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfilePage />
              }
            />

            <Route
              path="/addresses"
              element={
                <AddressesPage />
              }
            />

            <Route
              path="/checkout"
              element={
                <CheckoutPage />
              }
            />

            <Route
              path="/checkout/address"
              element={
                <AddressPage />
              }
            />

            <Route
              path="/checkout/summary"
              element={
                <OrderSummaryPage />
              }
            />

            <Route
              path="/payment/:orderId"
              element={
                <PaymentPage />
              }
            />

            <Route
              path="/order-success/:orderId"
              element={
                <OrderSuccessPage />
              }
            />

            <Route
              path="/orders"
              element={
                <OrdersPage />
              }
            />

            <Route
              path="/orders/:orderId"
              element={
                <OrderDetailsPage />
              }
            />

            <Route
              path="/customer/test"
              element={
                <CustomerTestPage />
              }
            />

          </Route>

          {/* ==================================================
              ADMIN ONLY
              ================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                ]}
              />
            }
          >

            {/* ADMIN DASHBOARD */}

            <Route
              path="/admin"
              element={
                <AdminDashboardPage />
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <AdminDashboardPage />
              }
            />

            {/* ADMIN TEST */}

            <Route
              path="/admin/test"
              element={
                <AdminTestPage />
              }
            />

          </Route>

          {/* ==================================================
              404
              ================================================== */}

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;