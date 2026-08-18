const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc  Get admin dashboard summary (revenue, orders, stock, top products)
// @route GET /api/dashboard/summary
const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenueResult, totalProducts, totalUsers, lowStockCount, pendingOrders] =
    await Promise.all([
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Product.countDocuments({}),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } }),
      Order.countDocuments({ orderStatus: 'Processing' }),
    ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        lowStockCount,
        pendingOrders,
        topProducts,
        recentOrders,
      },
      'Dashboard summary fetched'
    )
  );
});

// @desc  Get sales report grouped by date (last N days)
// @route GET /api/dashboard/sales-report?days=7
const getSalesReport = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const report = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, report, 'Sales report fetched'));
});

module.exports = { getDashboardSummary, getSalesReport };