# Shanti Enterprises

> A production-oriented B2B wholesale e-commerce platform built with the MERN stack, covering product discovery, wholesale ordering, RFQs, quotations, payments, invoices, shipments, returns, notifications, inventory, reporting, and role-based administration.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF?logo=razorpay&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)

---

## 📌 Overview

**Shanti Enterprises** is a full-stack B2B wholesale commerce application designed around real business workflows rather than a basic shopping-cart demo.

The application provides two primary experiences:

- **Customer portal** — browse products, manage cart and addresses, place orders, make payments, request bulk quotations, create RFQs, view quotations, track shipments, download invoices, manage returns, wishlist items, and receive notifications.
- **Admin portal** — manage products, categories, customers, orders, inventory, RFQs, quotations, bulk quotes, shipments, returns, dashboards, analytics, and reports.

The project follows a separated **React frontend + Node/Express REST API + MongoDB** architecture and integrates external services for payments and media storage.

---

## ✨ Key Features

### 🛍️ Customer & Commerce

- Product catalogue and category browsing
- Product search and product details
- Minimum Order Quantity (MOQ) support
- Wholesale-oriented pricing workflows
- Shopping cart management
- Quantity validation
- Saved delivery addresses
- Checkout and order summary
- Order creation and order history
- Order details and status tracking
- Wishlist
- Customer profile management

### 💰 Payments

- Razorpay payment integration
- Server-side payment order creation
- Payment verification
- Payment failure handling
- Payment success flow
- Order/payment status synchronization

### 📋 RFQ & Quotation Management

- Customer RFQ creation
- RFQ listing and details
- Admin RFQ management
- Admin quotation creation
- Customer quotation listing
- Quotation details
- Bulk quotation workflows
- Admin bulk quote management

### 📦 Orders, Shipments & Returns

- Customer order management
- Admin order management
- Order details
- Shipment management
- Customer shipment tracking
- Return request workflow
- Admin return processing
- Shipment synchronization utilities

### 🧾 Invoices & Notifications

- Invoice generation/management
- Customer invoice page
- Order/invoice related workflows
- Customer notifications
- Notification management APIs

### 📊 Admin & Business Operations

- Admin dashboard
- Product CRUD
- Category CRUD
- Customer management
- Inventory management
- Shipment management
- Returns management
- RFQ management
- Quotation management
- Bulk quote management
- Reports
- Analytics
- Admin profile

### 🔐 Authentication & Security

- JWT-based authentication
- Customer/admin role-based authorization
- Protected frontend routes
- Admin-only routes
- Password hashing with bcrypt
- Request validation
- Centralized error handling
- HTTP security headers with Helmet
- API rate limiting
- Payment-specific rate limiting
- CORS configuration
- Cookie parsing
- Environment-based configuration

### ☁️ Media & File Uploads

- Product/media upload support
- Multer-based upload handling
- Cloudinary integration for media storage
- Dedicated upload API

---

## 🧱 Technology Stack

### Frontend

| Technology | Usage |
|---|---|
| React 19 | UI development |
| React Router 7 | Client-side routing |
| Vite 8 | Development server and production build |
| Axios | REST API communication |
| Lucide React | UI icons |
| Context API | Authentication, cart and address state |
| CSS | Application styling |

### Backend

| Technology | Usage |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API framework |
| MongoDB | Database |
| Mongoose 8 | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Cloudinary | Media storage |
| Razorpay | Payment gateway |
| Nodemailer | Email delivery |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-validator | Request validation |
| cookie-parser | Cookie handling |
| dotenv | Environment configuration |

### Development & Deployment

- Git / GitHub
- VS Code
- Postman
- MongoDB Atlas
- Vercel
- Render
- Cloudinary
- Razorpay

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       Customer      │
                         │  Browser / Web App  │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS / REST API
                                    ▼
                         ┌─────────────────────┐
                         │   React + Vite      │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                                  Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │      REST API       │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
      │  MongoDB    │       │ Cloudinary  │       │  Razorpay   │
      │   Atlas     │       │    Media    │       │  Payments   │
      └─────────────┘       └─────────────┘       └─────────────┘

                         ┌─────────────────────┐
                         │   Admin Dashboard   │
                         │ Products • Orders   │
                         │ Inventory • RFQs    │
                         │ Reports • Returns   │
                         └─────────────────────┘
```

---

## 📁 Project Structure

```text
Shanti-Enterprises/
│
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── rfqController.js
│   │   ├── quotationController.js
│   │   ├── bulkQuoteController.js
│   │   ├── invoiceController.js
│   │   ├── shipmentController.js
│   │   ├── returnController.js
│   │   ├── wishlistController.js
│   │   ├── notificationController.js
│   │   └── admin*.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validate.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   ├── RFQ.js
│   │   ├── Quotation.js
│   │   ├── BulkQuote.js
│   │   ├── Invoice.js
│   │   ├── Shipment.js
│   │   ├── ReturnRequest.js
│   │   ├── Wishlist.js
│   │   ├── Notification.js
│   │   └── addressModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── rfqRoutes.js
│   │   ├── quotationRoutes.js
│   │   ├── bulkQuoteRoutes.js
│   │   ├── invoiceRoutes.js
│   │   ├── shipmentRoutes.js
│   │   ├── returnRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── admin*Routes.js
│   │
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   ├── createTestCustomer.js
│   │   └── resetCustomer.js
│   │
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── public/
│   │   │   ├── customer/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔌 Backend API Modules

The backend exposes REST API groups under `/api`.

### Public / Customer APIs

```text
/api/health
/api
/api/auth
/api/products
/api/categories
/api/cart
/api/orders
/api/rfqs
/api/quotations
/api/wishlist
/api/profile
/api/addresses
/api/notifications
/api/bulk-quotes
/api/payments
/api/invoices
/api/shipments
/api/returns
/api/upload
```

### Admin APIs

```text
/api/admin/dashboard
/api/admin/products
/api/admin/orders
/api/admin/rfqs
/api/admin/quotations
/api/admin/customers
/api/admin/inventory
/api/admin/shipments
/api/admin/returns
/api/admin/bulk-quotes
/api/admin/reports
```

The API root returns a simple service response, while `/api/health` provides a dedicated health-check endpoint.

---

## 🧭 Frontend Route Map

### Public

```text
/
 /categories
 /products
 /products/:productId
 /cart
 /login
 /register
 /admin/login
 /unauthorized
```

### Customer

```text
/dashboard
/profile
/addresses

/checkout
/checkout/address
/checkout/summary

/payment/:orderId
/order-success/:orderId

/orders
/orders/:orderId

/wishlist
/notifications
/returns
/invoices

/shipments
/shipments/:shipmentId

/bulk-quotes

/rfq/create
/rfqs
/rfq/:rfqId

/quotations
/quotations/:quotationId
```

### Admin

```text
/admin
/admin/dashboard

/admin/products
/admin/products/new
/admin/products/:productId/edit

/admin/categories
/admin/categories/new
/admin/categories/:categoryId/edit

/admin/orders
/admin/orders/:orderId

/admin/users
/admin/users/:userId

/admin/inventory
/admin/shipments
/admin/returns
/admin/returns/:returnId

/admin/bulk-quotes
/admin/bulk-quotes/:bulkQuoteId

/admin/rfqs
/admin/rfqs/:rfqId

/admin/quotations
/admin/quotations/:quotationId
/admin/quotations/create

/admin/analytics
/admin/reports
/admin/profile
```

---

## 🔄 Main Business Workflows

### Customer Order & Payment

```text
Browse Products
       ↓
Product Details
       ↓
Add to Cart
       ↓
Cart / Quantity / MOQ
       ↓
Checkout
       ↓
Select / Add Address
       ↓
Order Summary
       ↓
Create Order
       ↓
Razorpay Checkout
       ↓
Payment Verification
       ↓
Order Success
       ↓
Orders / Invoice / Shipment Tracking
```

### RFQ → Quotation

```text
Customer
   │
   ├── Create RFQ
   │
   ▼
Admin
   │
   ├── Review RFQ
   ├── Process RFQ
   └── Create Quotation
   │
   ▼
Customer
   │
   ├── View Quotation
   └── Continue business workflow
```

### Bulk Quote Workflow

```text
Customer
   ↓
Bulk Quote Request
   ↓
Admin Review
   ↓
Admin Bulk Quote Processing
   ↓
Customer Quote Details
```

### Order Fulfillment

```text
Order
  ↓
Payment
  ↓
Order Processing
  ↓
Shipment
  ↓
Tracking
  ↓
Delivery
  ↓
Invoice / Return Workflow
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB / MongoDB Atlas account
- Razorpay account for payment testing
- Cloudinary account for media uploads

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Shanti-Enterprises
```

