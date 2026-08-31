// ============================================================
// SHANTI ENTERPRISES
// Backend Server
// ============================================================

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const connectDatabase = require("./config/db");

// ============================================================
// CUSTOMER / PUBLIC ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const profileRoutes = require("./routes/profileRoutes");
const addressRoutes = require("./routes/addressRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bulkQuoteRoutes = require("./routes/bulkQuoteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const returnRoutes = require("./routes/returnRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ============================================================
// ADMIN ROUTES
// ============================================================

const adminDashboardRoutes = require(
  "./routes/adminDashboardRoutes"
);

const adminProductRoutes = require(
  "./routes/adminProductRoutes"
);

const adminOrderRoutes = require(
  "./routes/adminOrderRoutes"
);

const adminRFQRoutes = require(
  "./routes/adminRFQRoutes"
);

const adminQuotationRoutes = require(
  "./routes/adminQuotationRoutes"
);

const adminCustomerRoutes = require(
  "./routes/adminCustomerRoutes"
);

const adminInventoryRoutes = require(
  "./routes/adminInventoryRoutes"
);

const adminShipmentRoutes = require(
  "./routes/adminShipmentRoutes"
);

const adminReportRoutes = require(
  "./routes/adminReportRoutes"
);

// ============================================================
// ERROR HANDLING
// ============================================================

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();

// ============================================================
// APP
// ============================================================

const app = express();

const PORT =
  process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

// ============================================================
// DATABASE
// ============================================================

connectDatabase();

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Shanti Enterprises API is running",
      environment:
        process.env.NODE_ENV ||
        "development",
    });
  }
);

// ============================================================
// API ROOT
// ============================================================

app.get(
  "/api",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Welcome to Shanti Enterprises API",
      version: "1.0.0",
    });
  }
);

// ============================================================
// AUTH
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================================
// PRODUCTS
// ============================================================

app.use(
  "/api/products",
  productRoutes
);

// ============================================================
// CATEGORIES
// ============================================================

app.use(
  "/api/categories",
  categoryRoutes
);

// ============================================================
// CART
// ============================================================

app.use(
  "/api/cart",
  cartRoutes
);

// ============================================================
// ORDERS
// ============================================================

app.use(
  "/api/orders",
  orderRoutes
);

// ============================================================
// RFQs
// ============================================================

app.use(
  "/api/rfqs",
  rfqRoutes
);

// ============================================================
// QUOTATIONS
// ============================================================

app.use(
  "/api/quotations",
  quotationRoutes
);

// ============================================================
// WISHLIST
// ============================================================

app.use(
  "/api/wishlist",
  wishlistRoutes
);

// ============================================================
// PROFILE
// ============================================================

app.use(
  "/api/profile",
  profileRoutes
);

// ============================================================
// ADDRESSES
// ============================================================

app.use(
  "/api/addresses",
  addressRoutes
);

// ============================================================
// NOTIFICATIONS
// ============================================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// ============================================================
// BULK QUOTES
// ============================================================

app.use(
  "/api/bulk-quotes",
  bulkQuoteRoutes
);

// ============================================================
// PAYMENTS
// ============================================================

app.use(
  "/api/payments",
  paymentRoutes
);

// ============================================================
// INVOICES
// ============================================================

app.use(
  "/api/invoices",
  invoiceRoutes
);

// ============================================================
// SHIPMENTS
// ============================================================

app.use(
  "/api/shipments",
  shipmentRoutes
);

// ============================================================
// RETURNS
// ============================================================

app.use(
  "/api/returns",
  returnRoutes
);

// ============================================================
// IMAGE UPLOAD
// ============================================================
// Frontend calls:
// POST /api/upload/image
//
// Therefore uploadRoutes is mounted at:
// /api/upload
// ============================================================

app.use(
  "/api/upload",
  uploadRoutes
);

// ============================================================
// ADMIN DASHBOARD
// ============================================================

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

// ============================================================
// ADMIN PRODUCTS
// ============================================================

