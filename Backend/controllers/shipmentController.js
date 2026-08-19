const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Order = require('../models/Order');

const {
  sendShipmentUpdate,
  sendDeliveryUpdate,
} = require('../services/notificationService');


// ======================================================
// UPDATE SHIPMENT DETAILS
// ======================================================

// @desc  Assign/update carrier & tracking info for an order (admin)
// @route PUT /api/shipments/:orderId

const updateShipment = asyncHandler(async (req, res) => {

  const {
    carrier,
    trackingId,
    trackingUrl,
    estimatedDelivery,
  } = req.body;


  // ====================================================
  // FIND ORDER
  // ====================================================

  const order =
    await Order.findById(
      req.params.orderId
    );


  if (!order) {

    throw new ApiError(
      404,
      'Order not found'
    );

  }


  // ====================================================
  // UPDATE SHIPMENT DETAILS
  // ====================================================

  if (carrier) {

    order.shipment.carrier =
      carrier;

  }


  if (trackingId) {

    order.shipment.trackingId =
      trackingId;

  }


  if (trackingUrl) {

    order.shipment.trackingUrl =
      trackingUrl;

  }


  if (estimatedDelivery) {

    order.shipment.estimatedDelivery =
      estimatedDelivery;

  }


  // ====================================================
  // SAVE
  // ====================================================

  await order.save();


  // ====================================================
  // SEND SHIPMENT NOTIFICATION
  // ====================================================

  try {

    await sendShipmentUpdate({

      userId:
        order.user,

      orderId:
        order._id,

      status:
        order.shipment.status ||
        order.orderStatus ||
        'Shipment Updated',

      trackingId:
        order.shipment.trackingId ||
        null,

    });

  } catch (error) {

    console.error(
      'Shipment notification failed:',
      error.message
    );

  }


  // ====================================================
  // RESPONSE
  // ====================================================

  res.status(200).json(

    new ApiResponse(

      200,

      order,

      'Shipment details updated'

    )

  );

});


// ======================================================
// UPDATE SHIPMENT STATUS
// ======================================================

// @desc  Update order status + push to status history (admin)
// @route PATCH /api/shipments/:orderId/status

const updateShipmentStatus =
  asyncHandler(async (req, res) => {

    const {
      status,
      note,
    } = req.body;


    // ==================================================
    // VALID STATUSES
    // ==================================================

    const validStatuses = [

      'Processing',

      'Shipped',

      'Out for Delivery',

      'Delivered',

      'Cancelled',

    ];


    if (
      !validStatuses.includes(
        status
      )
    ) {

      throw new ApiError(

        400,

        `Status must be one of: ${
          validStatuses.join(', ')
        }`

      );

    }


    // ==================================================
    // FIND ORDER
    // ==================================================

    const order =
      await Order.findById(
        req.params.orderId
      );


    if (!order) {

      throw new ApiError(
        404,
        'Order not found'
      );

    }


    // ==================================================
    // SAVE OLD STATUS
    // ==================================================

    const oldStatus =
      order.orderStatus;


    // ==================================================
    // UPDATE ORDER STATUS
    // ==================================================

    order.orderStatus =
      status;


    // ==================================================
    // UPDATE SHIPMENT STATUS
    // ==================================================

    order.shipment.status =
      status;


    // ==================================================
    // STATUS HISTORY
    // ==================================================

    if (
      !Array.isArray(
        order.shipment.statusHistory
      )
    ) {

      order.shipment.statusHistory =
        [];

    }


    order.shipment.statusHistory.push({

      status,

      note:
        note || '',

    });


    // ==================================================
    // SAVE
    // ==================================================

    await order.save();


    // ==================================================
    // DELIVERY NOTIFICATION
    // ==================================================

    const deliveryStatuses = [

      'Out for Delivery',

      'Delivered',

    ];


    const isDeliveryUpdate =
      deliveryStatuses.includes(
        status
      );


    try {

      if (
        isDeliveryUpdate
      ) {

        await sendDeliveryUpdate({

          userId:
            order.user,

          orderId:
            order._id,

          status,

        });

      } else {

        await sendShipmentUpdate({

          userId:
            order.user,

          orderId:
            order._id,

          status,

          trackingId:
            order.shipment.trackingId ||
            null,

        });

      }

    } catch (error) {

      console.error(
        'Shipment/Delivery notification failed:',
        error.message
      );

    }


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json(

      new ApiResponse(

        200,

        {

          order,

          previousStatus:
            oldStatus,

          currentStatus:
            status,

        },

        'Shipment status updated'

      )

    );

  });


// ======================================================
// TRACK SHIPMENT
// ======================================================

// @desc  Get tracking info for an order (owner or admin)
// @route GET /api/shipments/:orderId/track

const trackShipment =
  asyncHandler(async (req, res) => {

    const order =
      await Order.findById(
        req.params.orderId
      )
        .select(
          'shipment orderStatus user'
        );


    if (!order) {

      throw new ApiError(
        404,
        'Order not found'
      );

    }


    // ==================================================
    // OWNER / ADMIN AUTHORIZATION
    // ==================================================

    if (

      order.user.toString() !==
      req.user._id.toString()

      &&

      req.user.role !==
      'admin'

    ) {

      throw new ApiError(
        403,
        'Not authorized to view this order'
      );

    }


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json(

      new ApiResponse(

        200,

        {

          orderStatus:
            order.orderStatus,

          shipment:
            order.shipment,

        },

        'Tracking info fetched'

      )

    );

  });


module.exports = {

  updateShipment,

  updateShipmentStatus,

  trackShipment,

};