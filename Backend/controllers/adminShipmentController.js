// ============================================================
// SHANTI ENTERPRISES
// Admin Shipment Controller
// Phase 6 - Admin
// ============================================================

const Shipment = require("../models/Shipment");

// ============================================================
// GET ALL SHIPMENTS
// ============================================================

const getAdminShipments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {};

    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (status.trim()) {
      filter.status = status.trim();
    }

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.$or = [
        {
          trackingNumber: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          shipmentNumber: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const skip = (currentPage - 1) * perPage;

    const [shipments, totalShipments] =
      await Promise.all([
        Shipment.find(filter)
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "order",
            "orderNumber totalAmount status"
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
// GET SINGLE SHIPMENT
// ============================================================

const getAdminShipmentById = async (
  req,
  res,
  next
) => {
  try {
    const shipment =
      await Shipment.findById(req.params.id)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "order",
          "orderNumber items totalAmount status paymentStatus"
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
// UPDATE SHIPMENT STATUS
// ============================================================

const updateAdminShipmentStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "packed",
      "shipped",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed",
      "cancelled",
      "returned",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      const error = new Error(
        `Invalid shipment status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`
      );

      error.statusCode = 400;

      return next(error);
    }

    const shipment =
      await Shipment.findById(
        req.params.id
      );

    if (!shipment) {
      const error = new Error(
        "Shipment not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    shipment.status = status;

    // --------------------------------------------------------
    // STATUS TIMESTAMPS
    // --------------------------------------------------------

    if (status === "shipped") {
      shipment.shippedAt =
        shipment.shippedAt ||
        new Date();
    }

    if (status === "delivered") {
      shipment.deliveredAt =
        shipment.deliveredAt ||
        new Date();
    }

    if (status === "cancelled") {
      shipment.cancelledAt =
        shipment.cancelledAt ||
        new Date();
    }

    await shipment.save();

    res.status(200).json({
      success: true,

      message:
        "Shipment status updated successfully",

      shipment: {
        id: shipment._id,

        shipmentNumber:
          shipment.shipmentNumber,

        trackingNumber:
          shipment.trackingNumber,

        status: shipment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE TRACKING INFORMATION
// ============================================================

const updateAdminTracking = async (
  req,
  res,
  next
) => {
  try {
    const {
      trackingNumber,
      carrier,
      trackingUrl,
    } = req.body;

    const shipment =
      await Shipment.findById(
        req.params.id
      );

    if (!shipment) {
      const error = new Error(
        "Shipment not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (trackingNumber !== undefined) {
      shipment.trackingNumber =
        String(
          trackingNumber
        ).trim();
    }

    if (carrier !== undefined) {
      shipment.carrier =
        String(carrier).trim();
    }

    if (trackingUrl !== undefined) {
      shipment.trackingUrl =
        String(trackingUrl).trim();
    }

    await shipment.save();

    res.status(200).json({
      success: true,

      message:
        "Tracking information updated successfully",

      shipment: {
        id: shipment._id,

        shipmentNumber:
          shipment.shipmentNumber,

        trackingNumber:
          shipment.trackingNumber,

        carrier: shipment.carrier,

        trackingUrl:
          shipment.trackingUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getAdminShipments,
  getAdminShipmentById,
  updateAdminShipmentStatus,
  updateAdminTracking,
};