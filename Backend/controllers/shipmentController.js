const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const Order =
  require('../models/Order');


// ======================================================
// NOTIFICATIONS
// ======================================================

const {
  sendShipmentUpdate,
  sendDeliveryUpdate,
} = require(
  '../services/notificationService'
);


// ======================================================
// SHIPROCKET SERVICE
// ======================================================

const {
  isConfigured:
    isShiprocketConfigured,

  createShiprocketOrder,

  assignAWB,

  requestPickup,

  trackByAWB,

  generateLabel,

  generateInvoice,

  cancelShipment,

} = require(
  '../services/shiprocketService'
);


// ======================================================
// HELPER
// ======================================================

const getOrder =
  async (orderId) => {

    const order =
      await Order.findById(
        orderId
      )
        .populate(
          'user',
          'name email phone'
        )
        .populate(
          'orderItems.product',
          'name sku'
        );


    if (!order) {

      throw new ApiError(
        404,
        'Order not found'
      );

    }


    return order;

  };


// ======================================================
// AUTHORIZATION HELPER
// ======================================================

const authorizeOrderAccess = (
  order,
  user
) => {

  if (!user) {

    throw new ApiError(
      401,
      'Authentication required'
    );

  }


  const isOwner =

    order.user?._id
      ?.toString() ===
    user._id.toString();


  const isAdmin =

    user.role ===
    'admin';


  if (
    !isOwner &&
    !isAdmin
  ) {

    throw new ApiError(
      403,
      'Not authorized to access this order'
    );

  }

};


// ======================================================
// UPDATE SHIPMENT DETAILS
// ======================================================

// @desc  Assign/update carrier & tracking info
// @route PUT /api/shipments/:orderId

const updateShipment =
  asyncHandler(
    async (req, res) => {

      const {

        carrier,

        trackingId,

        trackingUrl,

        estimatedDelivery,

      } = req.body;


      // ==============================================
      // FIND ORDER
      // ==============================================

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


      // ==============================================
      // UPDATE SHIPMENT DETAILS
      // ==============================================

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


      // ==============================================
      // SAVE
      // ==============================================

      await order.save();


      // ==============================================
      // NOTIFICATION
      // ==============================================

      try {

        await sendShipmentUpdate({

          userId:
            order.user,

          orderId:
            order._id,

          status:
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


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          order,

          'Shipment details updated'

        )

      );

    }
  );


// ======================================================
// UPDATE SHIPMENT STATUS
// ======================================================

// @desc  Update order shipment status
// @route PATCH /api/shipments/:orderId/status

const updateShipmentStatus =
  asyncHandler(
    async (req, res) => {

      const {

        status,

        note,

      } = req.body;


      // ==============================================
      // VALID STATUSES
      // ==============================================

      const validStatuses = [

        'Processing',

        'Packed',

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


      // ==============================================
      // FIND ORDER
      // ==============================================

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


      // ==============================================
      // OLD STATUS
      // ==============================================

      const oldStatus =
        order.orderStatus;


      // ==============================================
      // UPDATE ORDER STATUS
      // ==============================================

      order.orderStatus =
        status;


      // ==============================================
      // STATUS HISTORY
      // ==============================================

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

        timestamp:
          new Date(),

      });


      // ==============================================
      // UPDATE SHIPROCKET STATUS
      // ==============================================

      if (
        order.shipment.shiprocket
      ) {

        order.shipment.shiprocket.status =
          status;

        order.shipment.shiprocket.lastSyncedAt =
          new Date();

      }


      // ==============================================
      // SAVE
      // ==============================================

      await order.save();


      // ==============================================
      // DELIVERY NOTIFICATION
      // ==============================================

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


      // ==============================================
      // RESPONSE
      // ==============================================

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

    }
  );


// ======================================================
// CREATE SHIPROCKET SHIPMENT
// ======================================================

// @desc  Create order in Shiprocket
// @route POST /api/shipments/:orderId/shiprocket/create

