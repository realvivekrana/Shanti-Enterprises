// ============================================================
// SHANTI ENTERPRISES
// Application Constants
// Backend - Shared Constants
// ============================================================

// ============================================================
// USER ROLES
// ============================================================

const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

// ============================================================
// ORDER STATUS
// ============================================================

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

// ============================================================
// PAYMENT STATUS
// ============================================================

const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED:
    "partially_refunded",
};

// ============================================================
// PAYMENT METHODS
// ============================================================

const PAYMENT_METHODS = {
  COD: "cod",
  RAZORPAY: "razorpay",
  BANK_TRANSFER:
    "bank_transfer",
};

// ============================================================
// RETURN STATUS
// ============================================================

const RETURN_STATUS = {
  REQUESTED: "requested",
  APPROVED: "approved",
  REJECTED: "rejected",
  PICKUP_SCHEDULED:
    "pickup_scheduled",
  RECEIVED: "received",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

// ============================================================
// SHIPMENT STATUS
// ============================================================

const SHIPMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  IN_TRANSIT: "in_transit",
  OUT_FOR_DELIVERY:
    "out_for_delivery",
  DELIVERED: "delivered",
  FAILED: "failed",
  RETURNED: "returned",
};

// ============================================================
// QUOTATION STATUS
// ============================================================

const QUOTATION_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

// ============================================================
// RFQ STATUS
// ============================================================

const RFQ_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  REVIEWING: "reviewing",
  QUOTED: "quoted",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

// ============================================================
// PRODUCT STATUS
// ============================================================

const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK:
    "out_of_stock",
};

// ============================================================
// INVENTORY TRANSACTION TYPES
// ============================================================

const INVENTORY_TRANSACTION_TYPES = {
  PURCHASE: "purchase",
  SALE: "sale",
  RETURN: "return",
  ADJUSTMENT: "adjustment",
  RESTOCK: "restock",
};

// ============================================================
// DEFAULT PAGINATION
// ============================================================

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ============================================================
// FILE UPLOAD LIMITS
// ============================================================

const FILE_UPLOAD = {
  MAX_IMAGE_SIZE:
    5 * 1024 * 1024,

  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  RETURN_STATUS,
  SHIPMENT_STATUS,
  QUOTATION_STATUS,
  RFQ_STATUS,
  PRODUCT_STATUS,
  INVENTORY_TRANSACTION_TYPES,
  PAGINATION,
  FILE_UPLOAD,
};