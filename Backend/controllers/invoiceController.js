// ============================================================
// SHANTI ENTERPRISES
// Invoice Controller
// Phase 5 - Operations
// ============================================================

const Invoice = require("../models/Invoice");
const Order = require("../models/Order");

// ============================================================
// GENERATE INVOICE NUMBER
// ============================================================

const generateInvoiceNumber = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `INV-${year}${month}-${random}`;
};

// ============================================================
// CREATE INVOICE FROM ORDER
// ============================================================

const createInvoice = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
    } = req.body;

    if (!orderId) {
      const error = new Error(
        "Order ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user.id,
      }).populate(
        "items.product",
        "name unit"
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // PREVENT DUPLICATE INVOICE
    // --------------------------------------------------------

    const existingInvoice =
      await Invoice.findOne({
        order: order._id,
      });

    if (existingInvoice) {
      return res.status(200).json({
        success: true,

        message:
          "Invoice already exists",

        invoice: existingInvoice,
      });
    }

    // --------------------------------------------------------
    // PREPARE ITEMS
    // --------------------------------------------------------

    const invoiceItems =
      (order.items || []).map(
        (item) => ({
          product:
            item.product?._id ||
            item.product ||
            null,

          productName:
            item.productName ||
            item.name ||
            item.product?.name ||
            "Product",

          quantity:
            Number(item.quantity) || 1,

          unit:
            item.unit ||
            item.product?.unit ||
            "piece",

          unitPrice:
            Number(
              item.unitPrice ??
              item.price ??
              0
            ),

          totalPrice:
            Number(
              item.totalPrice ??
              (
                Number(
                  item.unitPrice ??
                  item.price ??
                  0
                ) *
                Number(
                  item.quantity || 1
                )
              )
            ),
        })
      );

    if (invoiceItems.length === 0) {
      const error = new Error(
        "Order does not contain any items"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // TOTALS
    // --------------------------------------------------------

    const subtotal = Number(
      order.subtotal ?? 0
    );

    const shippingAmount = Number(
      order.shippingAmount ??
      order.shippingCost ??
      0
    );

    const taxAmount = Number(
      order.taxAmount ??
      order.tax ??
      0
    );

    const discountAmount = Number(
      order.discountAmount ??
      order.discount ??
      0
    );

    const totalAmount = Number(
      order.totalAmount ??
      (
        subtotal +
        shippingAmount +
        taxAmount -
        discountAmount
      )
    );

    // --------------------------------------------------------
    // BILLING ADDRESS
    // --------------------------------------------------------

    const sourceAddress =
      order.billingAddress ||
      order.shippingAddress ||
      {};

    const billingAddress = {
      name:
        sourceAddress.name ||
        req.user.name ||
        "",

      phone:
        sourceAddress.phone ||
        req.user.phone ||
        "",

      address:
        sourceAddress.address ||
        sourceAddress.street ||
        "",

      city:
        sourceAddress.city ||
        "",

      state:
        sourceAddress.state ||
        "",

      postalCode:
        sourceAddress.postalCode ||
        sourceAddress.zipCode ||
        "",

      country:
        sourceAddress.country ||
        "India",
    };

    // --------------------------------------------------------
    // CREATE INVOICE
    // --------------------------------------------------------

    const invoice =
      await Invoice.create({
        invoiceNumber:
          generateInvoiceNumber(),

        order: order._id,

        user: req.user.id,

        items: invoiceItems,

        subtotal,

        shippingAmount,

        taxAmount,

        discountAmount,

        totalAmount,

        currency: "INR",

        status:
          order.paymentStatus ===
          "paid"
            ? "paid"
            : "issued",

        issuedAt: new Date(),

        paidAt:
          order.paymentStatus ===
          "paid"
            ? new Date()
            : null,

        billingAddress,
      });

    res.status(201).json({
      success: true,

      message:
        "Invoice created successfully",

      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY INVOICE
// ============================================================

const getMyInvoice = async (
  req,
  res,
  next
) => {
  try {
    const invoice =
      await Invoice.findOne({
        _id: req.params.id,

        user: req.user.id,
      })
        .populate(
          "order",
          "orderNumber status paymentStatus totalAmount createdAt"
        )
        .populate(
          "items.product",
          "name slug image"
        );

    if (!invoice) {
      const error = new Error(
        "Invoice not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET INVOICE BY ORDER
// ============================================================

const getInvoiceByOrder = async (
  req,
  res,
  next
) => {
  try {
    const invoice =
      await Invoice.findOne({
        order: req.params.orderId,

        user: req.user.id,
      })
        .populate(
          "order",
          "orderNumber status paymentStatus totalAmount createdAt"
        )
        .populate(
          "items.product",
          "name slug image"
        );

    if (!invoice) {
      const error = new Error(
        "Invoice not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET MY INVOICES
// ============================================================

const getMyInvoices = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

    const skip =
      (currentPage - 1) *
      perPage;

    const [
      invoices,
      totalInvoices,
    ] = await Promise.all([
      Invoice.find({
        user: req.user.id,
      })
        .populate(
          "order",
          "orderNumber status paymentStatus totalAmount"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Invoice.countDocuments({
        user: req.user.id,
      }),
    ]);

    const totalPages = Math.ceil(
      totalInvoices / perPage
    );

    res.status(200).json({
      success: true,

      count: invoices.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalInvoices,
        totalPages,
      },

      invoices,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getMyInvoice,
  getInvoiceByOrder,
  getMyInvoices,
};