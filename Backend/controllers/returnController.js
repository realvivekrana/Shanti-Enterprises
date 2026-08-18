const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');

// @desc  Create a return/refund request (customer, only for delivered orders)
// @route POST /api/returns/:orderId
const createReturnRequest = asyncHandler(async (req, res) => {
  const { reason, type } = req.body;
  const { orderId } = req.params;

  if (!reason || !type) throw new ApiError(400, 'Reason and type (return/refund) are required');

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized for this order');
  }

  if (order.orderStatus !== 'Delivered') {
    throw new ApiError(400, 'Only delivered orders can be returned or refunded');
  }

  const existing = await ReturnRequest.findOne({ order: orderId });
  if (existing) throw new ApiError(400, 'A return/refund request already exists for this order');

  const returnRequest = await ReturnRequest.create({
    order: orderId,
    user: req.user._id,
    reason,
    type,
  });

  res.status(201).json(new ApiResponse(201, returnRequest, 'Return/refund request submitted'));
});

// @desc  Get logged-in user's return requests
// @route GET /api/returns/mine
const getMyReturnRequests = asyncHandler(async (req, res) => {
  const requests = await ReturnRequest.find({ user: req.user._id })
    .populate('order', 'totalPrice orderStatus')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, requests, 'Your return requests fetched'));
});

// @desc  Get all return requests (admin)
// @route GET /api/returns
const getAllReturnRequests = asyncHandler(async (req, res) => {
  const requests = await ReturnRequest.find({})
    .populate('user', 'name email')
    .populate('order', 'totalPrice orderStatus')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, requests, 'All return requests fetched'));
});

// @desc  Update return request status (admin)
// @route PATCH /api/returns/:id
const updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  const validStatuses = ['Requested', 'Approved', 'Rejected', 'Completed'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  const request = await ReturnRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Return request not found');

  request.status = status;
  if (adminNote) request.adminNote = adminNote;
  await request.save();

  res.status(200).json(new ApiResponse(200, request, 'Return request status updated'));
});

module.exports = { createReturnRequest, getMyReturnRequests, getAllReturnRequests, updateReturnStatus };