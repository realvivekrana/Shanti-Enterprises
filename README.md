# Shanti Enterprises

> A modern full-stack B2B e-commerce platform built with the MERN stack for product discovery, wholesale shopping, customer accounts, order management, payments, and administration.

[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-3395FF)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5)](https://cloudinary.com/)

---

## 📌 Overview

**Shanti Enterprises** is a full-stack B2B e-commerce application designed to provide a complete online shopping and business management experience.

The platform includes separate experiences for customers and administrators, with product discovery, cart management, checkout, payments, order management, analytics, profiles, and role-based access control.

---

## ✨ Features

### 🛍️ Customer

- Product and category browsing
- Product search
- Product details
- Shopping cart
- MOQ (Minimum Order Quantity) support
- Quantity management
- Checkout
- Saved addresses
- Order summary
- Razorpay payment flow
- Payment verification
- Order success
- My Orders
- Order details
- Customer dashboard
- Profile management

### 🔐 Authentication & Authorization

- User authentication
- Protected customer routes
- Admin-only routes
- Role-based authorization
- Unauthorized access handling

### 👨‍💼 Admin

- Admin dashboard
- Product management
- Add/Edit products
- Category management
- Add/Edit/Delete categories
- Order management
- Order details
- User management
- Sales analytics
- Admin profile

### 📊 Analytics

- Total users
- Total products
- Total orders
- Total categories
- Total revenue
- Pending orders
- Delivered orders
- Cancelled orders
- Sales analytics

### 💳 Payments

- Razorpay Checkout
- Razorpay order creation
- Payment response handling
- Payment verification
- Payment failure handling
- Order-success redirection

### ☁️ Media

- Cloudinary media storage
- Product/image upload support
- Backend file-upload handling

---

## 🧱 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI |
| React Router | Routing |
| Vite | Build tool |
| Axios | API communication |
| CSS | Styling |
| Context API | Auth, Cart & Address state |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Multer | File uploads |
| Cloudinary | Media storage |
| Razorpay | Payments |

### Tools & Services

- Git & GitHub
- VS Code
- Postman
- MongoDB Atlas
- Vercel
- Render
- Cloudinary
- Razorpay

---

## 📂 Project Structure

```text
Shanti-Enterprises/
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── customer/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### 1. Clone

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Shanti-Enterprises
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

### 3. Backend

Open another terminal:

```bash
cd Backend
npm install
npm run dev
```

Typical local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🔐 Environment Variables

### Frontend

Create:

```text
Frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend

Create:

```text
Backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit `.env` files or secrets to GitHub.

Recommended `.gitignore` entries:

```gitignore
node_modules/
.env
.env.local
.env.production
dist/
build/
```

---

## 🛒 Customer Purchase Flow

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Shopping Cart
      ↓
Checkout
      ↓
Select Address
      ↓
Order Summary
      ↓
Create Order
      ↓
Razorpay Payment
      ↓
Payment Verification
      ↓
Order Success
      ↓
My Orders
```

---

## 👨‍💼 Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ├── Products
     │    ├── Add Product
     │    ├── Edit Product
     │    └── Manage Products
     │
     ├── Categories
     │    ├── Add Category
     │    ├── Edit Category
     │    └── Delete Category
     │
     ├── Orders
     │    └── Order Details
     │
     ├── Users
     │
     ├── Analytics
     │
     └── Admin Profile
```

---

## 🔗 Main Routes

### Public

```text
/
 /categories
 /products
 /products/:productId
 /cart
 /login
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
/customer/test
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
/admin/analytics
/admin/profile
/admin/test
```

---

## 🔌 API Architecture

The frontend uses Axios-based API modules to communicate with the backend.

Typical API groups include:

```text
/api/auth
/api/products
/api/categories
/api/orders
/api/payment
/api/profile
/api/admin
```

The exact endpoint list depends on the deployed backend version.

---

## 🧪 Testing Checklist

### Authentication

- [ ] Customer login
- [ ] Invalid login handling
- [ ] Protected routes
- [ ] Admin login
- [ ] Admin role protection
- [ ] Logout

### Products

- [ ] Product listing
- [ ] Search
- [ ] Product details
- [ ] Product images
- [ ] Stock handling
- [ ] MOQ handling

### Cart

- [ ] Add product
- [ ] Update quantity
- [ ] Remove product
- [ ] Clear cart
- [ ] MOQ validation

### Checkout

- [ ] Address validation
- [ ] Order creation
- [ ] Order summary
- [ ] Razorpay initialization
- [ ] Payment verification
- [ ] Payment failure
- [ ] Order success
- [ ] Order history

### Admin

- [ ] Dashboard
- [ ] Product CRUD
- [ ] Category CRUD
- [ ] Order management
- [ ] User management
- [ ] Analytics
- [ ] Admin profile

---

## 🚀 Deployment Architecture

A typical production setup:

```text
                 GitHub
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
       Vercel               Render
      Frontend              Backend
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
           MongoDB        Cloudinary       Razorpay
            Atlas
```

### Production Checklist

- [ ] Production API URL configured
- [ ] MongoDB Atlas configured
- [ ] JWT secret configured
- [ ] Razorpay keys configured
- [ ] Cloudinary configured
- [ ] Production CORS configured
- [ ] `.env` excluded from Git
- [ ] Frontend production build succeeds
- [ ] Backend starts successfully
- [ ] Authentication tested
- [ ] Admin authorization tested
- [ ] Checkout tested
- [ ] Payment verification tested
- [ ] SPA routing configured

---

## 🛡️ Security

For production:

- Keep all secrets in environment variables
- Never commit credentials
- Hash passwords on the backend
- Use strong JWT secrets
- Protect admin routes with role-based authorization
- Verify Razorpay payment signatures server-side
- Validate user input on the server
- Validate uploaded files
- Configure production CORS
- Avoid exposing sensitive backend data

---

## 📈 Future Improvements

Planned or possible enhancements:

- Wholesale pricing tiers
- RFQ / Request for Quotation
- Bulk ordering
- Coupons and discounts
- Wishlist
- Reviews and ratings
- Inventory management
- Shipment tracking
- Returns management
- Audit logs
- Advanced analytics
- Email notifications
- WhatsApp notifications
- Redis caching
- Docker
- CI/CD
- Advanced search and filtering
- Product recommendations

---

## 🎯 Project Purpose

Shanti Enterprises is designed as a portfolio-grade MERN project demonstrating:

- Full-stack application architecture
- React development
- REST API integration
- Authentication & authorization
- MongoDB/Mongoose
- E-commerce workflows
- Payment integration
- File uploads
- Admin dashboard development
- Role-based access control
- Production deployment concepts

---

## 👨‍💻 Author

**Vivek Rana**

MERN Stack Developer

- GitHub: https://github.com/realvivekrana
- LinkedIn: https://www.linkedin.com/in/mrvivekrana
- Portfolio: https://my-portfolio-mern-mauve.vercel.app

---

## 📄 License

This project is intended for learning, portfolio, and professional demonstration purposes.

Copyright © 2026 Vivek Rana.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
