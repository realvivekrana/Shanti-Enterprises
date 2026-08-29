// ============================================================
// SHANTI ENTERPRISES
// App Component
// Frontend Phase 7 - Authentication & Navigation
// ============================================================

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/common/ProtectedRoute";

// ============================================================
// PUBLIC PAGES
// ============================================================

import HomePage from "./pages/public/HomePage";
import CategoriesPage from "./pages/public/CategoriesPage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductDetailsPage from "./pages/public/ProductDetailsPage";
import CartPage from "./pages/public/CartPage";
import LoginPage from "./pages/public/LoginPage";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";

// ============================================================
// AUTH
// ============================================================

import RegisterPage from "./pages/auth/RegisterPage";

// ============================================================
// CUSTOMER PAGES
// ============================================================

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

// ============================================================
// CUSTOMER RFQ
// ============================================================

import RFQCreatePage from "./pages/customer/RFQCreatePage";
import RFQsPage from "./pages/customer/RFQsPage";
import RFQDetailsPage from "./pages/customer/RFQDetailsPage";

// ============================================================
// CUSTOMER QUOTATIONS
// ============================================================

import QuotationsPage from "./pages/customer/QuotationsPage";
import QuotationDetailsPage from "./pages/customer/QuotationDetailsPage";

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AddCategoryPage from "./pages/admin/AddCategoryPage";
import EditCategoryPage from "./pages/admin/EditCategoryPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminTestPage from "./pages/admin/AdminTestPage";

// ============================================================
// ADMIN RFQ
// ============================================================

import AdminRFQsPage from "./pages/admin/AdminRFQsPage";
import AdminRFQDetailsPage from "./pages/admin/AdminRFQDetailsPage";

// ============================================================
// ADMIN QUOTATIONS
// ============================================================

import AdminQuotationsPage from "./pages/admin/AdminQuotationsPage";
import AdminQuotationDetailsPage from "./pages/admin/AdminQuotationDetailsPage";
import CreateQuotationPage from "./pages/admin/CreateQuotationPage";

// ============================================================
// 404 PAGE
// ============================================================

