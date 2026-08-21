import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';

import Login from './pages/Login';
import Register from './pages/Register';

import CustomerDashboard from './pages/CustomerDashboard';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import RFQ from './pages/RFQ';


// ======================================================
// 404 PAGE
// ======================================================

const NotFoundPage = () => {
  return (
    <div
      className="
        min-h-[60vh]
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div className="text-center">

        <h1
          className="
            text-6xl
            font-extrabold
            tracking-tight
            text-slate-900
          "
        >
          404
        </h1>

        <p
          className="
            mt-3
            text-base
            text-slate-500
          "
        >
          Page not found.
        </p>

        <a
          href="/"
          className="
            inline-flex
            items-center
            justify-center
            mt-6
            rounded-xl
            bg-teal-600
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-teal-700
          "
        >
          Go Home
        </a>

      </div>
    </div>
  );
};


// ======================================================
// APP
// ======================================================

const App = () => {
  return (
    <AuthProvider>

      <CartProvider>

        <BrowserRouter>

          {/* ==================================================
              PUBLIC NAVBAR
          ================================================== */}

          <Navbar />


          {/* ==================================================
              APPLICATION ROUTES
          ================================================== */}

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
                PRODUCTS
            ================================================== */}

            <Route
              path="/products"
              element={
                <Products />
              }
            />


            <Route
              path="/products/:id"
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
                ABOUT
            ================================================== */}

            <Route
              path="/about"
              element={
                <About />
              }
            />


            {/* ==================================================
                CONTACT
            ================================================== */}

            <Route
              path="/contact"
              element={
                <Contact />
              }
            />


            {/* ==================================================
                CUSTOMER AUTH
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
                CUSTOMER DASHBOARD
            ================================================== */}

            <Route
              path="/dashboard"
              element={
                <CustomerDashboard />
              }
            />


            {/* ==================================================
                RFQ
            ================================================== */}

            <Route
              path="/rfq"
              element={
                <RFQ />
              }
            />


            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <Route
              path="/admin/login"
              element={
                <AdminLogin />
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
                404
            ================================================== */}

            <Route
              path="*"
              element={
                <NotFoundPage />
              }
            />

          </Routes>


          {/* ==================================================
              PUBLIC FOOTER
          ================================================== */}

          <Footer />

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>
  );
};


export default App;