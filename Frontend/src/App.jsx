import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// =====================================================
// AUTH
// =====================================================

import Login from './pages/Login';
import Register from './pages/Register';

// =====================================================
// CUSTOMER
// =====================================================

import CustomerDashboard from './pages/CustomerDashboard';

// =====================================================
// ADMIN
// =====================================================

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';

// =====================================================
// RFQ
// =====================================================

import RFQ from './pages/RFQ';


// =====================================================
// APP
// =====================================================

const App = () => {
  return (
    <BrowserRouter>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* =================================================
            CUSTOMER LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            CUSTOMER REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            CUSTOMER DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        {/* =================================================
            RFQ
        ================================================= */}

        <Route
          path="/rfq"
          element={<RFQ />}
        />

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex items-center justify-center px-4">

              <div className="text-center">

                <h1 className="text-5xl font-bold text-slate-900">
                  404
                </h1>

                <p className="text-slate-500 mt-3">
                  Page not found.
                </p>

                <a
                  href="/"
                  className="inline-block mt-5 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
                >
                  Go Home
                </a>

              </div>

            </div>
          }
        />

      </Routes>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </BrowserRouter>
  );
};

export default App;