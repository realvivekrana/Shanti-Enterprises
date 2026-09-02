// ============================================================
// SHANTI ENTERPRISES
// App Component
// Mobile First • Premium Responsive UI
// ============================================================

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

import MainLayout from "./components/layout/MainLayout";

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
// CUSTOMER WISHLIST / NOTIFICATIONS / RETURNS / INVOICES
// ============================================================

import WishlistPage from "./pages/customer/WishlistPage";
import NotificationsPage from "./pages/customer/NotificationsPage";
import ReturnsPage from "./pages/customer/ReturnsPage";
import InvoicesPage from "./pages/customer/InvoicesPage";
import ShipmentTrackingPage from "./pages/customer/ShipmentTrackingPage";

import BulkQuotesPage from "./pages/customer/BulkQuotesPage";

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
// ADMIN INVENTORY / SHIPMENTS / REPORTS
// ============================================================

import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminShipmentsPage from "./pages/admin/AdminShipmentsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";

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
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

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
            The page you are looking for
            does not exist or may have been moved.
          </p>

        </div>

      </div>

      <section className="card">

        <div
          style={{
            minHeight: "360px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >

          {/* ==================================================
              ICON
              ================================================== */}

          <div
            style={{
              width: "72px",
              height: "72px",
              display: "grid",
              placeItems: "center",
              borderRadius: "20px",
              marginBottom: "20px",
              background:
                "linear-gradient(135deg, rgba(20,184,166,.12), rgba(14,165,233,.12))",
              color: "#0f9386",
            }}
          >
            <SearchX
              size={34}
              strokeWidth={1.8}
            />
          </div>

          {/* ==================================================
              404
              ================================================== */}

          <div
            style={{
              fontSize: "clamp(56px, 15vw, 96px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              background:
                "linear-gradient(135deg, #14b8a6, #0ea5e9, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "14px",
            }}
          >
            404
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: 800,
            }}
          >
            Sorry, we couldn't find that page.
          </h2>

          <p
            style={{
              maxWidth: "480px",
              margin: "0 auto 24px",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            The page you're looking for may have
            been removed, renamed, or is temporarily
            unavailable.
          </p>

          {/* ==================================================
              ACTIONS
              ================================================== */}

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "360px",
            }}
          >

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGoHome}
            >
              <Home size={17} />
              Go to Home
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGoBack}
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

          </div>

        </div>

      </section>

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
                WISHLIST
                ================================================== */}

            <Route
              path="/wishlist"
              element={
                <WishlistPage />
              }
            />

            {/* ==================================================
                NOTIFICATIONS
                ================================================== */}

            <Route
              path="/notifications"
              element={
                <NotificationsPage />
              }
            />

            {/* ==================================================
                RETURNS
                ================================================== */}

            <Route
              path="/returns"
              element={
                <ReturnsPage />
              }
            />

            {/* ==================================================
                INVOICES
                ================================================== */}

            <Route
              path="/invoices"
              element={
                <InvoicesPage />
              }
            />

            {/* ==================================================
                SHIPMENTS / TRACKING
                ================================================== */}

            <Route
              path="/shipments"
              element={
                <ShipmentTrackingPage />
              }
            />

            <Route
              path="/shipments/:shipmentId"
              element={
                <ShipmentTrackingPage />
              }
            />

            {/* ==================================================
                BULK QUOTES
                ================================================== */}

            <Route
              path="/bulk-quotes"
              element={
                <BulkQuotesPage />
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
                ADMIN INVENTORY
                ================================================== */}

            <Route
              path="/admin/inventory"
              element={
                <AdminInventoryPage />
              }
            />

            {/* ==================================================
                ADMIN SHIPMENTS
                ================================================== */}

            <Route
              path="/admin/shipments"
              element={
                <AdminShipmentsPage />
              }
            />

            <Route
              path="/admin/shipments/:shipmentId"
              element={
                <AdminShipmentsPage />
              }
            />

            {/* ==================================================
                ADMIN REPORTS
                ================================================== */}

            <Route
              path="/admin/reports"
              element={
                <AdminReportsPage />
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