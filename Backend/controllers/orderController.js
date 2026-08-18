const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const { orderConfirmationTemplate } = require('../utils/emailTemplates');

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  sendEmail({
    to: req.user.email,
    subject: 'Order Confirmation - Shanti Enterprises',
    html: orderConfirmationTemplate(createdOrder, req.user.name),
  });

  res.status(201).json(new ApiResponse(201, createdOrder, 'Order created successfully'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, 'Your orders fetched'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.status(200).json(new ApiResponse(200, order, 'Order fetched'));
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.updateTime };

  const updatedOrder = await order.save();
  res.status(200).json(new ApiResponse(200, updatedOrder, 'Order marked as paid'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, orders, 'All orders fetched'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.trackingId) order.trackingId = req.body.trackingId;

  const updatedOrder = await order.save();
  res.status(200).json(new ApiResponse(200, updatedOrder, 'Order status updated'));
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderStatus };