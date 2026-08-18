const asyncHandler =
  require('../utils/asyncHandler');

const ApiResponse =
  require('../utils/ApiResponse');

const Order =
  require('../models/Order');

const Product =
  require('../models/Product');

const User =
  require('../models/User');

const ReturnRequest =
  require('../models/ReturnRequest');

// Credit model
const CustomerCredit =
  require('../models/CustomerCredit');

// ==============================
// ADMIN DASHBOARD SUMMARY
// ==============================

const getDashboardSummary =
  asyncHandler(async (req, res) => {
    // ==============================
    // TODAY START
    // ==============================

    const todayStart =
      new Date();

    todayStart.setHours(
      0,
      0,
      0,
      0
    );

    // ==============================
    // BASIC COUNTS
    // ==============================

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      lowStockCount,
      totalReturns,
      pendingReturns,
      refundedReturns,
    ] =
      await Promise.all([
        Order.countDocuments({}),

        Order.countDocuments({
          createdAt: {
            $gte: todayStart,
          },
        }),

        Order.countDocuments({
          orderStatus: {
            $in: [
              'Placed',
              'Confirmed',
              'Processing',
              'Packed',
            ],
          },
        }),

        Product.countDocuments({}),

        User.countDocuments({
          role: 'customer',
        }),

        Product.countDocuments({
          $expr: {
            $lte: [
              '$stock',
              '$lowStockThreshold',
            ],
          },
        }),

        ReturnRequest.countDocuments({}),

        ReturnRequest.countDocuments({
          status: {
            $in: [
              'Requested',
              'Under Review',
              'Approved',
              'Pickup Scheduled',
              'Picked Up',
              'Received',
              'Inspection',
              'Refund Pending',
            ],
          },
        }),

        ReturnRequest.countDocuments({
          status: 'Refunded',
        }),
      ]);

    // ==============================
    // TOTAL REVENUE
    // ==============================

    const totalRevenueResult =
      await Order.aggregate([
        {
          $match: {
            isPaid: true,

            orderStatus: {
              $ne: 'Cancelled',
            },
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: '$totalPrice',
            },
          },
        },
      ]);

    const totalRevenue =
      totalRevenueResult[0]
        ?.total || 0;

    // ==============================
    // TODAY SALES
    // ==============================

    const todaySalesResult =
      await Order.aggregate([
        {
          $match: {
            isPaid: true,

            orderStatus: {
              $ne: 'Cancelled',
            },

            createdAt: {
              $gte: todayStart,
            },
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: '$totalPrice',
            },
          },
        },
      ]);

    const todaySales =
      todaySalesResult[0]
        ?.total || 0;

    // ==============================
    // REFUND AMOUNT
    // ==============================

    const refundResult =
      await ReturnRequest.aggregate([
        {
          $match: {
            status: 'Refunded',
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: '$refund.amount',
            },
          },
        },
      ]);

    const totalRefunds =
      refundResult[0]
        ?.total || 0;

    // ==============================
    // OUTSTANDING CREDIT
    // ==============================

    const creditResult =
      await CustomerCredit.aggregate([
        {
          $group: {
            _id: null,

            totalDue: {
              $sum: '$dueAmount',
            },

            totalUsedCredit: {
              $sum: '$usedCredit',
            },

            totalCreditLimit: {
              $sum: '$creditLimit',
            },
          },
        },
      ]);

    const outstandingPayments =
      creditResult[0]
        ?.totalDue || 0;

    const totalUsedCredit =
      creditResult[0]
        ?.totalUsedCredit || 0;

    const totalCreditLimit =
      creditResult[0]
        ?.totalCreditLimit || 0;

    // ==============================
    // TOP PRODUCTS
    // ==============================

    const topProducts =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: 'Cancelled',
            },
          },
        },

        {
          $unwind:
            '$orderItems',
        },

        {
          $group: {
            _id:
              '$orderItems.product',

            name: {
              $first:
                '$orderItems.name',
            },

            totalSold: {
              $sum:
                '$orderItems.quantity',
            },

            revenue: {
              $sum: {
                $multiply: [
                  '$orderItems.quantity',
                  '$orderItems.price',
                ],
              },
            },
          },
        },

        {
          $sort: {
            totalSold: -1,
          },
        },

        {
          $limit: 5,
        },
      ]);

    // ==============================
    // RECENT ORDERS
    // ==============================

    const recentOrders =
      await Order.find({})
        .populate(
          'user',
          'name email businessName'
        )
        .sort({
          createdAt: -1,
        })
        .limit(8);

    // ==============================
    // LOW STOCK PRODUCTS
    // ==============================

    const lowStockProducts =
      await Product.find({
        $expr: {
          $lte: [
            '$stock',
            '$lowStockThreshold',
          ],
        },
      })
        .select(
          'name sku stock lowStockThreshold'
        )
        .sort({
          stock: 1,
        })
        .limit(10);

    // ==============================
    // RESPONSE
    // ==============================

    res.status(200).json(
      new ApiResponse(
        200,
        {
          totalOrders,

          todayOrders,

          pendingOrders,

          totalProducts,

          totalUsers,

          lowStockCount,

          totalReturns,

          pendingReturns,

          refundedReturns,

          totalRevenue,

          todaySales,

          totalRefunds,

          outstandingPayments,

          totalUsedCredit,

          totalCreditLimit,

          topProducts,

          recentOrders,

          lowStockProducts,
        },

        'Dashboard summary fetched'
      )
    );
  });

// ==============================
// SALES REPORT
// ==============================

const getSalesReport =
  asyncHandler(async (req, res) => {
    const days =
      Number(
        req.query.days
      ) || 7;

    const startDate =
      new Date();

    startDate.setDate(
      startDate.getDate() -
        days
    );

    const report =
      await Order.aggregate([
        {
          $match: {
            isPaid: true,

            orderStatus: {
              $ne: 'Cancelled',
            },

            createdAt: {
              $gte: startDate,
            },
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format:
                  '%Y-%m-%d',

                date:
                  '$createdAt',
              },
            },

            revenue: {
              $sum:
                '$totalPrice',
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    res.status(200).json(
      new ApiResponse(
        200,
        report,
        'Sales report fetched'
      )
    );
  });

module.exports = {
  getDashboardSummary,
  getSalesReport,
};