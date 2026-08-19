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
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import BulkOrderUpload from './pages/BulkOrderUpload';


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
// NOTIFICATIONS
// ======================================================

import Notifications from './pages/Notifications';


// ======================================================
// WISHLIST
// ======================================================

import MyWishlist from './pages/MyWishlist';


// ======================================================
// ADMIN
// ======================================================

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';


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
                  PUBLIC
              ================================================== */}

              <Route
                path="/"
                element={
                  <Home />
                }
              />


              <Route
                path="/product/:id"
                element={
                  <ProductDetail />
                }
              />


              <Route
                path="/cart"
                element={
                  <Cart />
                }
              />


              <Route
                path="/checkout"
                element={
                  <Checkout />
                }
              />


              <Route
                path="/order-success/:id"
                element={
                  <OrderSuccess />
                }
              />


              {/* ==================================================
                  BULK ORDER UPLOAD
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
                  MY ORDERS
              ================================================== */}

              <Route
                path="/orders"
                element={
                  <Orders />
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
                  WISHLIST
              ================================================== */}

              <Route
                path="/wishlist"
                element={
                  <MyWishlist />
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
                  REPORTS & ANALYTICS
              ================================================== */}

              <Route
                path="/admin/reports"
                element={

                  <AdminRoute>

                    <ReportsAnalytics />

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