const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

// ==============================
// ENVIRONMENT CONFIGURATION
// ==============================

dotenv.config();

// ==============================
// DATABASE CONNECTION
// ==============================

connectDB();

// ==============================
// EXPRESS APP
// ==============================

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());

// ==============================
// AUTH
// ==============================

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

// ==============================
// PRODUCTS
// ==============================

app.use(
  '/api/products',
  require('./routes/productRoutes')
);

// ==============================
// ORDERS
// ==============================

app.use(
  '/api/orders',
  require('./routes/orderRoutes')
);

// ==============================
// SUPPLIERS
// ==============================

app.use(
  '/api/suppliers',
  require('./routes/supplierRoutes')
);

// ==============================
// UPLOAD
// ==============================

app.use(
  '/api/upload',
  require('./routes/uploadRoutes')
);

// ==============================
// PAYMENT
// ==============================

app.use(
  '/api/payment',
  require('./routes/paymentRoutes')
);

// ==============================
// INVENTORY
// ==============================

app.use(
  '/api/inventory',
  require('./routes/inventoryRoutes')
);

// ==============================
// COUPONS
// ==============================

app.use(
  '/api/coupons',
  require('./routes/couponRoutes')
);

// ==============================
// WISHLIST
// ==============================

app.use(
  '/api/wishlist',
  require('./routes/wishlistRoutes')
);

// ==============================
// REVIEWS
// ==============================

app.use(
  '/api/reviews',
  require('./routes/reviewRoutes')
);

// ==============================
// SHIPMENTS
// ==============================

app.use(
  '/api/shipments',
  require('./routes/shipmentRoutes')
);

// ==============================
// RETURNS & REFUNDS
// ==============================

app.use(
  '/api/returns',
  require('./routes/returnRoutes')
);

// ==============================
// INVOICES
// ==============================

app.use(
  '/api/invoices',
  require('./routes/invoiceRoutes')
);

// ==============================
// AUDIT LOGS
// ==============================

app.use(
  '/api/audit-logs',
  require('./routes/auditRoutes')
);

// ==============================
// DASHBOARD
// ==============================

app.use(
  '/api/dashboard',
  require('./routes/dashboardRoutes')
);

// ==============================
// USER MANAGEMENT
// ==============================

app.use(
  '/api/users',
  require('./routes/userManagementRoutes')
);

// ==============================
// CONTACT
// ==============================

app.use(
  '/api/contact',
  require('./routes/contactRoutes')
);

// ==============================
// FAQS
// ==============================

app.use(
  '/api/faqs',
  require('./routes/faqRoutes')
);

// ==============================
// RFQ
// ==============================

app.use(
  '/api/rfqs',
  require('./routes/rfqRoutes')
);

// ==============================
// QUOTATIONS
// ==============================

app.use(
  '/api/quotations',
  require('./routes/quotationRoutes')
);

// ==============================
// TEST / HOME ROUTE
// ==============================

app.get('/', (req, res) => {
  res.send(
    'Shanti Enterprises API is running...'
  );
});

// ==============================
// 404 ERROR HANDLER
// ==============================

app.use(notFound);

// ==============================
// GLOBAL ERROR HANDLER
// ==============================

app.use(errorHandler);

// ==============================
// SERVER
// ==============================

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