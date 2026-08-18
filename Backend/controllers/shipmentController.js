const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order');

// @desc  Assign/update carrier & tracking info for an order (admin)
// @route PUT /api/shipments/:orderId
const updateShipment = asyncHandler(async (req, res) => {
  const { carrier, trackingId, trackingUrl, estimatedDelivery } = req.body;

  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (carrier) order.shipment.carrier = carrier;
  if (trackingId) order.shipment.trackingId = trackingId;
  if (trackingUrl) order.shipment.trackingUrl = trackingUrl;
  if (estimatedDelivery) order.shipment.estimatedDelivery = estimatedDelivery;

  await order.save();

  res.status(200).json(new ApiResponse(200, order, 'Shipment details updated'));
});

// @desc  Update order status + push to status history (admin)
// @route PATCH /api/shipments/:orderId/status
const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.orderStatus = status;
  order.shipment.statusHistory.push({ status, note: note || '' });

  await order.save();

  res.status(200).json(new ApiResponse(200, order, 'Shipment status updated'));
});

// @desc  Get tracking info for an order (owner or admin)
// @route GET /api/shipments/:orderId/track
const trackShipment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).select('shipment orderStatus user');
  if (!order) throw new ApiError(404, 'Order not found');

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.status(200).json(
    new ApiResponse(200, {
      orderStatus: order.orderStatus,
      shipment: order.shipment,
    }, 'Tracking info fetched')
  );
});

module.exports = { updateShipment, updateShipmentStatus, trackShipment };