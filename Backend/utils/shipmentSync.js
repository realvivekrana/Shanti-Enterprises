// ============================================================
// SHANTI ENTERPRISES
// Shipment <-> Order status sync
// Admin order status badalte hi shipment record khud ban/update hota hai
// ============================================================

const Shipment = require("../models/Shipment");

const generateShipmentNumber = () =>
  `SHP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

// Order status -> Shipment status
const ORDER_TO_SHIPMENT = {
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

const EVENT_MESSAGES = {
  pending: "Shipment created",
  processing: "Shipment is being processed",
  packed: "Order has been packed",
  shipped: "Shipment has been dispatched",
  in_transit: "Shipment is in transit",
  out_for_delivery: "Shipment is out for delivery",
  delivered: "Shipment delivered successfully",
  failed: "Delivery attempt failed",
  cancelled: "Shipment cancelled",
  returned: "Shipment returned to sender",
};

// Forward-only progress (cancelled/failed/returned alag handle hote hain)
const RANK = {
  pending: 0,
  processing: 1,
  packed: 2,
  shipped: 3,
  in_transit: 4,
  out_for_delivery: 5,
  delivered: 6,
};

// shipment.status + timestamps + tracking event ek jagah se set karo
const applyShipmentStatus = (shipment, status) => {
  shipment.status = status;

  if (status === "shipped") {
    shipment.shippedAt = shipment.shippedAt || new Date();
  }
  if (status === "delivered") {
    shipment.deliveredAt = shipment.deliveredAt || new Date();
  }
  if (status === "cancelled") {
    shipment.cancelledAt = shipment.cancelledAt || new Date();
  }

  shipment.trackingEvents.push({
    status,
    location: "",
    message: EVENT_MESSAGES[status] || `Status updated to ${status}`,
    timestamp: new Date(),
  });
};

// Order ke status ke hisaab se shipment create/update karo
const syncShipmentWithOrder = async (order) => {
  const target = ORDER_TO_SHIPMENT[order.orderStatus];

  if (!target) {
    return null;
  }

  let shipment = await Shipment.findOne({ order: order._id });

  if (!shipment) {
    if (target === "cancelled") {
      return null;
    }

    const a = order.shippingAddress || {};

    shipment = new Shipment({
      shipmentNumber: generateShipmentNumber(),
      order: order._id,
      user: order.user,
      status: "processing",
      trackingEvents: [],
      shippingAddress: {
        name: a.name || "",
        phone: a.phone || "",
        address: [a.addressLine1, a.addressLine2]
          .filter(Boolean)
          .join(", "),
        city: a.city || "",
        state: a.state || "",
        postalCode: a.postalCode || "",
        country: a.country || "India",
      },
    });

    applyShipmentStatus(shipment, "processing");
  }

  if (shipment.status === target) {
    // naya shipment ho to save karna zaroori hai
    if (shipment.isNew) {
      await shipment.save();
    }

    return shipment;
  }

  if (target === "cancelled") {
    if (shipment.status !== "delivered") {
      applyShipmentStatus(shipment, "cancelled");
    }
  } else if (
    (RANK[target] ?? -1) > (RANK[shipment.status] ?? -1)
  ) {
    applyShipmentStatus(shipment, target);
  }

  await shipment.save();

  return shipment;
};

module.exports = {
  syncShipmentWithOrder,
  applyShipmentStatus,
};