const createShiprocketShipment =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // CONFIGURATION CHECK
      // ==============================================

      if (
        !isShiprocketConfigured()
      ) {

        throw new ApiError(

          503,

          'Shiprocket is not configured. Please add Shiprocket credentials to .env.'

        );

      }


      // ==============================================
      // FIND ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      // ==============================================
      // ADMIN ONLY
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can create a Shiprocket shipment'

        );

      }


      // ==============================================
      // PREVENT DUPLICATE
      // ==============================================

      if (
        order.shipment
          ?.shiprocket
          ?.orderId
      ) {

        throw new ApiError(

          409,

          'Shiprocket order already created for this order'

        );

      }


      // ==============================================
      // CREATE SHIPROCKET ORDER
      // ==============================================

      const response =
        await createShiprocketOrder(
          order
        );


      // ==============================================
      // RESPONSE DATA
      // ==============================================

      const shiprocketOrderId =

        response?.order_id ||
        response?.orderId ||
        '';


      const shipmentId =

        response?.shipment_id ||
        response?.shipmentId ||
        '';


      // ==============================================
      // SAVE SHIPROCKET DATA
      // ==============================================

      order.shipment.shiprocket.orderId =
        String(
          shiprocketOrderId
        );


      order.shipment.shiprocket.shipmentId =
        String(
          shipmentId
        );


      order.shipment.shiprocket.status =
        'Created';


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      order.shipment.shiprocket.lastResponse =
        response;


      // ==============================================
      // SAVE
      // ==============================================

      await order.save();


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(201).json(

        new ApiResponse(

          201,

          {

            orderId:
              order._id,

            shiprocket:
              order.shipment.shiprocket,

            response,

          },

          'Shiprocket order created successfully'

        )

      );

    }
  );


// ======================================================
// ASSIGN AWB
// ======================================================

// @desc  Assign courier/AWB
// @route POST /api/shipments/:orderId/shiprocket/awb

const assignShiprocketAWB =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can assign AWB'

        );

      }


      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      // ==============================================
      // SHIPMENT ID
      // ==============================================

      const shipmentId =

        order.shipment
          ?.shiprocket
          ?.shipmentId;


      if (!shipmentId) {

        throw new ApiError(

          400,

          'Shiprocket shipment has not been created yet'

        );

      }


      // ==============================================
      // OPTIONAL COURIER ID
      // ==============================================

      const courierId =
        req.body?.courierId ||
        null;


      // ==============================================
      // ASSIGN AWB
      // ==============================================

      const response =
        await assignAWB({

          shipmentId,

          courierId,

        });


      // ==============================================
      // EXTRACT RESPONSE
      // ==============================================

      const awbCode =

        response?.response
          ?.data
          ?.awb_code ||

        response?.awb_code ||

        response?.response
          ?.awb_code ||

        '';


      const courierName =

        response?.response
          ?.data
          ?.courier_name ||

        response?.courier_name ||

        '';


      const assignedCourierId =

        response?.response
          ?.data
          ?.courier_company_id ||

        response?.courier_company_id ||

        courierId ||

        '';


      // ==============================================
      // SAVE SHIPROCKET
      // ==============================================

      order.shipment.shiprocket.awbCode =
        String(
          awbCode
        );


      order.shipment.shiprocket.courierId =
        String(
          assignedCourierId
        );


      order.shipment.shiprocket.courierName =
        courierName;


      order.shipment.shiprocket.status =
        awbCode
          ? 'AWB Assigned'
          : 'AWB Assignment Requested';


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      order.shipment.shiprocket.lastResponse =
        response;


      // ==============================================
      // MAIN SHIPMENT DATA
      // ==============================================

      if (courierName) {

        order.shipment.carrier =
          courierName;

      }


      if (awbCode) {

        order.shipment.trackingId =
          awbCode;

      }


      if (awbCode) {

        order.shipment.trackingUrl =

          `https://shiprocket.co/tracking/${encodeURIComponent(
            awbCode
          )}`;

      }


      // ==============================================
      // ORDER STATUS
      // ==============================================

      if (
        awbCode &&
        order.orderStatus !==
          'Cancelled'
      ) {

        order.orderStatus =
          'Shipped';

      }


      // ==============================================
      // STATUS HISTORY
      // ==============================================

      if (
        Array.isArray(
          order.shipment.statusHistory
        )
      ) {

        order.shipment.statusHistory.push({

          status:
            'Shipped',

          note:
            awbCode
              ? `AWB assigned: ${awbCode}`
              : 'Shiprocket AWB assignment requested',

          timestamp:
            new Date(),

        });

      }


      // ==============================================
      // SAVE
      // ==============================================

      await order.save();


      // ==============================================
      // NOTIFICATION
      // ==============================================

      try {

        await sendShipmentUpdate({

          userId:
            order.user._id ||
            order.user,

          orderId:
            order._id,

          status:
            'Shipped',

          trackingId:
            order.shipment.trackingId ||
            null,

        });

      } catch (error) {

        console.error(

          'AWB notification failed:',

          error.message

        );

      }


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            orderId:
              order._id,

            shiprocket:
              order.shipment.shiprocket,

            shipment:
              order.shipment,

            response,

          },

          'Shiprocket AWB assignment completed'

        )

      );

    }
  );


