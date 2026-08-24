// ============================================================
// SHANTI ENTERPRISES
// Admin Reports Controller
// Phase 6 - Admin
// ============================================================

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// ============================================================
// ADMIN OVERVIEW REPORT
// ============================================================

const getAdminOverviewReport = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      orderStats,
      customerStats,
      productStats,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
      }),

      Product.countDocuments(),

      Order.countDocuments(),

      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $ifNull: [
                  "$totalAmount",
                  0,
                ],
              },
            },
            averageOrderValue: {
              $avg: {
                $ifNull: [
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },
      ]),

      User.aggregate([
        {
          $group: {
            _id: "$isActive",
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Product.aggregate([
        {
          $group: {
            _id: null,

            totalStock: {
              $sum: {
                $ifNull: [
                  "$stock",
                  0,
                ],
              },
            },

            lowStockProducts: {
              $sum: {
                $cond: [
                  {
                    $lte: [
                      {
                        $ifNull: [
                          "$stock",
                          0,
                        ],
                      },
                      {
                        $ifNull: [
                          "$lowStockThreshold",
                          10,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const revenueData =
      orderStats[0] || {};

    const productData =
      productStats[0] || {};

    const activeCustomers =
      customerStats.find(
        (item) =>
          item._id === true
      );

    const inactiveCustomers =
      customerStats.find(
        (item) =>
          item._id === false
      );

    res.status(200).json({
      success: true,

      report: {
        customers: {
          total: totalCustomers,

          active:
            activeCustomers
              ? activeCustomers.count
              : 0,

          inactive:
            inactiveCustomers
              ? inactiveCustomers.count
              : 0,
        },

        products: {
          total: totalProducts,

          totalStock:
            productData.totalStock || 0,

          lowStockProducts:
            productData.lowStockProducts ||
            0,
        },

        orders: {
          total: totalOrders,

          totalRevenue:
            revenueData.totalRevenue ||
            0,

          averageOrderValue:
            revenueData.averageOrderValue ||
            0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ORDER STATUS REPORT
// ============================================================

const getOrderStatusReport = async (
  req,
  res,
  next
) => {
  try {
    const report =
      await Order.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },

            revenue: {
              $sum: {
                $ifNull: [
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);

    res.status(200).json({
      success: true,

      report,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// MONTHLY SALES REPORT
// ============================================================

const getMonthlySalesReport = async (
  req,
  res,
  next
) => {
  try {
    const year = Number(
      req.query.year
    ) || new Date().getFullYear();

    const report =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                `${year}-01-01T00:00:00.000Z`
              ),

              $lt: new Date(
                `${year + 1}-01-01T00:00:00.000Z`
              ),
            },
          },
        },

        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },

            orders: {
              $sum: 1,
            },

            revenue: {
              $sum: {
                $ifNull: [
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);

    res.status(200).json({
      success: true,

      year,

      report,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// TOP PRODUCTS REPORT
// ============================================================

const getTopProductsReport = async (
  req,
  res,
  next
) => {
  try {
    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      50
    );

    const report =
      await Order.aggregate([
        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.product",

            quantitySold: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },

            revenue: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.price",
                      0,
                    ],
                  },
                  {
                    $ifNull: [
                      "$items.quantity",
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },

        {
          $sort: {
            quantitySold: -1,
          },
        },

        {
          $limit: limit,
        },
      ]);

    res.status(200).json({
      success: true,

      report,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOW STOCK REPORT
// ============================================================

const getLowStockReport = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await Product.find({
        $expr: {
          $lte: [
            {
              $ifNull: [
                "$stock",
                0,
              ],
            },
            {
              $ifNull: [
                "$lowStockThreshold",
                10,
              ],
            },
          ],
        },
      })
        .select(
          "name sku stock lowStockThreshold price isActive"
        )
        .sort({
          stock: 1,
        });

    res.status(200).json({
      success: true,

      count: products.length,

      products,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getAdminOverviewReport,
  getOrderStatusReport,
  getMonthlySalesReport,
  getTopProductsReport,
  getLowStockReport,
};