app.use(
  "/api/admin/products",
  adminProductRoutes
);

// ============================================================
// ADMIN ORDERS
// ============================================================

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);

// ============================================================
// ADMIN RFQs
// ============================================================

app.use(
  "/api/admin/rfqs",
  adminRFQRoutes
);

// ============================================================
// ADMIN QUOTATIONS
// ============================================================

app.use(
  "/api/admin/quotations",
  adminQuotationRoutes
);

// ============================================================
// ADMIN CUSTOMERS
// ============================================================

app.use(
  "/api/admin/customers",
  adminCustomerRoutes
);

// ============================================================
// ADMIN INVENTORY
// ============================================================

app.use(
  "/api/admin/inventory",
  adminInventoryRoutes
);

// ============================================================
// ADMIN SHIPMENTS
// ============================================================

app.use(
  "/api/admin/shipments",
  adminShipmentRoutes
);

// ============================================================
// ADMIN REPORTS
// ============================================================

app.use(
  "/api/admin/reports",
  adminReportRoutes
);

// ============================================================
// 404 ROUTE
// ============================================================

app.use(
  notFound
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  errorHandler
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {
    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "        SHANTI ENTERPRISES API SERVER"
    );

    console.log(
      "================================================"
    );

    console.log(
      `Environment : ${
        process.env.NODE_ENV ||
        "development"
      }`
    );

    console.log(
      `Port        : ${PORT}`
    );

    console.log(
      `API         : http://localhost:${PORT}/api`
    );

    console.log(
      `Health      : http://localhost:${PORT}/api/health`
    );

    console.log(
      `Auth        : http://localhost:${PORT}/api/auth`
    );

    console.log(
      `Products    : http://localhost:${PORT}/api/products`
    );

    console.log(
      `Categories  : http://localhost:${PORT}/api/categories`
    );

    console.log(
      `Cart        : http://localhost:${PORT}/api/cart`
    );

    console.log(
      `Orders      : http://localhost:${PORT}/api/orders`
    );

    console.log(
      `RFQs        : http://localhost:${PORT}/api/rfqs`
    );

    console.log(
      `Quotations  : http://localhost:${PORT}/api/quotations`
    );

    console.log(
      `Wishlist    : http://localhost:${PORT}/api/wishlist`
    );

    console.log(
      `Profile     : http://localhost:${PORT}/api/profile`
    );

    console.log(
      `Addresses   : http://localhost:${PORT}/api/addresses`
    );

    console.log(
      `Notifications : http://localhost:${PORT}/api/notifications`
    );

    console.log(
      `Bulk Quotes : http://localhost:${PORT}/api/bulk-quotes`
    );

    console.log(
      `Payments    : http://localhost:${PORT}/api/payments`
    );

    console.log(
      `Invoices    : http://localhost:${PORT}/api/invoices`
    );

    console.log(
      `Shipments   : http://localhost:${PORT}/api/shipments`
    );

    console.log(
      `Returns     : http://localhost:${PORT}/api/returns`
    );

    console.log(
      `Admin       : http://localhost:${PORT}/api/admin/dashboard`
    );

    console.log(
      `Admin Products : http://localhost:${PORT}/api/admin/products`
    );

    console.log(
      `Admin Orders : http://localhost:${PORT}/api/admin/orders`
    );

    console.log(
      `Admin RFQs : http://localhost:${PORT}/api/admin/rfqs`
    );

    console.log(
      `Admin Quotations : http://localhost:${PORT}/api/admin/quotations`
    );

    console.log(
      `Admin Customers : http://localhost:${PORT}/api/admin/customers`
    );

    console.log(
      `Admin Inventory : http://localhost:${PORT}/api/admin/inventory`
    );

    console.log(
      `Admin Shipments : http://localhost:${PORT}/api/admin/shipments`
    );

    console.log(
      `Admin Reports : http://localhost:${PORT}/api/admin/reports`
    );

    console.log(
      "================================================"
    );

    console.log("");
  }
);