// ======================================================
// REQUEST PICKUP
// ======================================================

// @desc  Request Shiprocket pickup
// @route POST /api/shipments/:orderId/shiprocket/pickup

const pickupShiprocketShipment =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can schedule pickup'

        );

      }


      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      const shipmentId =

        order.shipment
          ?.shiprocket
          ?.shipmentId;


      if (!shipmentId) {

        throw new ApiError(

          400,

          'Shiprocket shipment has not been created yet'

        );

      }


      // ==============================================
      // PICKUP DATE
      // ==============================================

      const pickupDate =
        req.body?.pickupDate ||
        null;


      // ==============================================
      // REQUEST PICKUP
      // ==============================================

      const response =
        await requestPickup({

          shipmentId,

          pickupDate,

        });


      // ==============================================
      // SAVE
      // ==============================================

      order.shipment.shiprocket.pickupScheduled =
        true;


      order.shipment.shiprocket.pickupScheduledAt =
        pickupDate
          ? new Date(
              pickupDate
            )
          : new Date();


      order.shipment.shiprocket.status =
        'Pickup Requested';


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      order.shipment.shiprocket.lastResponse =
        response;


      // ==============================================
      // STATUS HISTORY
      // ==============================================

      if (
        Array.isArray(
          order.shipment.statusHistory
        )
      ) {

        order.shipment.statusHistory.push({

          status:
            'Shipped',

          note:
            'Shiprocket pickup requested',

          timestamp:
            new Date(),

        });

      }


      await order.save();


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            orderId:
              order._id,

            pickupScheduled:
              true,

            shiprocket:
              order.shipment.shiprocket,

            response,

          },

          'Shiprocket pickup requested successfully'

        )

      );

    }
  );


// ======================================================
// TRACK SHIPMENT THROUGH SHIPROCKET
// ======================================================

// @desc  Get live tracking from Shiprocket
// @route GET /api/shipments/:orderId/shiprocket/track

