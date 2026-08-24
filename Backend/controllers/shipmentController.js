// ============================================================
// SHANTI ENTERPRISES
// Shipment Controller
// Phase 5 - Operations
// ============================================================

const Shipment = require("../models/Shipment");
const Order = require("../models/Order");

// ============================================================
// GENERATE SHIPMENT NUMBER
// ============================================================

const generateShipmentNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `SHP-${timestamp}-${random}`;
};

// ============================================================
// GET MY SHIPMENTS
// ============================================================

const getMyShipments = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

    const filter = {
      user: req.user.id,
    };

    if (status.trim()) {
      filter.status = status.trim();
    }

    const skip =
      (currentPage - 1) *
      perPage;

    const [
      shipments,
      totalShipments,
    ] = await Promise.all([
      Shipment.find(filter)
        .populate(
          "order",
          "orderNumber status totalAmount"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Shipment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalShipments / perPage
    );

    res.status(200).json({
      success: true,

      count: shipments.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalShipments,
        totalPages,
      },

      shipments,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SHIPMENT BY ID
// ============================================================

const getShipmentById = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await Shipment.findOne({
        _id: req.params.id,
        user: req.user.id,
      })
        .populate(
          "order",
          "orderNumber status paymentStatus totalAmount createdAt"
        );

    if (!shipment) {
      const error = new Error(
        "Shipment not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// TRACK SHIPMENT
// ============================================================

const trackShipment = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await Shipment.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).select(
        "shipmentNumber carrier trackingNumber status estimatedDeliveryDate shippedAt deliveredAt trackingEvents"
      );

    if (!shipment) {
      const error = new Error(
        "Shipment not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      tracking: {
        shipmentNumber:
          shipment.shipmentNumber,

        carrier:
          shipment.carrier,

        trackingNumber:
          shipment.trackingNumber,

        status:
          shipment.status,

        estimatedDeliveryDate:
          shipment.estimatedDeliveryDate,

        shippedAt:
          shipment.shippedAt,

        deliveredAt:
          shipment.deliveredAt,

        trackingEvents:
          shipment.trackingEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE SHIPMENT
// ============================================================

const createShipment = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
      carrier = "",
      trackingNumber = "",
      estimatedDeliveryDate = null,
    } = req.body;

    if (!orderId) {
      const error = new Error(
        "Order ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const order =
      await Order.findOne({
        _id: orderId,
        user: req.user.id,
      });

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const existingShipment =
      await Shipment.findOne({
        order: order._id,
      });

    if (existingShipment) {
      return res.status(200).json({
        success: true,

        message:
          "Shipment already exists",

        shipment:
          existingShipment,
      });
    }

    const shippingAddress =
      order.shippingAddress || {};

    const shipment =
      await Shipment.create({
        shipmentNumber:
          generateShipmentNumber(),

        order: order._id,

        user: req.user.id,

        carrier:
          String(carrier).trim(),

        trackingNumber:
          String(trackingNumber).trim(),

        estimatedDeliveryDate,

        status: "processing",

        trackingEvents: [
          {
            status: "processing",

            location: "",

            message:
              "Shipment is being processed",

            timestamp: new Date(),
          },
        ],

        shippingAddress: {
          name:
            shippingAddress.name ||
            req.user.name ||
            "",

          phone:
            shippingAddress.phone ||
            req.user.phone ||
            "",

          address:
            shippingAddress.address ||
            shippingAddress.street ||
            "",

          city:
            shippingAddress.city ||
            "",

          state:
            shippingAddress.state ||
            "",

          postalCode:
            shippingAddress.postalCode ||
            shippingAddress.zipCode ||
            "",

          country:
            shippingAddress.country ||
            "India",
        },
      });

    res.status(201).json({
      success: true,

      message:
        "Shipment created successfully",

      shipment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyShipments,
  getShipmentById,
  trackShipment,
  createShipment,
};