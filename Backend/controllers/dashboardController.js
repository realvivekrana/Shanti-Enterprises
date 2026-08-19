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

const CustomerCredit =
  require('../models/CustomerCredit');


// ======================================================
// ADMIN DASHBOARD SUMMARY
// ======================================================

const getDashboardSummary =
  asyncHandler(async (req, res) => {

    // ==================================================
    // TODAY START
    // ==================================================

    const todayStart =
      new Date();

    todayStart.setHours(
      0,
      0,
      0,
      0
    );


    // ==================================================
    // BASIC COUNTS
    // ==================================================

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

    ] = await Promise.all([

      Order.countDocuments({}),


      Order.countDocuments({

        createdAt: {

          $gte:
            todayStart,

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

        role:
          'customer',

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

        status:
          'Refunded',

      }),

    ]);


    // ==================================================
    // TOTAL REVENUE
    // ==================================================

    const totalRevenueResult =
      await Order.aggregate([

        {

          $match: {

            isPaid:
              true,

            orderStatus: {

              $ne:
                'Cancelled',

            },

          },

        },

        {

          $group: {

            _id:
              null,

            total: {

              $sum:
                '$totalPrice',

            },

          },

        },

      ]);


    const totalRevenue =
      totalRevenueResult[0]
        ?.total || 0;


    // ==================================================
    // TODAY SALES
    // ==================================================

    const todaySalesResult =
      await Order.aggregate([

        {

          $match: {

            isPaid:
              true,

            orderStatus: {

              $ne:
                'Cancelled',

            },

            createdAt: {

              $gte:
                todayStart,

            },

          },

        },

        {

          $group: {

            _id:
              null,

            total: {

              $sum:
                '$totalPrice',

            },

          },

        },

      ]);


    const todaySales =
      todaySalesResult[0]
        ?.total || 0;


    // ==================================================
    // REFUND AMOUNT
    // ==================================================

    const refundResult =
      await ReturnRequest.aggregate([

        {

          $match: {

            status:
              'Refunded',

          },

        },

        {

          $group: {

            _id:
              null,

            total: {

              $sum:
                '$refund.amount',

            },

          },

        },

      ]);


    const totalRefunds =
      refundResult[0]
        ?.total || 0;


    // ==================================================
    // OUTSTANDING CREDIT
    // ==================================================

    const creditResult =
      await CustomerCredit.aggregate([

        {

          $group: {

            _id:
              null,

            totalDue: {

              $sum:
                '$dueAmount',

            },

            totalUsedCredit: {

              $sum:
                '$usedCredit',

            },

            totalCreditLimit: {

              $sum:
                '$creditLimit',

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


    // ==================================================
    // TOP PRODUCTS
    // ==================================================

    const topProducts =
      await Order.aggregate([

        {

          $match: {

            orderStatus: {

              $ne:
                'Cancelled',

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

            totalSold:
              -1,

          },

        },

        {

          $limit:
            5,

        },

      ]);


    // ==================================================
    // RECENT ORDERS
    // ==================================================

    const recentOrders =
      await Order.find({})

        .populate(

          'user',

          'name email businessName'

        )

        .sort({

          createdAt:
            -1,

        })

        .limit(8);


    // ==================================================
    // LOW STOCK PRODUCTS
    // ==================================================

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

          stock:
            1,

        })

        .limit(10);


    // ==================================================
    // RESPONSE
    // ==================================================

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


// ======================================================
// SALES REPORT
// ======================================================

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

            isPaid:
              true,

            orderStatus: {

              $ne:
                'Cancelled',

            },

            createdAt: {

              $gte:
                startDate,

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

              $sum:
                1,

            },

          },

        },

        {

          $sort: {

            _id:
              1,

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


// ======================================================
// REPORTS & ANALYTICS
// ======================================================
//
// GET:
//
// /api/dashboard/reports
//
// Example:
//
// /api/dashboard/reports?months=12
//
// ======================================================

const getReportsAnalytics =
  asyncHandler(async (req, res) => {

    // ==================================================
    // NUMBER OF MONTHS
    // ==================================================

    let months =
      Number(
        req.query.months
      ) || 12;


    // Minimum 1 month

    if (
      months < 1
    ) {

      months = 1;

    }


    // Maximum 24 months

    if (
      months > 24
    ) {

      months = 24;

    }


    // ==================================================
    // START DATE
    // ==================================================

    const startDate =
      new Date();


    startDate.setMonth(

      startDate.getMonth() -
        (months - 1)

    );


    startDate.setDate(
      1
    );


    startDate.setHours(
      0,
      0,
      0,
      0
    );


    // ==================================================
    // COMMON ORDER FILTER
    // ==================================================

    const baseOrderMatch = {

      isPaid:
        true,

      orderStatus: {

        $ne:
          'Cancelled',

      },

      createdAt: {

        $gte:
          startDate,

      },

    };


    // ==================================================
    // 1. MONTHLY SALES
    // ==================================================

    const monthlySales =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

        },

        {

          $group: {

            _id: {

              year: {

                $year:
                  '$createdAt',

              },

              month: {

                $month:
                  '$createdAt',

              },

            },

            sales: {

              $sum:
                '$totalPrice',

            },

            orders: {

              $sum:
                1,

            },

          },

        },

        {

          $sort: {

            '_id.year':
              1,

            '_id.month':
              1,

          },

        },

      ]);


    // ==================================================
    // 2. TOP PRODUCTS
    // ==================================================

    const topReportProducts =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

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

            quantity: {

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

            quantity:
              -1,

          },

        },

        {

          $limit:
            10,

        },

      ]);


    // ==================================================
    // 3. TOP CUSTOMERS
    // ==================================================

    const topCustomers =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

        },

        {

          $group: {

            _id:
              '$user',

            orders: {

              $sum:
                1,

            },

            totalSpent: {

              $sum:
                '$totalPrice',

            },

          },

        },

        {

          $sort: {

            totalSpent:
              -1,

          },

        },

        {

          $limit:
            10,

          },

        {

          $lookup: {

            from:
              'users',

            localField:
              '_id',

            foreignField:
              '_id',

            as:
              'customer',

          },

        },

        {

          $unwind: {

            path:
              '$customer',

            preserveNullAndEmptyArrays:
              true,

          },

        },

        {

          $project: {

            _id:
              1,

            orders:
              1,

            totalSpent:
              1,

            name:
              '$customer.name',

            email:
              '$customer.email',

            businessName:
              '$customer.businessName',

          },

        },

      ]);


    // ==================================================
    // 4. AVERAGE ORDER VALUE
    // ==================================================

    const aovResult =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

        },

        {

          $group: {

            _id:
              null,

            totalSales: {

              $sum:
                '$totalPrice',

            },

            totalOrders: {

              $sum:
                1,

            },

          },

        },

        {

          $project: {

            _id:
              0,

            totalSales:
              1,

            totalOrders:
              1,

            averageOrderValue: {

              $cond: [

                {

                  $gt: [

                    '$totalOrders',

                    0,

                  ],

                },

                {

                  $divide: [

                    '$totalSales',

                    '$totalOrders',

                  ],

                },

                0,

              ],

            },

          },

        },

      ]);


    const averageOrderValue =
      aovResult[0]
        ?.averageOrderValue || 0;


    // ==================================================
    // 5. MOST ORDERED CATEGORY
    // ==================================================

    const categorySales =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

        },

        {

          $unwind:
            '$orderItems',

        },

        {

          $lookup: {

            from:
              'products',

            localField:
              'orderItems.product',

            foreignField:
              '_id',

            as:
              'product',

          },

        },

        {

          $unwind: {

            path:
              '$product',

            preserveNullAndEmptyArrays:
              false,

          },

        },

        {

          $group: {

            _id:
              '$product.category',

            quantity: {

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

            quantity:
              -1,

          },

        },

      ]);


    const mostOrderedCategory =
      categorySales[0] || null;


    // ==================================================
    // 6. PENDING PAYMENTS
    // ==================================================

    const pendingPaymentResult =
      await Order.aggregate([

        {

          $match: {

            isPaid:
              false,

            orderStatus: {

              $ne:
                'Cancelled',

            },

          },

        },

        {

          $group: {

            _id:
              null,

            count: {

              $sum:
                1,

            },

            amount: {

              $sum:
                '$totalPrice',

            },

          },

        },

      ]);


    const pendingPayments = {

      count:
        pendingPaymentResult[0]
          ?.count || 0,

      amount:
        pendingPaymentResult[0]
          ?.amount || 0,

    };


    // ==================================================
    // 7. RETURNED PRODUCTS
    // ==================================================

    const returnedProducts =
      await ReturnRequest.aggregate([

        {

          $match: {

            status: {

              $nin: [

                'Rejected',

                'Cancelled',

              ],

            },

          },

        },

        {

          $unwind:
            '$items',

        },

        {

          $group: {

            _id:
              '$items.product',

            name: {

              $first:
                '$items.name',

            },

            quantity: {

              $sum:
                '$items.returnQuantity',

            },

            refundValue: {

              $sum: {

                $multiply: [

                  '$items.returnQuantity',

                  '$items.price',

                ],

              },

            },

          },

        },

        {

          $sort: {

            quantity:
              -1,

          },

        },

        {

          $limit:
            10,

        },

      ]);


    // ==================================================
    // 8. REFUND ANALYTICS
    // ==================================================

    const refundAnalytics =
      await ReturnRequest.aggregate([

        {

          $match: {

            status:
              'Refunded',

          },

        },

        {

          $group: {

            _id:
              null,

            totalRefunds: {

              $sum:
                '$refund.amount',

            },

            refundCount: {

              $sum:
                1,

            },

          },

        },

      ]);


    const totalRefunds =
      refundAnalytics[0]
        ?.totalRefunds || 0;


    const refundCount =
      refundAnalytics[0]
        ?.refundCount || 0;


    // ==================================================
    // 9. PROFIT / MARGIN
    // ==================================================
    //
    // Revenue:
    //
    // quantity × selling price
    //
    // Cost:
    //
    // quantity × costPrice
    //
    // Profit:
    //
    // revenue - cost
    //
    // Margin:
    //
    // profit / revenue × 100
    //
    // ==================================================

    const profitResult =
      await Order.aggregate([

        {

          $match:
            baseOrderMatch,

        },

        {

          $unwind:
            '$orderItems',

        },

        {

          $lookup: {

            from:
              'products',

            localField:
              'orderItems.product',

            foreignField:
              '_id',

            as:
              'product',

          },

        },

        {

          $unwind: {

            path:
              '$product',

            preserveNullAndEmptyArrays:
              true,

          },

        },

        {

          $project: {

            revenue: {

              $multiply: [

                '$orderItems.quantity',

                '$orderItems.price',

              ],

            },

            cost: {

              $multiply: [

                '$orderItems.quantity',

                {

                  $ifNull: [

                    '$product.costPrice',

                    0,

                  ],

                },

              ],

            },

          },

        },

        {

          $group: {

            _id:
              null,

            revenue: {

              $sum:
                '$revenue',

            },

            cost: {

              $sum:
                '$cost',

            },

          },

        },

      ]);


    const grossRevenue =
      profitResult[0]
        ?.revenue || 0;


    const productCost =
      profitResult[0]
        ?.cost || 0;


    const grossProfit =
      grossRevenue -
      productCost;


    const profitMargin =
      grossRevenue > 0

        ? (
            grossProfit /
            grossRevenue
          ) * 100

        : 0;


    // ==================================================
    // 10. TOTAL SALES
    // ==================================================

    const totalSales =
      monthlySales.reduce(

        (
          total,
          item
        ) => {

          return (

            total +
            Number(
              item.sales || 0
            )

          );

        },

        0

      );


    // ==================================================
    // 11. TOTAL ORDERS
    // ==================================================

    const totalOrdersInPeriod =
      monthlySales.reduce(

        (
          total,
          item
        ) => {

          return (

            total +
            Number(
              item.orders || 0
            )

          );

        },

        0

      );


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json(

      new ApiResponse(

        200,

        {

          // ============================================
          // PERIOD
          // ============================================

          period: {

            months,

            startDate,

            endDate:
              new Date(),

          },


          // ============================================
          // SALES
          // ============================================

          monthlySales,

          totalSales,

          totalOrders:
            totalOrdersInPeriod,


          // ============================================
          // TOP PRODUCTS
          // ============================================

          topProducts:
            topReportProducts,


          // ============================================
          // TOP CUSTOMERS
          // ============================================

          topCustomers,


          // ============================================
          // AVERAGE ORDER VALUE
          // ============================================

          averageOrderValue,


          // ============================================
          // CATEGORY
          // ============================================

          mostOrderedCategory,

          categorySales,


          // ============================================
          // PENDING PAYMENTS
          // ============================================

          pendingPayments,


          // ============================================
          // RETURNED PRODUCTS
          // ============================================

          returnedProducts,


          // ============================================
          // REFUNDS
          // ============================================

          refundAnalytics: {

            totalRefunds,

            refundCount,

          },


          // ============================================
          // PROFIT
          // ============================================

          profit: {

            revenue:
              grossRevenue,

            productCost,

            grossProfit,

            profitMargin:

              Number(
                profitMargin.toFixed(2)
              ),

          },

        },

        'Reports and analytics fetched successfully'

      )

    );

  });


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getDashboardSummary,

  getSalesReport,

  getReportsAnalytics,

};