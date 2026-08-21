const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('@exortek/express-mongo-sanitize');

const connectDB = require('./config/db');

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

const {
  globalRateLimiter,
} = require('./middleware/securityMiddleware');


// ======================================================
// ENVIRONMENT CONFIGURATION
// ======================================================

dotenv.config();


// ======================================================
// DATABASE CONNECTION
// ======================================================

connectDB();


// ======================================================
// EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// SECURITY
// ======================================================

// Hide Express technology information

app.disable('x-powered-by');


// Security headers

app.use(
  helmet({

    // HSTS production HTTPS ke liye
    // local development mein disabled

    strictTransportSecurity:
      process.env.NODE_ENV === 'production'
        ? undefined
        : false,

  })
);


// ======================================================
// CORS
// ======================================================

const allowedOrigins = [

  'http://localhost:5173',

  'http://localhost:5174',

  process.env.FRONTEND_URL,

].filter(Boolean);


app.use(

  cors({

    origin:
      (origin, callback) => {

        // Postman / server-to-server requests

        if (!origin) {

          return callback(
            null,
            true
          );

        }


        // Allowed frontend

        if (
          allowedOrigins.includes(
            origin
          )
        ) {

          return callback(
            null,
            true
          );

        }


        return callback(

          new Error(
            'CORS policy: Origin not allowed'
          )

        );

      },

    methods: [

      'GET',

      'POST',

      'PUT',

      'PATCH',

      'DELETE',

      'OPTIONS',

    ],

    allowedHeaders: [

      'Content-Type',

      'Authorization',

    ],

  })

);


// ======================================================
// REQUEST BODY
// ======================================================

app.use(

  express.json({

    limit:
      '1mb',

  })

);


app.use(

  express.urlencoded({

    extended:
      true,

    limit:
      '1mb',

  })

);


// ======================================================
// GLOBAL API RATE LIMITER
// ======================================================

app.use(

  '/api',

  globalRateLimiter

);


// ======================================================
// MONGODB / NOSQL INPUT SANITIZATION
// ======================================================

app.use(

  mongoSanitize({

    maxDepthBehavior:
      'remove',

  })

);


// ======================================================
// API ROUTES
// ======================================================


// ======================================================
// AUTH
// ======================================================

app.use(

  '/api/auth',

  require(
    './routes/authRoutes'
  )

);


// ======================================================
// PRODUCTS
// ======================================================

app.use(

  '/api/products',

  require(
    './routes/productRoutes'
  )

);


// ======================================================
// ORDERS
// ======================================================

app.use(

  '/api/orders',

  require(
    './routes/orderRoutes'
  )

);


// ======================================================
// SUPPLIERS
// ======================================================

app.use(

  '/api/suppliers',

  require(
    './routes/supplierRoutes'
  )

);


// ======================================================
// UPLOAD
// ======================================================

app.use(

  '/api/upload',

  require(
    './routes/uploadRoutes'
  )

);


// ======================================================
// PAYMENT
// ======================================================

app.use(

  '/api/payment',

  require(
    './routes/paymentRoutes'
  )

);


// ======================================================
// INVENTORY
// ======================================================

app.use(

  '/api/inventory',

  require(
    './routes/inventoryRoutes'
  )

);


// ======================================================
// COUPONS
// ======================================================

app.use(

  '/api/coupons',

  require(
    './routes/couponRoutes'
  )

);


// ======================================================
// WISHLIST
// ======================================================

app.use(

  '/api/wishlist',

  require(
    './routes/wishlistRoutes'
  )

);


// ======================================================
// REVIEWS
// ======================================================

app.use(

  '/api/reviews',

  require(
    './routes/reviewRoutes'
  )

);


// ======================================================
// SHIPMENTS
// ======================================================

app.use(

  '/api/shipments',

  require(
    './routes/shipmentRoutes'
  )

);


// ======================================================
// RETURNS & REFUNDS
// ======================================================

app.use(

  '/api/returns',

  require(
    './routes/returnRoutes'
  )

);


// ======================================================
// INVOICES
// ======================================================

app.use(

  '/api/invoices',

  require(
    './routes/invoiceRoutes'
  )

);


// ======================================================
// AUDIT LOGS
// ======================================================

app.use(

  '/api/audit-logs',

  require(
    './routes/auditRoutes'
  )

);


// ======================================================
// EXISTING DASHBOARD
// ======================================================

app.use(

  '/api/dashboard',

  require(
    './routes/dashboardRoutes'
  )

);


// ======================================================
// NEW ADMIN DASHBOARD
// ======================================================
//
// This route is used by the new professional
// e-commerce admin dashboard.
//
// GET /api/admin-dashboard
//
// It uses:
// Backend/controllers/adminDashboardController.js
// Backend/routes/adminDashboardRoutes.js
//
// ======================================================

app.use(

  '/api/admin-dashboard',

  require(
    './routes/adminDashboardRoutes'
  )

);


// ======================================================
// USER MANAGEMENT
// ======================================================

app.use(

  '/api/users',

  require(
    './routes/userManagementRoutes'
  )

);


// ======================================================
// CONTACT
// ======================================================

app.use(

  '/api/contact',

  require(
    './routes/contactRoutes'
  )

);


// ======================================================
// FAQS
// ======================================================

app.use(

  '/api/faqs',

  require(
    './routes/faqRoutes'
  )

);


// ======================================================
// RFQ
// ======================================================

app.use(

  '/api/rfqs',

  require(
    './routes/rfqRoutes'
  )

);


// ======================================================
// QUOTATIONS
// ======================================================

app.use(

  '/api/quotations',

  require(
    './routes/quotationRoutes'
  )

);


// ======================================================
// NOTIFICATIONS
// ======================================================

app.use(

  '/api/notifications',

  require(
    './routes/notificationRoutes'
  )

);


// ======================================================
// HOME / API STATUS
// ======================================================

app.get(

  '/',

  (req, res) => {

    res.status(200).json({

      success:
        true,

      message:
        'Shanti Enterprises API is running',

      version:
        '1.0.0',

    });

  }

);


// ======================================================
// 404 HANDLER
// ======================================================

app.use(
  notFound
);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  errorHandler
);


// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;


app.listen(

  PORT,

  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }

);