function NotFoundPage() {
  return (
    <div className="app-page">

      <div className="page-header">

        <div>

          <span className="page-eyebrow">
            SHANTI ENTERPRISES
          </span>

          <h1>
            Page Not Found
          </h1>

          <p>
            The page you are looking
            for does not exist.
          </p>

        </div>

      </div>

      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >

        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <p
          style={{
            marginBottom: "24px",
          }}
        >
          Sorry, we couldn't find
          that page.
        </p>

        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
        >
          ← Go Back
        </button>

      </div>

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

        {/* ==================================================
            MAIN LAYOUT
            ================================================== */}

        <Route
          element={
            <MainLayout />
          }
        >

          {/* ==================================================
              PUBLIC ROUTES
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

          {/* ==================================================
              LOGIN
              ================================================== */}

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          {/* ==================================================
              REGISTER
              ================================================== */}

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          {/* ==================================================
              ADMIN LOGIN
              ================================================== */}

          <Route
            path="/admin/login"
            element={
              <LoginPage />
            }
          />

          {/* ==================================================
              UNAUTHORIZED
              ================================================== */}

          <Route
            path="/unauthorized"
            element={
              <UnauthorizedPage />
            }
          />

          {/* ==================================================
              CUSTOMER ONLY ROUTES
              ================================================== */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "customer",
                ]}
              />
            }
          >

            {/* CUSTOMER DASHBOARD */}

            <Route
              path="/dashboard"
              element={
                <CustomerDashboardPage />
              }
            />

            {/* CUSTOMER PROFILE */}

            <Route
              path="/profile"
              element={
                <ProfilePage />
              }
            />

            {/* CUSTOMER ADDRESSES */}

            <Route
              path="/addresses"
              element={
                <AddressesPage />
              }
            />

            {/* ==================================================
                CHECKOUT
                ================================================== */}

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

            {/* ==================================================
                PAYMENT
                ================================================== */}

            <Route
              path="/payment/:orderId"
              element={
                <PaymentPage />
              }
            />

            {/* ==================================================
                ORDER SUCCESS
                ================================================== */}

            <Route
              path="/order-success/:orderId"
              element={
                <OrderSuccessPage />
              }
            />

            {/* ==================================================
                ORDERS
                ================================================== */}

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

            {/* ==================================================
                CUSTOMER RFQ
                ================================================== */}

            <Route
              path="/rfq/create"
              element={
                <RFQCreatePage />
              }
            />

            <Route
              path="/rfqs"
              element={
                <RFQsPage />
              }
            />

            <Route
              path="/rfq/:rfqId"
              element={
                <RFQDetailsPage />
              }
            />

            {/* ==================================================
                CUSTOMER QUOTATIONS
                ================================================== */}

            <Route
              path="/quotations"
              element={
                <QuotationsPage />
              }
            />

            <Route
              path="/quotations/:quotationId"
              element={
                <QuotationDetailsPage />
              }
            />

            {/* ==================================================
                CUSTOMER TEST
                ================================================== */}

            <Route
              path="/customer/test"
              element={
                <CustomerTestPage />
              }
            />

          </Route>

          {/* ==================================================
              ADMIN ONLY ROUTES
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

            {/* ==================================================
                ADMIN DASHBOARD
                ================================================== */}

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

            {/* ==================================================
                ADMIN PRODUCTS
                ================================================== */}

            <Route
              path="/admin/products"
              element={
                <AdminProductsPage />
              }
            />

            <Route
              path="/admin/products/new"
              element={
                <AddProductPage />
              }
            />

            <Route
              path="/admin/products/:productId/edit"
              element={
                <EditProductPage />
              }
            />

            {/* ==================================================
                ADMIN CATEGORIES
                ================================================== */}

            <Route
              path="/admin/categories"
              element={
                <AdminCategoriesPage />
              }
            />

            <Route
              path="/admin/categories/new"
              element={
                <AddCategoryPage />
              }
            />

            <Route
              path="/admin/categories/:categoryId/edit"
              element={
                <EditCategoryPage />
              }
            />

            {/* ==================================================
                ADMIN ORDERS
                ================================================== */}

            <Route
              path="/admin/orders"
              element={
                <AdminOrdersPage />
              }
            />

            <Route
              path="/admin/orders/:orderId"
              element={
                <AdminOrderDetailsPage />
              }
            />

            {/* ==================================================
                ADMIN USERS
                ================================================== */}

            <Route
              path="/admin/users"
              element={
                <AdminUsersPage />
              }
            />

            {/* ==================================================
                ADMIN ANALYTICS
                ================================================== */}

            <Route
              path="/admin/analytics"
              element={
                <AdminAnalyticsPage />
              }
            />

            {/* ==================================================
                ADMIN PROFILE
                ================================================== */}

            <Route
              path="/admin/profile"
              element={
                <AdminProfilePage />
              }
            />

            {/* ==================================================
                ADMIN RFQ
                ================================================== */}

            <Route
              path="/admin/rfqs"
              element={
                <AdminRFQsPage />
              }
            />

            <Route
              path="/admin/rfqs/:rfqId"
              element={
                <AdminRFQDetailsPage />
              }
            />

            {/* ==================================================
                ADMIN QUOTATIONS
                ================================================== */}

            <Route
              path="/admin/quotations"
              element={
                <AdminQuotationsPage />
              }
            />

            <Route
              path="/admin/quotations/create"
              element={
                <CreateQuotationPage />
              }
            />

            <Route
              path="/admin/quotations/:quotationId"
              element={
                <AdminQuotationDetailsPage />
              }
            />

            {/* ==================================================
                ADMIN TEST
                ================================================== */}

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