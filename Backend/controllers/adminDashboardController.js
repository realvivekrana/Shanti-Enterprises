const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');


// ======================================================
// ADMIN DASHBOARD OVERVIEW
// ======================================================

const getAdminDashboardOverview = asyncHandler(
  async (req, res) => {

    // ==================================================
    // BASIC COUNTS
    // ==================================================

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
    ] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({
        role: {
          $ne: 'admin',
        },
      }),
    ]);


    // ==================================================
    // ORDER STATUS COUNTS
    // ==================================================

    const [
      pendingOrders,
      processingOrders,
      packedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      Order.countDocuments({
        orderStatus: 'Pending',
      }),

      Order.countDocuments({
        orderStatus: 'Processing',
      }),

      Order.countDocuments({
        orderStatus: 'Packed',
      }),

      Order.countDocuments({
        orderStatus: 'Shipped',
      }),

      Order.countDocuments({
        orderStatus: 'Delivered',
      }),

      Order.countDocuments({
        orderStatus: 'Cancelled',
      }),
    ]);


    // ==================================================
    // LOW STOCK
    // ==================================================

    const lowStockProducts =
      await Product.find({
        $expr: {
          $lte: [
            '$stock',
            {
              $multiply: [
                {
                  $ifNull: [
                    '$moq',
                    1,
                  ],
                },
                2,
              ],
            },
          ],
        },
      })
        .select(
          'name sku stock moq price images'
        )
        .sort({
          stock: 1,
        })
        .limit(10)
        .lean();


    // ==================================================
    // OUT OF STOCK
    // ==================================================

    const outOfStockProducts =
      await Product.countDocuments({
        stock: {
          $lte: 0,
        },
      });


    // ==================================================
    // SALES
    // ==================================================

    const salesResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: 'Cancelled',
            },
          },
        },

        {
          $group: {
            _id: null,

            totalSales: {
              $sum: {
                $ifNull: [
                  '$totalPrice',
                  0,
                ],
              },
            },

            totalItems: {
              $sum: {
                $reduce: {
                  input: {
                    $ifNull: [
                      '$orderItems',
                      [],
                    ],
                  },

                  initialValue: 0,

                  in: {
                    $add: [
                      '$$value',

                      {
                        $ifNull: [
                          '$$this.quantity',
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      ]);


    const totalSales =
      Number(
        salesResult?.[0]?.totalSales ||
        0
      );


    const totalItemsSold =
      Number(
        salesResult?.[0]?.totalItems ||
        0
      );


    // ==================================================
    // AVERAGE ORDER VALUE
    // ==================================================

    const averageOrderValue =
      totalOrders > 0
        ? totalSales / totalOrders
        : 0;


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
          createdAt: -1,
        })
        .limit(10)
        .lean();


    // ==================================================
    // TOP PRODUCTS
    // ==================================================

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
          $unwind: '$orderItems',
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
                  {
                    $ifNull: [
                      '$orderItems.price',
                      0,
                    ],
                  },

                  {
                    $ifNull: [
                      '$orderItems.quantity',
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
            revenue: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);


    // ==================================================
    // RECENT CUSTOMERS
    // ==================================================

    const recentCustomers =
      await User.find({
        role: {
          $ne: 'admin',
        },
      })
        .select(
          'name email businessName createdAt'
        )
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean();


    // ==================================================
    // DASHBOARD RESPONSE
    // ==================================================

    const dashboardData = {

      summary: {

        totalSales,

        totalOrders,

        totalCustomers,

        totalProducts,

        totalItemsSold,

        averageOrderValue,

        outOfStockProducts,

      },


      orders: {

        pending:
          pendingOrders,

        processing:
          processingOrders,

        packed:
          packedOrders,

        shipped:
          shippedOrders,

        delivered:
          deliveredOrders,

        cancelled:
          cancelledOrders,

      },


      lowStockProducts,

      recentOrders,

      topProducts,

      recentCustomers,

    };


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json(

      new ApiResponse(
        200,
        dashboardData,
        'Admin dashboard data fetched successfully'
      )

    );
  }
);


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getAdminDashboardOverview,
};