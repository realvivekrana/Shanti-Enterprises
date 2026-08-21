import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

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
import AdminOrders from './pages/admin/AdminOrders';

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
// ADMIN PLACEHOLDER
// ======================================================
//
// Temporary component for admin sections whose individual
// pages are not connected yet.
//
// IMPORTANT:
// AdminLayout will remain visible.
// Sidebar/header will NOT disappear.
//
// ======================================================

const AdminSectionPlaceholder = ({
  title,
}) => {
  return (
    <div
      className="
        p-6
        lg:p-8
      "
    >

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-teal-50
              text-teal-600
            "
          >

            <span
              className="
                text-xl
                font-bold
              "
            >
              {title?.charAt(0)?.toUpperCase() || 'A'}
            </span>

          </div>


          <div>

            <h1
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              {title}
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              This admin section is ready to be
              connected with the real backend data.
            </p>

          </div>

        </div>

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
              APPLICATION ROUTES
          ================================================== */}

          <Routes>

            {/* ==================================================
                PUBLIC WEBSITE
            ================================================== */}

            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />

            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <Products />
                  <Footer />
                </>
              }
            />

            <Route
              path="/products/:id"
              element={
                <>
                  <Navbar />
                  <ProductDetail />
                  <Footer />
                </>
              }
            />

            <Route
              path="/cart"
              element={
                <>
                  <Navbar />
                  <Cart />
                  <Footer />
                </>
              }
            />

            <Route
              path="/checkout"
              element={
                <>
                  <Navbar />
                  <Checkout />
                  <Footer />
                </>
              }
            />

            <Route
              path="/order-success/:id"
              element={
                <>
                  <Navbar />
                  <OrderSuccess />
                  <Footer />
                </>
              }
            />

            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              }
            />

            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              }
            />


            {/* ==================================================
                CUSTOMER AUTH
            ================================================== */}

            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                  <Footer />
                </>
              }
            />

            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <Register />
                  <Footer />
                </>
              }
            />


            {/* ==================================================
                CUSTOMER DASHBOARD
            ================================================== */}

            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar />
                  <CustomerDashboard />
                  <Footer />
                </>
              }
            />


            {/* ==================================================
                RFQ
            ================================================== */}

            <Route
              path="/rfq"
              element={
                <>
                  <Navbar />
                  <RFQ />
                  <Footer />
                </>
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
                ADMIN APPLICATION
            ==================================================
            
                AdminLayout parent hai.

                Iska matlab:

                /admin/dashboard
                /admin/orders
                /admin/products
                /admin/customers
                /admin/inventory
                /admin/suppliers
                /admin/shipments
                /admin/quotations
                /admin/invoices
                /admin/returns
                /admin/coupons
                /admin/settings

                sab AdminLayout ke andar render honge.

                Sidebar aur header common rahenge.
            ================================================== */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >

              {/* ==================================================
                  ADMIN DEFAULT
                  /admin
              ================================================== */}

              <Route
                index
                element={
                  <Navigate
                    to="/admin/dashboard"
                    replace
                  />
                }
              />


              {/* ==================================================
                  ADMIN DASHBOARD
                  /admin/dashboard
              ================================================== */}

              <Route
                path="dashboard"
                element={
                  <AdminDashboard />
                }
              />


              {/* ==================================================
                  ADMIN ORDERS
                  /admin/orders
              ================================================== */}

              <Route
                path="orders"
                element={
                  <AdminOrders />
                }
              />


              {/* ==================================================
                  ADMIN PRODUCTS
                  /admin/products
              ================================================== */}

              <Route
                path="products"
                element={
                  <AdminSectionPlaceholder
                    title="Products"
                  />
                }
              />


              {/* ==================================================
                  ADMIN CUSTOMERS
                  /admin/customers
              ================================================== */}

              <Route
                path="customers"
                element={
                  <AdminSectionPlaceholder
                    title="Customers"
                  />
                }
              />


              {/* ==================================================
                  ADMIN INVENTORY
                  /admin/inventory
              ================================================== */}

              <Route
                path="inventory"
                element={
                  <AdminSectionPlaceholder
                    title="Inventory"
                  />
                }
              />


              {/* ==================================================
                  ADMIN SUPPLIERS
                  /admin/suppliers
              ================================================== */}

              <Route
                path="suppliers"
                element={
                  <AdminSectionPlaceholder
                    title="Suppliers"
                  />
                }
              />


              {/* ==================================================
                  ADMIN SHIPMENTS
                  /admin/shipments
              ================================================== */}

              <Route
                path="shipments"
                element={
                  <AdminSectionPlaceholder
                    title="Shipments"
                  />
                }
              />


              {/* ==================================================
                  ADMIN QUOTATIONS
                  /admin/quotations
              ================================================== */}

              <Route
                path="quotations"
                element={
                  <AdminSectionPlaceholder
                    title="Quotations"
                  />
                }
              />


              {/* ==================================================
                  ADMIN INVOICES
                  /admin/invoices
              ================================================== */}

              <Route
                path="invoices"
                element={
                  <AdminSectionPlaceholder
                    title="Invoices"
                  />
                }
              />


              {/* ==================================================
                  ADMIN RETURNS & REFUNDS
                  /admin/returns
              ================================================== */}

              <Route
                path="returns"
                element={
                  <AdminSectionPlaceholder
                    title="Returns & Refunds"
                  />
                }
              />


              {/* ==================================================
                  ADMIN COUPONS
                  /admin/coupons
              ================================================== */}

              <Route
                path="coupons"
                element={
                  <AdminSectionPlaceholder
                    title="Coupons"
                  />
                }
              />


              {/* ==================================================
                  ADMIN SETTINGS
                  /admin/settings
              ================================================== */}

              <Route
                path="settings"
                element={
                  <AdminSectionPlaceholder
                    title="Settings"
                  />
                }
              />


              {/* ==================================================
                  UNKNOWN ADMIN SECTION
              ================================================== */}

              <Route
                path="*"
                element={
                  <AdminSectionPlaceholder
                    title="Admin Section"
                  />
                }
              />

            </Route>


            {/* ==================================================
                GLOBAL 404
            ================================================== */}

            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <NotFoundPage />
                  <Footer />
                </>
              }
            />

          </Routes>

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>
  );
};


export default App;