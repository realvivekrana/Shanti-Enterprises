import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import {
  CartProvider,
} from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import DiscountPopup from './components/DiscountPopup';
import PolicyPage from './components/PolicyPage';

// ======================================================
// PUBLIC PAGES
// ======================================================

import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import BulkOrderUpload from './pages/BulkOrderUpload';
import ReturnRequest from './pages/ReturnRequest';
import CustomerDashboard from './pages/CustomerDashboard';

// ======================================================
// AUTH
// ======================================================

import Login from './pages/Login';
import Register from './pages/Register';

// ======================================================
// RFQ
// ======================================================

import CreateRFQ from './pages/CreateRFQ';
import MyRFQs from './pages/MyRFQs';
import MyQuotations from './pages/MyQuotations';

// ======================================================
// CUSTOMER ORDERS
// ======================================================

import Orders from './pages/Orders';

// ======================================================
// WISHLIST
// ======================================================

import MyWishlist from './pages/MyWishlist';

// ======================================================
// NOTIFICATIONS
// ======================================================

import Notifications from './pages/Notifications';

// ======================================================
// ADMIN
// ======================================================

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';

// ======================================================
// ADMIN SHIPPING
// ======================================================

import AdminShipping from './pages/admin/AdminShipping';

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <CartProvider>

      <BrowserRouter>

        <div className="flex flex-col min-h-screen">

          {/* ==================================================
              NAVBAR
          ================================================== */}

          <Navbar />

          {/* ==================================================
              DISCOUNT POPUP
          ================================================== */}

          <DiscountPopup />

          {/* ==================================================
              MAIN
          ================================================== */}

          <main className="flex-grow">

            <Routes>

              {/* ==================================================
                  HOME
              ================================================== */}

              <Route
                path="/"
                element={
                  <Home />
                }
              />

              {/* ==================================================
                  CUSTOMER DASHBOARD
              ================================================== */}

              <Route
                path="/dashboard"
                element={
                  <CustomerDashboard />
                }
              />

              {/* ==================================================
                  PRODUCTS
              ================================================== */}

              <Route
                path="/products"
                element={
                  <Products />
                }
              />

              {/* ==================================================
                  CATEGORIES
              ================================================== */}

              <Route
                path="/categories"
                element={
                  <Categories />
                }
              />

              {/* ==================================================
                  ABOUT
              ================================================== */}

              <Route
                path="/about"
                element={
                  <About />
                }
              />

              {/* ==================================================
                  PRODUCT DETAILS
              ================================================== */}

              <Route
                path="/product/:id"
                element={
                  <ProductDetail />
                }
              />

              {/* ==================================================
                  CART
              ================================================== */}

              <Route
                path="/cart"
                element={
                  <Cart />
                }
              />

              {/* ==================================================
                  CHECKOUT
              ================================================== */}

              <Route
                path="/checkout"
                element={
                  <Checkout />
                }
              />

              {/* ==================================================
                  ORDER SUCCESS
              ================================================== */}

              <Route
                path="/order-success/:id"
                element={
                  <OrderSuccess />
                }
              />

              {/* ==================================================
                  ORDER TRACKING
              ================================================== */}

              <Route
                path="/order-tracking/:id"
                element={
                  <OrderTracking />
                }
              />

              {/* ==================================================
                  RETURNS & REFUNDS
              ================================================== */}

              <Route
                path="/orders/:orderId/return"
                element={
                  <ReturnRequest />
                }
              />

              {/* ==================================================
                  BULK ORDER
              ================================================== */}

              <Route
                path="/bulk-order-upload"
                element={
                  <BulkOrderUpload />
                }
              />

              {/* ==================================================
                  AUTH
              ================================================== */}

              <Route
                path="/login"
                element={
                  <Login />
                }
              />

              <Route
                path="/register"
                element={
                  <Register />
                }
              />

              {/* ==================================================
                  POLICIES
              ================================================== */}

              <Route
                path="/policies/:type"
                element={
                  <PolicyPage />
                }
              />

              {/* ==================================================
                  RFQ
              ================================================== */}

              <Route
                path="/products/:id/rfq"
                element={
                  <CreateRFQ />
                }
              />

              <Route
                path="/my-rfqs"
                element={
                  <MyRFQs />
                }
              />

              {/* ==================================================
                  QUOTATIONS
              ================================================== */}

              <Route
                path="/my-quotations"
                element={
                  <MyQuotations />
                }
              />

              {/* ==================================================
                  ORDERS
              ================================================== */}

              <Route
                path="/orders"
                element={
                  <Orders />
                }
              />

              {/* ==================================================
                  WISHLIST
              ================================================== */}

              <Route
                path="/wishlist"
                element={
                  <MyWishlist />
                }
              />

              {/* ==================================================
                  NOTIFICATIONS
              ================================================== */}

              <Route
                path="/notifications"
                element={
                  <Notifications />
                }
              />

              {/* ==================================================
                  ADMIN DASHBOARD
              ================================================== */}

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* ==================================================
                  ADMIN PRODUCTS
              ================================================== */}

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />

              {/* ==================================================
                  ADMIN CREATE PRODUCT
              ================================================== */}

              <Route
                path="/admin/products/new"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />

              {/* ==================================================
                  ADMIN EDIT PRODUCT
              ================================================== */}

              <Route
                path="/admin/products/:id/edit"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />

              {/* ==================================================
                  ADMIN SHIPPING
              ================================================== */}

              <Route
                path="/admin/shipping"
                element={
                  <AdminRoute>
                    <AdminShipping />
                  </AdminRoute>
                }
              />

            </Routes>

          </main>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <Footer />

        </div>

      </BrowserRouter>

    </CartProvider>
  );
}

export default App;