const trackShiprocketShipment =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      // ==============================================
      // AUTHORIZATION
      // ==============================================

      authorizeOrderAccess(

        order,

        req.user

      );


      // ==============================================
      // AWB
      // ==============================================

      const awbCode =

        order.shipment
          ?.shiprocket
          ?.awbCode ||

        order.shipment
          ?.trackingId;


      if (!awbCode) {

        throw new ApiError(

          400,

          'AWB/tracking number is not available for this shipment'

        );

      }


      // ==============================================
      // SHIPROCKET TRACKING
      // ==============================================

      const response =
        await trackByAWB(
          awbCode
        );


      // ==============================================
      // SAVE RAW RESPONSE
      // ==============================================

      order.shipment.shiprocket.lastResponse =
        response;


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      // ==============================================
      // EXTRACT TRACKING
      // ==============================================

      const trackingData =

        response?.tracking_data ||

        response?.response?.data ||

        response?.data ||

        {};


      const currentStatus =

        trackingData
          ?.shipment_status ||

        trackingData
          ?.track_status ||

        trackingData
          ?.status ||

        '';


      // ==============================================
      // SAVE SHIPROCKET STATUS
      // ==============================================

      if (currentStatus) {

        order.shipment.shiprocket.status =
          String(
            currentStatus
          );

      }


      // ==============================================
      // UPDATE ORDER STATUS
      // ==============================================

      const normalizedStatus =

        String(
          currentStatus
        )
          .toLowerCase();


      let newOrderStatus =
        null;


      if (
        normalizedStatus.includes(
          'delivered'
        )
      ) {

        newOrderStatus =
          'Delivered';

      } else if (

        normalizedStatus.includes(
          'out for delivery'
        )

      ) {

        newOrderStatus =
          'Out for Delivery';

      } else if (

        normalizedStatus.includes(
          'shipped'
        ) ||

        normalizedStatus.includes(
          'in transit'
        ) ||

        normalizedStatus.includes(
          'picked'
        )

      ) {

        newOrderStatus =
          'Shipped';

      }


      if (
        newOrderStatus &&
        order.orderStatus !==
          newOrderStatus
      ) {

        order.orderStatus =
          newOrderStatus;


        if (
          Array.isArray(
            order.shipment.statusHistory
          )
        ) {

          order.shipment.statusHistory.push({

            status:
              newOrderStatus,

            note:
              `Shiprocket tracking sync: ${currentStatus}`,

            timestamp:
              new Date(),

          });

        }

      }


      // ==============================================
      // SAVE
      // ==============================================

      await order.save();


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            orderId:
              order._id,

            orderStatus:
              order.orderStatus,

            shipment:
              order.shipment,

            tracking:
              response,

          },

          'Shiprocket tracking fetched successfully'

        )

      );

    }
  );


// ======================================================
// GENERATE SHIPPING LABEL
// ======================================================

// @desc  Generate Shiprocket shipping label
// @route POST /api/shipments/:orderId/shiprocket/label

const generateShiprocketLabel =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can generate shipping label'

        );

      }


      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      const shipmentId =

        order.shipment
          ?.shiprocket
          ?.shipmentId;


      if (!shipmentId) {

        throw new ApiError(

          400,

          'Shiprocket shipment ID is not available'

        );

      }


      // ==============================================
      // GENERATE LABEL
      // ==============================================

      const response =
        await generateLabel(
          shipmentId
        );


      // ==============================================
      // LABEL URL
      // ==============================================

      const labelUrl =

        response?.label_url ||

        response?.response
          ?.label_url ||

        response?.response
          ?.data
          ?.label_url ||

        '';


      if (labelUrl) {

        order.shipment.shiprocket.labelUrl =
          labelUrl;

      }


      order.shipment.shiprocket.lastResponse =
        response;


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      await order.save();


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            labelUrl,

            shiprocket:
              order.shipment.shiprocket,

            response,

          },

          'Shipping label generated successfully'

        )

      );

    }
  );


// ======================================================
// GENERATE SHIPROCKET INVOICE
// ======================================================

// @desc  Generate Shiprocket invoice
// @route POST /api/shipments/:orderId/shiprocket/invoice

