import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';

import Login from './pages/Login';
import Register from './pages/Register';

import CustomerDashboard from './pages/CustomerDashboard';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';

import RFQ from './pages/RFQ';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-slate-900">404</h1>
      <p className="text-slate-500 mt-3">Page not found.</p>
      <a href="/" className="inline-block mt-5 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">Go Home</a>
    </div>
  </div>
);

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/rfq" element={<RFQ />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;