// ============================================================
// SHANTI ENTERPRISES
// Order Controller
// Phase 3 - Customer Portal
// Updated - Wholesale Quotation Order Support
// ============================================================

const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Quotation = require("../models/Quotation");

// ============================================================
// HELPERS
// ============================================================

const generateOrderNumber = () => {
  const timestamp =
    Date.now().toString();

  const random =
    Math.floor(
      1000 + Math.random() * 9000
    );

  return `SE-${timestamp}-${random}`;
};

// ============================================================
// CREATE NORMAL ORDER
// ============================================================

const createOrder = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ========================================================
    // REQUEST DATA
    // ========================================================

    const {
      items,
      shippingAddress,
      paymentMethod = "razorpay",
    } = req.body;

    // ========================================================
    // VALIDATE PAYMENT METHOD
    // ========================================================

    const normalizedPaymentMethod =
      String(
        paymentMethod ||
          "razorpay"
      )
        .trim()
        .toLowerCase();

    if (
      ![
        "razorpay",
        "cod",
      ].includes(
        normalizedPaymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method.",
      });
    }

    // ========================================================
    // VALIDATE ITEMS
    // ========================================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order must contain at least one item.",
      });
    }

    // ========================================================
    // VALIDATE SHIPPING ADDRESS
    // ========================================================

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required.",
      });
    }

    // ========================================================
    // PREPARE ORDER ITEMS
    // ========================================================

    const orderItems = [];

    let calculatedSubtotal = 0;

    // ========================================================
    // PROCESS EACH ITEM
    // ========================================================

    for (
      const item of items
    ) {
      const productId =
        item.product ||
        item.productId;

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID.",
        });
      }

      const quantity =
        Number(
          item.quantity
        );

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product quantity.",
        });
      }

      // ------------------------------------------------------
      // FIND PRODUCT
      // ------------------------------------------------------

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "One or more products were not found.",
        });
      }

      // ------------------------------------------------------
      // MINIMUM ORDER QUANTITY CHECK
      // ------------------------------------------------------

      const minimumOrderQuantity =
        Math.max(
          1,
          Number(
            product.moq ??
              product.minimumOrderQuantity ??
              product.minOrderQuantity ??
              1
          ) || 1
        );

      if (
        quantity <
        minimumOrderQuantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} has a minimum order quantity of ${minimumOrderQuantity}.`,
        });
      }

      // ------------------------------------------------------
      // STOCK CHECK
      // ------------------------------------------------------

      const availableStock =
        Number(
          product.stock ??
            product.inventory ??
            product.quantity ??
            0
        );

      if (
        availableStock <
        quantity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} does not have enough stock.`,
        });
      }

      // ------------------------------------------------------
      // PRICE FROM DATABASE
      // ------------------------------------------------------

      const price =
        Number(
          product.price ??
            product.sellingPrice ??
            product.salePrice ??
            0
        );

      if (
        !Number.isFinite(
          price
        ) ||
        price < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid price for ${product.name}.`,
        });
      }

      const itemTotal =
        price * quantity;

      calculatedSubtotal +=
        itemTotal;

      orderItems.push({
        product:
          product._id,

        name:
          product.name ||
          "Product",

        image:
          product.images?.[0] ||
          product.image ||
          "",

        quantity,

        price,

        unit:
          product.unit ||
          "piece",
      });
    }

    // ========================================================
    // TOTAL
    // ========================================================

    const totalAmount =
      calculatedSubtotal;

    // ========================================================
    // COD ORDER STATUS
    // ========================================================

    const orderStatus =
      normalizedPaymentMethod ===
      "cod"
        ? "confirmed"
        : "pending";

    // ========================================================
    // CREATE ORDER
    // ========================================================

    const order =
      await Order.create({
        orderNumber:
          generateOrderNumber(),

        user: userId,

        items:
          orderItems,

        shippingAddress: {
          name:
            shippingAddress.name.trim(),

          phone:
            shippingAddress.phone.trim(),

          addressLine1:
            shippingAddress.addressLine1.trim(),

          addressLine2:
            shippingAddress.addressLine2 ||
            "",

          city:
            shippingAddress.city.trim(),

          state:
            shippingAddress.state.trim(),

          postalCode:
            shippingAddress.postalCode.trim(),

          country:
            shippingAddress.country ||
            "India",
        },

        subtotal:
          calculatedSubtotal,

        totalAmount,

        paymentMethod:
          normalizedPaymentMethod,

        paymentStatus:
          "pending",

        orderStatus,
      });

    // ========================================================
    // REDUCE STOCK
    // ========================================================

    for (
      const item of orderItems
    ) {
      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        continue;
      }

      const currentStock =
        Number(
          product.stock ??
            product.inventory ??
            product.quantity ??
            0
        );

      const newStock =
        Math.max(
          0,
          currentStock -
            item.quantity
        );

      if (
        product.stock !==
        undefined
      ) {
        product.stock =
          newStock;
      } else if (
        product.inventory !==
        undefined
      ) {
        product.inventory =
          newStock;
      } else {
        product.quantity =
          newStock;
      }

      await product.save();
    }

    // ========================================================
    // CLEAR USER CART
    // ========================================================

    try {
      await Cart.findOneAndUpdate(
        {
          user: userId,
        },
        {
          $set: {
            items: [],
          },
        }
      );
    } catch (cartError) {
      console.error(
        "Cart clear error:",
        cartError
      );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json({
      success: true,

      message:
        normalizedPaymentMethod ===
        "cod"
          ? "COD order placed successfully."
          : "Order created successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create order.",
    });
  }
};

// ============================================================
// CREATE ORDER FROM ACCEPTED QUOTATION
// ============================================================

const createOrderFromQuotation =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      // ======================================================
      // REQUEST DATA
      // ======================================================

      const {
        quotationId,
        shippingAddress,
        paymentMethod = "razorpay",
      } = req.body;

      // ======================================================
      // VALIDATE QUOTATION ID
      // ======================================================

      if (
        !quotationId ||
        !mongoose.Types.ObjectId.isValid(
          quotationId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid quotation ID is required.",
        });
      }

      // ======================================================
      // VALIDATE PAYMENT METHOD
      // ======================================================

      const normalizedPaymentMethod =
        String(
          paymentMethod ||
            "razorpay"
        )
          .trim()
          .toLowerCase();

      if (
        ![
          "razorpay",
          "cod",
        ].includes(
          normalizedPaymentMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment method.",
        });
      }

      // ======================================================
      // VALIDATE SHIPPING ADDRESS
      // ======================================================

      if (
        !shippingAddress ||
        !shippingAddress.name ||
        !shippingAddress.phone ||
        !shippingAddress.addressLine1 ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.postalCode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Complete shipping address is required.",
        });
      }

      // ======================================================
      // FIND ACCEPTED QUOTATION
      // ======================================================

      const quotation =
        await Quotation.findOne({
          _id: quotationId,
          user: userId,
        }).populate(
          "items.product"
        );

      if (!quotation) {
        return res.status(404).json({
          success: false,
          message:
            "Quotation not found.",
        });
      }

      // ======================================================
      // ONLY ACCEPTED QUOTATIONS
      // ======================================================

      if (
        quotation.status !==
        "accepted"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only accepted quotations can be converted into orders.",
        });
      }

      // ======================================================
      // CHECK QUOTATION EXPIRY
      // ======================================================

      if (
        quotation.validUntil &&
        new Date() >
          quotation.validUntil
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This quotation has expired.",
        });
      }

      // ======================================================
      // CHECK EXISTING ORDER
      // ======================================================

      const existingOrder =
        await Order.findOne({
          quotation:
            quotation._id,
          user: userId,
        });

      if (existingOrder) {
        return res.status(409).json({
          success: false,
          message:
            "An order has already been created from this quotation.",
          order:
            existingOrder,
        });
      }

      // ======================================================
      // VALIDATE QUOTATION ITEMS
      // ======================================================

      if (
        !Array.isArray(
          quotation.items
        ) ||
        quotation.items.length ===
          0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quotation does not contain any items.",
        });
      }

      // ======================================================
      // PREPARE WHOLESALE ORDER ITEMS
      // ======================================================

      const orderItems = [];

      let calculatedSubtotal =
        0;

      // ======================================================
      // PROCESS QUOTATION ITEMS
      // ======================================================

      for (
        const quotationItem of
          quotation.items
      ) {
        const product =
          quotationItem.product;

        if (!product) {
          return res.status(404).json({
            success: false,
            message:
              `Product for ${quotationItem.productName} was not found.`,
          });
        }

        // ----------------------------------------------------
        // MINIMUM ORDER QUANTITY CHECK
        // ----------------------------------------------------

        const minimumOrderQuantity =
          Math.max(
            1,
            Number(
              product.moq ??
                product.minimumOrderQuantity ??
                product.minOrderQuantity ??
                1
            ) || 1
          );

        const quantity =
          Number(
            quotationItem.quantity
          );

        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {
          return res.status(400).json({
            success: false,
            message:
              `Invalid quantity for ${quotationItem.productName}.`,
          });
        }

        if (
          quantity <
          minimumOrderQuantity
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name} has a minimum order quantity of ${minimumOrderQuantity}.`,
          });
        }

        // ----------------------------------------------------
        // STOCK CHECK
        // ----------------------------------------------------

        const availableStock =
          Number(
            product.stock ??
              product.inventory ??
              product.quantity ??
              0
          );

        if (
          availableStock <
          quantity
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${product.name} does not have enough stock.`,
          });
        }

        // ----------------------------------------------------
        // IMPORTANT:
        // USE QUOTATION PRICE
        // NOT NORMAL PRODUCT PRICE
        // ----------------------------------------------------

        const unitPrice =
          Number(
            quotationItem.unitPrice
          );

        if (
          !Number.isFinite(
            unitPrice
          ) ||
          unitPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              `Invalid quotation price for ${quotationItem.productName}.`,
          });
        }

        const itemTotal =
          unitPrice *
          quantity;

        calculatedSubtotal +=
          itemTotal;

        orderItems.push({
          product:
            product._id,

          name:
            quotationItem.productName ||
            product.name ||
            "Product",

          image:
            product.images?.[0] ||
            product.image ||
            "",

          quantity,

          // --------------------------------------------------
          // AGREED WHOLESALE PRICE
          // --------------------------------------------------

          price:
            unitPrice,

          unit:
            quotationItem.unit ||
            product.unit ||
            "piece",
        });
      }

      // ======================================================
      // CALCULATE TOTAL
      // ======================================================

      const totalAmount =
        calculatedSubtotal;

      // ======================================================
      // VERIFY QUOTATION TOTAL
      // ======================================================

      if (
        Number(
          quotation.totalAmount
        ) !==
        totalAmount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quotation total does not match its item prices.",
        });
      }

      // ======================================================
      // ORDER STATUS
      // ======================================================

      const orderStatus =
        normalizedPaymentMethod ===
        "cod"
          ? "confirmed"
          : "pending";

      // ======================================================
      // CREATE WHOLESALE ORDER
      // ======================================================

      const order =
        await Order.create({
          orderNumber:
            generateOrderNumber(),

          user: userId,

          // --------------------------------------------------
          // WHOLESALE REFERENCES
          // --------------------------------------------------

          quotation:
            quotation._id,

          rfq:
            quotation.rfq,

          items:
            orderItems,

          shippingAddress: {
            name:
              shippingAddress.name.trim(),

            phone:
              shippingAddress.phone.trim(),

            addressLine1:
              shippingAddress.addressLine1.trim(),

            addressLine2:
              shippingAddress.addressLine2 ||
              "",

            city:
              shippingAddress.city.trim(),

            state:
              shippingAddress.state.trim(),

            postalCode:
              shippingAddress.postalCode.trim(),

            country:
              shippingAddress.country ||
              "India",
          },

          subtotal:
            calculatedSubtotal,

          totalAmount,

          paymentMethod:
            normalizedPaymentMethod,

          paymentStatus:
            "pending",

          orderStatus,
        });

      // ======================================================
      // REDUCE STOCK
      // ======================================================

      for (
        const item of orderItems
      ) {
        const product =
          await Product.findById(
            item.product
          );

        if (!product) {
          continue;
        }

        const currentStock =
          Number(
            product.stock ??
              product.inventory ??
              product.quantity ??
              0
          );

        const newStock =
          Math.max(
            0,
            currentStock -
              item.quantity
          );

        if (
          product.stock !==
          undefined
        ) {
          product.stock =
            newStock;
        } else if (
          product.inventory !==
          undefined
        ) {
          product.inventory =
            newStock;
        } else {
          product.quantity =
            newStock;
        }

        await product.save();
      }

      // ======================================================
      // CLEAR CART
      // ======================================================

      try {
        await Cart.findOneAndUpdate(
          {
            user: userId,
          },
          {
            $set: {
              items: [],
            },
          }
        );
      } catch (cartError) {
        console.error(
          "Cart clear error:",
          cartError
        );
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(201).json({
        success: true,

        message:
          normalizedPaymentMethod ===
          "cod"
            ? "Wholesale COD order placed successfully."
            : "Wholesale order created successfully.",

        order,
      });
    } catch (error) {
      console.error(
        "Create order from quotation error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create order from quotation.",
      });
    }
  };

// ============================================================
// GET MY ORDERS
// ============================================================

const getMyOrders = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const orders =
      await Order.find({
        user: userId,
      })
        .populate(
          "quotation",
          "quotationNumber status totalAmount"
        )
        .populate(
          "rfq",
          "rfqNumber status"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load orders.",
    });
  }
};

// ============================================================
// GET ORDER BY ID
// ============================================================

const getOrderById = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id;

    const {
      id,
    } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID.",
      });
    }

    const order =
      await Order.findOne({
        _id: id,
        user: userId,
      })
        .populate(
          "quotation",
          "quotationNumber status totalAmount validUntil"
        )
        .populate(
          "rfq",
          "rfqNumber status"
        )
        .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load order.",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createOrder,
  createOrderFromQuotation,
  getMyOrders,
  getOrderById,
};