const generateShiprocketInvoice =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can generate invoice'

        );

      }


      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      const shiprocketOrderId =

        order.shipment
          ?.shiprocket
          ?.orderId;


      if (!shiprocketOrderId) {

        throw new ApiError(

          400,

          'Shiprocket order ID is not available'

        );

      }


      // ==============================================
      // GENERATE INVOICE
      // ==============================================

      const response =
        await generateInvoice(
          shiprocketOrderId
        );


      // ==============================================
      // INVOICE URL
      // ==============================================

      const invoiceUrl =

        response?.invoice_url ||

        response?.response
          ?.invoice_url ||

        response?.response
          ?.data
          ?.invoice_url ||

        '';


      if (invoiceUrl) {

        order.shipment.shiprocket.invoiceUrl =
          invoiceUrl;

      }


      order.shipment.shiprocket.lastResponse =
        response;


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      await order.save();


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            invoiceUrl,

            shiprocket:
              order.shipment.shiprocket,

            response,

          },

          'Shiprocket invoice generated successfully'

        )

      );

    }
  );


// ======================================================
// CANCEL SHIPMENT
// ======================================================

// @desc  Cancel Shiprocket shipment
// @route DELETE /api/shipments/:orderId/shiprocket

const cancelShiprocketShipment =
  asyncHandler(
    async (req, res) => {

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        req.user.role !==
        'admin'
      ) {

        throw new ApiError(

          403,

          'Only admin can cancel shipment'

        );

      }


      // ==============================================
      // ORDER
      // ==============================================

      const order =
        await getOrder(
          req.params.orderId
        );


      const awbCode =

        order.shipment
          ?.shiprocket
          ?.awbCode;


      if (!awbCode) {

        throw new ApiError(

          400,

          'AWB is not available for this shipment'

        );

      }


      // ==============================================
      // CANCEL
      // ==============================================

      const response =
        await cancelShipment(
          awbCode
        );


      // ==============================================
      // UPDATE DATABASE
      // ==============================================

      order.shipment.shiprocket.status =
        'Cancelled';


      order.shipment.shiprocket.lastResponse =
        response;


      order.shipment.shiprocket.lastSyncedAt =
        new Date();


      if (
        order.orderStatus !==
        'Delivered'
      ) {

        order.orderStatus =
          'Cancelled';

      }


      // ==============================================
      // STATUS HISTORY
      // ==============================================

      if (
        Array.isArray(
          order.shipment.statusHistory
        )
      ) {

        order.shipment.statusHistory.push({

          status:
            'Cancelled',

          note:
            'Shiprocket shipment cancelled',

          timestamp:
            new Date(),

        });

      }


      await order.save();


      // ==============================================
      // NOTIFICATION
      // ==============================================

      try {

        await sendShipmentUpdate({

          userId:
            order.user._id ||
            order.user,

          orderId:
            order._id,

          status:
            'Cancelled',

          trackingId:
            order.shipment.trackingId ||
            null,

        });

      } catch (error) {

        console.error(

          'Shipment cancellation notification failed:',

          error.message

        );

      }


      // ==============================================
      // RESPONSE
      // ==============================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            orderId:
              order._id,

            status:
              'Cancelled',

            shiprocket:
              order.shipment.shiprocket,

            response,

          },

          'Shiprocket shipment cancelled successfully'

        )

      );

    }
  );


// ======================================================
// TRACK SHIPMENT - LOCAL DATABASE
// ======================================================

// @desc  Get tracking info for an order
// @route GET /api/shipments/:orderId/track

const trackShipment =
  asyncHandler(
    async (req, res) => {

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


      // ==============================================
      // OWNER / ADMIN AUTHORIZATION
      // ==============================================

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


      // ==============================================
      // RESPONSE
      // ==============================================

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

    }
  );


// ======================================================
// EXPORT
// ======================================================

module.exports = {

  // ==============================================
  // EXISTING
  // ==============================================

  updateShipment,

  updateShipmentStatus,

  trackShipment,


  // ==============================================
  // SHIPROCKET
  // ==============================================

  createShiprocketShipment,

  assignShiprocketAWB,

  pickupShiprocketShipment,

  trackShiprocketShipment,

  generateShiprocketLabel,

  generateShiprocketInvoice,

  cancelShiprocketShipment,

};