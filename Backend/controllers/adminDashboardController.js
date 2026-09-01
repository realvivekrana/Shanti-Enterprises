// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Controller
// Phase 6 - Admin
// ============================================================

const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const RFQ = require("../models/RFQ");
const Quotation = require("../models/Quotation");
const Shipment = require("../models/Shipment");
const ReturnRequest = require("../models/ReturnRequest");

// ============================================================
// ADMIN DASHBOARD
// ============================================================

const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
      }),

      Product.countDocuments(),

      Category.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "pending",
      }),

      Order.countDocuments({
        orderStatus: "delivered",
      }),

      Order.countDocuments({
        orderStatus: "cancelled",
      }),

      Order.aggregate([
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
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? Number(
            revenueResult[0]
              .totalRevenue || 0
          )
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SALES ANALYTICS
// ============================================================

const getSalesAnalytics = async (
  req,
  res,
  next
) => {
  try {
    const period =
      String(
        req.query.period || "30d"
      ).toLowerCase();

    const requestedDays =
      Number.parseInt(
        period.replace(/[^0-9]/g, ""),
        10
      );

    const days = Math.min(
      Math.max(
        Number.isFinite(requestedDays)
          ? requestedDays
          : 30,
        1
      ),
      365
    );

    const startDate = new Date();

    startDate.setHours(
      0,
      0,
      0,
      0
    );

    startDate.setDate(
      startDate.getDate() - (days - 1)
    );

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: startDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          amount: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          amount: 1,
          orders: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      period: `${days}d`,
      sales,
    });
  } catch (error) {
    next(error);
  }
};

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
        orderStatus: {
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
          "orderNumber user totalAmount orderStatus paymentStatus createdAt"
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
  getDashboardStats,
  getSalesAnalytics,
  getAdminDashboard,
};