---

## 2. Configure Backend

```bash
cd Backend
npm install
```

Create a `.env` file using `.env.example`:

```bash
cp .env.example .env
```

On Windows, you can simply copy the file manually:

```text
Backend/.env.example
        ↓
Backend/.env
```

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
TRUST_PROXY=1

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Shanti Enterprises <your_email@gmail.com>

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
```

> Use the actual variable names from `Backend/.env.example`. Never commit the real `.env` file.

---

## 3. Run Backend

Development:

```bash
cd Backend
npm run dev
```

Production-style start:

```bash
npm start
```

Default local backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

API root:

```text
http://localhost:5000/api
```

---

## 4. Configure Frontend

Open another terminal:

```bash
cd Frontend
npm install
```

Create:

```text
Frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 5. Run Frontend

```bash
npm run dev
```

Default Vite development URL:

```text
http://localhost:5173
```

---

## 🛠️ Available Scripts

### Backend

```bash
npm run dev
```

Starts the backend using Nodemon.

```bash
npm start
```

Starts the backend using Node.js.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint checks.

---

## 👤 Admin Setup

The backend contains an admin creation script:

```text
Backend/scripts/createAdmin.js
```

Configure the admin environment variables first, then run the script according to the current project setup.

Additional development/test scripts are available:

```text
Backend/scripts/createTestCustomer.js
Backend/scripts/resetCustomer.js
```

> Do not use weak or shared passwords for production admin accounts.

---

## 🌐 Deployment

A suitable deployment architecture for this project is:

```text
                   GitHub Repository
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
           Vercel                   Render
         Frontend                  Backend
              │                       │
              │                       ▼
              │                 MongoDB Atlas
              │
              ├──────────────► Razorpay
              │
              └──────────────► Cloudinary
```

### Frontend Deployment

For Vercel:

```text
Root Directory: Frontend
Build Command: npm run build
Output Directory: dist
```

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
VITE_RAZORPAY_KEY_ID=your_public_razorpay_key
```

### Backend Deployment

For Render:

```text
Root Directory: Backend
Build Command: npm install
Start Command: npm start
```

Set the required backend environment variables in the Render dashboard.

Important production settings:

```env
NODE_ENV=production
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN
TRUST_PROXY=1
```

If the API is accessed through a Vercel rewrite/proxy path as described by the backend configuration, adjust `TRUST_PROXY` according to the deployment topology.

---

## 🔐 Security Notes

This project already includes several production-oriented security measures:

- Helmet security headers
- CORS allow-listing
- JWT authentication
- Role-based authorization
- Password hashing
- Request validation
- Centralized error handling
- General API rate limiting
- Authentication rate limiting
- Payment rate limiting
- Environment-based secrets
- Server-side payment verification

### Never commit

```text
.env
.env.local
.env.production
API keys
JWT secrets
Database passwords
Razorpay secret keys
Cloudinary secrets
Email passwords
```

Only commit safe templates such as:

```text
Backend/.env.example
Frontend/.env.example
```

---

## 🧪 Recommended Testing Checklist

### Authentication

- [ ] Customer registration
- [ ] Customer login
- [ ] Invalid credentials
- [ ] Protected customer routes
- [ ] Admin login
- [ ] Admin role protection
- [ ] Logout
- [ ] Token/session persistence

### Products & Categories

- [ ] Product listing
- [ ] Product search
- [ ] Product details
- [ ] Category listing
- [ ] Product images
- [ ] MOQ validation
- [ ] Stock validation

### Cart & Checkout

- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove product
- [ ] Cart persistence
- [ ] Address creation
- [ ] Address selection
- [ ] Order summary
- [ ] Order creation

### Payments

- [ ] Razorpay checkout
- [ ] Successful payment
- [ ] Failed payment
- [ ] Payment verification
- [ ] Order/payment status consistency

### Orders

- [ ] Customer order list
- [ ] Customer order details
- [ ] Admin order list
- [ ] Admin order details
- [ ] Order status workflow

### RFQ & Quotations

- [ ] Create RFQ
- [ ] View RFQ
- [ ] Admin RFQ processing
- [ ] Create quotation
- [ ] Customer quotation list
- [ ] Quotation details

### Bulk Quotes

- [ ] Customer bulk quote request
- [ ] Admin bulk quote management
- [ ] Quote detail flow

### Operations

- [ ] Inventory
- [ ] Shipments
- [ ] Shipment tracking
- [ ] Returns
- [ ] Invoices
- [ ] Notifications
- [ ] Reports
- [ ] Analytics

---

## 🧩 Backend Design

The backend follows a modular Express architecture:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Model / Database
   ↓
External Service (when required)
   ↓
JSON Response
```

