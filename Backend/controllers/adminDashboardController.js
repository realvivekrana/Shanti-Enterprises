// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Controller
// Phase 6 - Admin
// ============================================================

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const RFQ = require("../models/RFQ");
const Quotation = require("../models/Quotation");
const Shipment = require("../models/Shipment");
const ReturnRequest = require("../models/ReturnRequest");

// ============================================================
// ADMIN DASHBOARD
// ============================================================

const getAdminDashboard = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRFQs,
      pendingRFQs,
      totalQuotations,
      pendingQuotations,
      totalShipments,
      pendingReturns,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
      }),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        status: {
          $in: [
            "pending",
            "processing",
          ],
        },
      }),

      RFQ.countDocuments(),

      RFQ.countDocuments({
        status: {
          $in: [
            "pending",
            "reviewing",
          ],
        },
      }),

      Quotation.countDocuments(),

      Quotation.countDocuments({
        status: "sent",
      }),

      Shipment.countDocuments(),

      ReturnRequest.countDocuments({
        status: {
          $in: [
            "requested",
            "approved",
            "picked_up",
            "received",
          ],
        },
      }),
    ]);

    // ========================================================
    // ORDER REVENUE
    // ========================================================

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? Number(
            revenueResult[0]
              .totalRevenue || 0
          )
        : 0;

    // ========================================================
    // RECENT ORDERS
    // ========================================================

    const recentOrders =
      await Order.find()
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "orderNumber user totalAmount status paymentStatus createdAt"
        );

    // ========================================================
    // RECENT RFQs
    // ========================================================

    const recentRFQs =
      await RFQ.find()
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select(
          "rfqNumber user status items createdAt"
        );

    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(200).json({
      success: true,

      dashboard: {
        customers: {
          total: totalCustomers,
        },

        products: {
          total: totalProducts,
        },

        orders: {
          total: totalOrders,
          pending: pendingOrders,
        },

        rfqs: {
          total: totalRFQs,
          pending: pendingRFQs,
        },

        quotations: {
          total: totalQuotations,
          pending: pendingQuotations,
        },

        shipments: {
          total: totalShipments,
        },

        returns: {
          pending: pendingReturns,
        },

        revenue: {
          total: totalRevenue,
          currency: "INR",
        },

        recentOrders,

        recentRFQs,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
};