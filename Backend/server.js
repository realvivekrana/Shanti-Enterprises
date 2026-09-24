// ============================================================
// SHANTI ENTERPRISES
// Backend Server
// ============================================================

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ============================================================
// LOAD ENVIRONMENT VARIABLES
// ============================================================

dotenv.config();

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

const adminReturnRoutes = require(
  "./routes/adminReturnRoutes"
);

const adminBulkQuoteRoutes = require(
  "./routes/adminBulkQuoteRoutes"
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
// APP
// ============================================================

const app = express();

// Render / Vercel proxy ke peeche real client IP (rate limiter ke liye) chahiye.
// Direct Render URL = 1 proxy hop. Agar Vercel rewrite ke through /api proxy
// karte ho to TRUST_PROXY=2 set karo.
app.set(
  "trust proxy",
  Number(process.env.TRUST_PROXY) || 1
);

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

// ============================================================
// CORS
// ============================================================

// FRONTEND_URL comma-separated ho sakta hai:
// https://shanti.com,https://www.shanti.com
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((item) =>
      item.trim().replace(/\/+$/, "")
    ),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError = new Error(
        `CORS blocked for origin: ${origin}`
      );

      corsError.statusCode = 403;

      return callback(corsError);
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ============================================================
// SECURITY
// ============================================================

app.use(
  helmet()
);

// ============================================================
// BODY PARSERS
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

// ============================================================
// COOKIE PARSER
// ============================================================

app.use(
  cookieParser()
);

// ============================================================
// GENERAL API RATE LIMITER
// ============================================================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests, please try again later.",
  },
});

app.use(
  "/api",
  generalLimiter
);

// ============================================================
// AUTH RATE LIMITER
// ============================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  // Sirf FAILED login/register attempts count hote hain
  // (brute-force protection). Successful login count nahi hota.
  skipSuccessfulRequests: true,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many auth attempts, please try again later.",
  },
});

// IMPORTANT: limiter sirf login/register pe lagta hai.
// Pehle poore /api/auth pe tha, to har page refresh pe chalne wala
// GET /api/auth/me bhi count hota tha — 20 refresh ke baad /me 429
// deta tha aur user achanak logged-out dikhta tha.
app.post(
  [
    "/api/auth/login",
    "/api/auth/register",
  ],
  authLimiter
);

// ============================================================
// PAYMENT RATE LIMITER
// ============================================================

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 50,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many payment requests, please try again later.",
  },
});

app.use(
  "/api/payments",
  paymentLimiter
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

      timestamp:
        new Date().toISOString(),
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
// ADMIN RETURNS
// ============================================================

app.use(
  "/api/admin/returns",
  adminReturnRoutes
);

// ============================================================
// ADMIN BULK QUOTES
// ============================================================

app.use(
  "/api/admin/bulk-quotes",
  adminBulkQuoteRoutes
);

// ============================================================
// ADMIN REPORTS
// ============================================================

app.use(
  "/api/admin/reports",
  adminReportRoutes
);

// ============================================================
// 404
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

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      "0.0.0.0",
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
          `Frontend    : ${FRONTEND_URL}`
        );

        console.log(
          `Health      : /api/health`
        );

        console.log(
          `API         : /api`
        );

        console.log(
          "================================================"
        );

        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "Server was not started because MongoDB is unavailable."
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
};

startServer();