### Controller Layer

Business logic is separated into controllers for areas such as:

- Authentication
- Products
- Categories
- Cart
- Orders
- Payments
- RFQs
- Quotations
- Bulk quotes
- Invoices
- Shipments
- Returns
- Wishlist
- Notifications
- Profiles
- Addresses
- Admin operations

### Model Layer

MongoDB/Mongoose models represent core business entities including:

```text
User
Product
Category
Cart
Order
Payment
RFQ
Quotation
BulkQuote
Invoice
Shipment
ReturnRequest
Wishlist
Notification
Address
```

### Utility Layer

Reusable backend utilities include:

```text
asyncHandler
calculatePrice
cloudinaryUpload
constants
dateUtils
formatResponse
generateInvoiceNumber
generateOrderNumber
generateToken
pagination
password
responseHelper
sendEmail
sendSMS
shipmentSync
slugify
validators
wholesaleUtils
```

---

## 🎨 Frontend Architecture

The React application is organized into reusable layers:

```text
src/
│
├── api/          → API communication
├── components/   → Reusable UI components
├── context/      → Global application state
├── layouts/      → Customer/Admin layouts
├── pages/
│   ├── auth/
│   ├── public/
│   ├── customer/
│   └── admin/
├── assets/
└── App.jsx
```

The application uses `ProtectedRoute` to separate authenticated customer and admin experiences.

The UI also includes:

- Reusable buttons
- Loading states
- Empty states
- Error messages
- Error boundary
- Confirmation modal
- Customer sidebar
- Admin sidebar
- Shared header/footer
- Lazy-loaded pages

---

## 🔄 State Management

The current frontend uses React Context for application-level state.

### Auth Context

Handles authentication/user state.

### Cart Context

Handles shopping-cart state and cart-related actions.

### Address Context

Handles customer address state and address-related workflows.

---

## 📡 Environment Configuration

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### Backend

```env
PORT=5000
NODE_ENV=development
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
TRUST_PROXY=1

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_FROM=...
```

Refer to the included `.env.example` files for the complete variable template.

---

## 📈 Future Enhancements

Possible future improvements for the platform include:

- Advanced wholesale pricing tiers
- Customer-specific pricing
- Coupon and discount engine
- Advanced product filtering
- Search optimization
- Redis caching
- Background job processing
- Automated shipment integrations
- WhatsApp notifications
- More payment methods
- Automated email templates
- Audit logs
- Docker containerization
- CI/CD pipelines
- Automated tests
- API documentation with Swagger/OpenAPI
- Advanced business intelligence dashboards
- Product recommendation engine
- Role/permission matrix beyond customer/admin

---

## 🎯 What This Project Demonstrates

This project demonstrates practical full-stack development skills across:

- MERN stack architecture
- React application development
- REST API design
- MongoDB/Mongoose data modeling
- Authentication and authorization
- Role-based access control
- E-commerce workflows
- B2B/wholesale workflows
- RFQ and quotation systems
- Payment gateway integration
- File/media uploads
- Inventory management
- Shipment tracking
- Returns management
- Invoice workflows
- Admin dashboards
- Analytics and reporting
- API security
- Rate limiting
- Production environment configuration
- Frontend/backend deployment architecture

---

## 👨‍💻 Author

**Vivek Rana**  
MERN Stack Developer

- **GitHub:** [github.com/realvivekrana](https://github.com/realvivekrana)
- **LinkedIn:** [linkedin.com/in/mrvivekrana](https://www.linkedin.com/in/mrvivekrana)
- **Portfolio:** [my-portfolio-mern-mauve.vercel.app](https://my-portfolio-mern-mauve.vercel.app/)

---

## 📄 License

This project is intended for learning, portfolio, and professional demonstration purposes.

Copyright © 2026 Vivek Rana.

---

## ⭐ If You Like This Project

If this project helped you or you found the architecture useful, consider giving the repository a ⭐ on GitHub.
