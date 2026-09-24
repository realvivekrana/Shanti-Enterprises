// ============================================================
// SHANTI ENTERPRISES
// App Component
// Mobile First • Premium Responsive UI
// ============================================================

import {
  lazy,
  Suspense,
} from "react";

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
import CustomerDashboardLayout from "./layouts/CustomerDashboardLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Loading from "./components/common/Loading";

// ============================================================
// PUBLIC PAGES
// ============================================================

const HomePage = lazy(() => import("./pages/public/HomePage"));
const CategoriesPage = lazy(() => import("./pages/public/CategoriesPage"));
const ProductsPage = lazy(() => import("./pages/public/ProductsPage"));
const ProductDetailsPage = lazy(() => import("./pages/public/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/public/CartPage"));
const LoginPage = lazy(() => import("./pages/public/LoginPage"));
const UnauthorizedPage = lazy(() => import("./pages/public/UnauthorizedPage"));

// ============================================================
// AUTH
// ============================================================

const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

// ============================================================
// CUSTOMER PAGES
// ============================================================

const CheckoutPage = lazy(() => import("./pages/customer/CheckoutPage"));
const AddressPage = lazy(() => import("./pages/customer/AddressPage"));
const OrderSummaryPage = lazy(() => import("./pages/customer/OrderSummaryPage"));
const PaymentPage = lazy(() => import("./pages/customer/PaymentPage"));
const OrderSuccessPage = lazy(() => import("./pages/customer/OrderSuccessPage"));
const OrdersPage = lazy(() => import("./pages/customer/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/customer/OrderDetailsPage"));
const CustomerDashboardPage = lazy(() => import("./pages/customer/CustomerDashboardPage"));
const ProfilePage = lazy(() => import("./pages/customer/ProfilePage"));
const AddressesPage = lazy(() => import("./pages/customer/AddressesPage"));

// ============================================================
// CUSTOMER WISHLIST / NOTIFICATIONS / RETURNS / INVOICES
// ============================================================

const WishlistPage = lazy(() => import("./pages/customer/WishlistPage"));
const NotificationsPage = lazy(() => import("./pages/customer/NotificationsPage"));
const ReturnsPage = lazy(() => import("./pages/customer/ReturnsPage"));
const InvoicesPage = lazy(() => import("./pages/customer/InvoicesPage"));
const ShipmentTrackingPage = lazy(() => import("./pages/customer/ShipmentTrackingPage"));

const BulkQuotesPage = lazy(() => import("./pages/customer/BulkQuotesPage"));

// ============================================================
// CUSTOMER RFQ
// ============================================================

const RFQCreatePage = lazy(() => import("./pages/customer/RFQCreatePage"));
const RFQsPage = lazy(() => import("./pages/customer/RFQsPage"));
const RFQDetailsPage = lazy(() => import("./pages/customer/RFQDetailsPage"));

// ============================================================
// CUSTOMER QUOTATIONS
// ============================================================

const QuotationsPage = lazy(() => import("./pages/customer/QuotationsPage"));
const QuotationDetailsPage = lazy(() => import("./pages/customer/QuotationDetailsPage"));

// ============================================================
// ADMIN PAGES
// ============================================================

const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AddProductPage = lazy(() => import("./pages/admin/AddProductPage"));
const EditProductPage = lazy(() => import("./pages/admin/EditProductPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AddCategoryPage = lazy(() => import("./pages/admin/AddCategoryPage"));
const EditCategoryPage = lazy(() => import("./pages/admin/EditCategoryPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminOrderDetailsPage = lazy(() => import("./pages/admin/AdminOrderDetailsPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminUserDetailsPage = lazy(() => import("./pages/admin/AdminUserDetailsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminProfilePage = lazy(() => import("./pages/admin/AdminProfilePage"));

// ============================================================
// ADMIN INVENTORY / SHIPMENTS / REPORTS
// ============================================================

const AdminInventoryPage = lazy(() => import("./pages/admin/AdminInventoryPage"));
const AdminShipmentsPage = lazy(() => import("./pages/admin/AdminShipmentsPage"));
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage"));

// ============================================================
// ADMIN RETURNS / BULK QUOTES
// ============================================================

const AdminReturnsPage = lazy(() => import("./pages/admin/AdminReturnsPage"));
const AdminReturnDetailsPage = lazy(() => import("./pages/admin/AdminReturnDetailsPage"));
const AdminBulkQuotesPage = lazy(() => import("./pages/admin/AdminBulkQuotesPage"));
const AdminBulkQuoteDetailsPage = lazy(() => import("./pages/admin/AdminBulkQuoteDetailsPage"));

// ============================================================
// ADMIN RFQ
// ============================================================

const AdminRFQsPage = lazy(() => import("./pages/admin/AdminRFQsPage"));
const AdminRFQDetailsPage = lazy(() => import("./pages/admin/AdminRFQDetailsPage"));

// ============================================================
// ADMIN QUOTATIONS
// ============================================================

const AdminQuotationsPage = lazy(() => import("./pages/admin/AdminQuotationsPage"));
const AdminQuotationDetailsPage = lazy(() => import("./pages/admin/AdminQuotationDetailsPage"));
const CreateQuotationPage = lazy(() => import("./pages/admin/CreateQuotationPage"));

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

      <Suspense fallback={<Loading message="Loading page..." />}>

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
            element={
              <CustomerDashboardLayout />
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

          </Route>

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

          <Route
            element={
              <AdminDashboardLayout />
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

            <Route
              path="/admin/users/:userId"
              element={
                <AdminUserDetailsPage />
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
                ADMIN RETURNS
                ================================================== */}

            <Route
              path="/admin/returns"
              element={
                <AdminReturnsPage />
              }
            />

            <Route
              path="/admin/returns/:returnId"
              element={
                <AdminReturnDetailsPage />
              }
            />

            {/* ==================================================
                ADMIN BULK QUOTES
                ================================================== */}

            <Route
              path="/admin/bulk-quotes"
              element={
                <AdminBulkQuotesPage />
              }
            />

            <Route
              path="/admin/bulk-quotes/:quoteId"
              element={
                <AdminBulkQuoteDetailsPage />
              }
            />

          </Route>

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

      </Suspense>

    </BrowserRouter>
  );
}

export default App;