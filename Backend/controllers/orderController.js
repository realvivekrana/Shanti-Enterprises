// ============================================================
// SHANTI ENTERPRISES
// Order Controller
// Phase 3 - Customer Portal
// ============================================================

const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ============================================================
// GENERATE ORDER NUMBER
// ============================================================

const generateOrderNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `SE-${timestamp}-${random}`;
};

// ============================================================
// CREATE ORDER FROM CART
// POST /api/orders
// ============================================================

const createOrder = async (req, res, next) => {
  try {
    console.log("");
    console.log("================================================");
    console.log("              CREATE ORDER");
    console.log("================================================");

    // --------------------------------------------------------
    // SHIPPING ADDRESS
    // --------------------------------------------------------

    const {
      name,
      phone,
      addressLine1,
      addressLine2 = "",
      city,
      state,
      postalCode,
      country = "India",
    } = req.body;

    // --------------------------------------------------------
    // VALIDATE SHIPPING ADDRESS
    // --------------------------------------------------------

    if (
      !name ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      const error = new Error(
        "Complete shipping address is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // AUTH CHECK
    // --------------------------------------------------------

    if (!req.user || !req.user.id) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;

      return next(error);
    }

    const userId = req.user.id;

    console.log("User ID:", userId);

    // --------------------------------------------------------
    // FIND CART
    // --------------------------------------------------------

    const cart = await Cart.findOne({
      user: userId,
    });

    // --------------------------------------------------------
    // CART NOT FOUND
    // --------------------------------------------------------

    if (!cart) {
      const error = new Error(
        "Cart not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // DEBUG CART
    // --------------------------------------------------------

    console.log(
      "Cart ID:",
      cart._id.toString()
    );

    console.log(
      "Cart Items Count:",
      Array.isArray(cart.items)
        ? cart.items.length
        : 0
    );

    // --------------------------------------------------------
    // CART EMPTY
    // --------------------------------------------------------

    if (
      !Array.isArray(cart.items) ||
      cart.items.length === 0
    ) {
      const error = new Error(
        "Your cart is empty"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // EXTRACT PRODUCT IDS
    //
    // Supports:
    //
    // cartItem.product = ObjectId
    //
    // cartItem.product = populated product object
    //
    // cartItem.productId = ObjectId
    //
    // --------------------------------------------------------

    const productIds = [];

    for (const cartItem of cart.items) {
      let productId = null;

      if (cartItem.product) {
        if (
          typeof cartItem.product === "object" &&
          cartItem.product._id
        ) {
          productId = cartItem.product._id;
        } else {
          productId = cartItem.product;
        }
      }

      if (!productId && cartItem.productId) {
        productId = cartItem.productId;
      }

      if (
        productId &&
        mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        productIds.push(
          productId.toString()
        );
      }
    }

    // --------------------------------------------------------
    // DEBUG PRODUCT IDS
    // --------------------------------------------------------

    console.log(
      "Product IDs:",
      productIds
    );

    // --------------------------------------------------------
    // NO VALID PRODUCTS
    // --------------------------------------------------------

    if (productIds.length === 0) {
      const error = new Error(
        "No valid products found in cart"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // FETCH PRODUCTS
    // --------------------------------------------------------

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
      isActive: true,
    });

    // --------------------------------------------------------
    // DEBUG PRODUCTS
    // --------------------------------------------------------

    console.log(
      "Products Found:",
      products.length
    );

    // --------------------------------------------------------
    // PRODUCT AVAILABILITY
    // --------------------------------------------------------

    if (products.length !== productIds.length) {
      console.log(
        "Cart Product IDs:",
        productIds
      );

      console.log(
        "Database Products:",
        products.map((product) =>
          product._id.toString()
        )
      );

      const error = new Error(
        "One or more products in your cart are no longer available"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // BUILD ORDER ITEMS
    // --------------------------------------------------------

    const orderItems = [];

    let subtotal = 0;

    for (const cartItem of cart.items) {
      // ------------------------------------------------------
      // GET PRODUCT ID
      // ------------------------------------------------------

      let productId = null;

      if (cartItem.product) {
        if (
          typeof cartItem.product === "object" &&
          cartItem.product._id
        ) {
          productId = cartItem.product._id;
        } else {
          productId = cartItem.product;
        }
      }

      if (!productId && cartItem.productId) {
        productId = cartItem.productId;
      }

      // ------------------------------------------------------
      // SKIP INVALID PRODUCT
      // ------------------------------------------------------

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        console.log(
          "Invalid cart item:",
          cartItem
        );

        continue;
      }

      const productIdString =
        productId.toString();

      // ------------------------------------------------------
      // FIND PRODUCT
      // ------------------------------------------------------

      const product = products.find(
        (item) =>
          item._id.toString() ===
          productIdString
      );

      if (!product) {
        const error = new Error(
          "Product not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      // ------------------------------------------------------
      // QUANTITY
      // ------------------------------------------------------

      const quantity = Number(
        cartItem.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        const error = new Error(
          `Invalid quantity for ${product.name}`
        );

        error.statusCode = 400;

        return next(error);
      }

      // ------------------------------------------------------
      // STOCK CHECK
      // ------------------------------------------------------

      if (
        quantity >
        Number(product.stock)
      ) {
        const error = new Error(
          `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
        );

        error.statusCode = 400;

        return next(error);
      }

      // ------------------------------------------------------
      // ITEM SUBTOTAL
      // ------------------------------------------------------

      const itemSubtotal =
        Number(product.price) *
        quantity;

      subtotal += itemSubtotal;

      // ------------------------------------------------------
      // PUSH ORDER ITEM
      // ------------------------------------------------------

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity,
        price: product.price,
        unit: product.unit,
      });
    }

    // --------------------------------------------------------
    // FINAL ORDER ITEMS CHECK
    // --------------------------------------------------------

    console.log(
      "Order Items Count:",
      orderItems.length
    );

    console.log(
      "Subtotal:",
      subtotal
    );

    if (orderItems.length === 0) {
      const error = new Error(
        "No order items"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // AMOUNT CHECK
    // --------------------------------------------------------

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      const error = new Error(
        "Invalid order amount"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------------

    const order = await Order.create({
      orderNumber:
        generateOrderNumber(),

      user: userId,

      items: orderItems,

      shippingAddress: {
        name: name.trim(),
        phone: phone.trim(),
        addressLine1:
          addressLine1.trim(),
        addressLine2:
          addressLine2
            ? addressLine2.trim()
            : "",
        city: city.trim(),
        state: state.trim(),
        postalCode:
          postalCode.trim(),
        country:
          country.trim(),
      },

      subtotal,

      totalAmount: subtotal,

      paymentStatus: "pending",

      orderStatus: "pending",
    });

    // --------------------------------------------------------
    // REDUCE STOCK
    // --------------------------------------------------------

    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(
        orderItem.product,
        {
          $inc: {
            stock: -orderItem.quantity,
          },
        }
      );
    }

    // --------------------------------------------------------
    // CLEAR CART
    // --------------------------------------------------------

    cart.items = [];

    await cart.save();

    // --------------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------------

    console.log(
      "Order Created:",
      order._id.toString()
    );

    console.log(
      "Order Number:",
      order.orderNumber
    );

    console.log(
      "================================================"
    );

    return res.status(201).json({
      success: true,

      message:
        "Order created successfully",

      order: {
        id: order._id,

        orderNumber:
          order.orderNumber,

        subtotal:
          order.subtotal,

        totalAmount:
          order.totalAmount,

        paymentStatus:
          order.paymentStatus,

        orderStatus:
          order.orderStatus,

        shippingAddress:
          order.shippingAddress,

        items:
          order.items,

        createdAt:
          order.createdAt,
      },
    });
  } catch (error) {
    console.error("");
    console.error(
      "================================================"
    );
    console.error(
      "          CREATE ORDER ERROR"
    );
    console.error(
      "================================================"
    );
    console.error(error);
    console.error(
      "================================================"
    );

    next(error);
  }
};

// ============================================================
// GET CUSTOMER ORDERS
// GET /api/orders
// ============================================================

const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    // --------------------------------------------------------
    // AUTH CHECK
    // --------------------------------------------------------

    if (!req.user || !req.user.id) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;

      return next(error);
    }

    // --------------------------------------------------------
    // QUERY
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // FILTER
    // --------------------------------------------------------

    const filter = {
      user: req.user.id,
    };

    if (
      typeof status === "string" &&
      status.trim()
    ) {
      filter.orderStatus =
        status.trim();
    }

    // --------------------------------------------------------
    // PAGINATION
    // --------------------------------------------------------

    const skip =
      (currentPage - 1) *
      perPage;

    // --------------------------------------------------------
    // GET ORDERS
    // --------------------------------------------------------

    const [
      orders,
      totalOrders,
    ] = await Promise.all([
      Order.find(filter)
        .select(
          "orderNumber items subtotal totalAmount paymentStatus orderStatus shippingAddress createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Order.countDocuments(filter),
    ]);

    // --------------------------------------------------------
    // TOTAL PAGES
    // --------------------------------------------------------

    const totalPages =
      totalOrders === 0
        ? 0
        : Math.ceil(
            totalOrders / perPage
          );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,

      count: orders.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalOrders,
        totalPages,
      },

      orders,
    });
  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    next(error);
  }
};

// ============================================================
// GET ORDER DETAILS
// GET /api/orders/:id
// ============================================================

const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    // --------------------------------------------------------
    // AUTH CHECK
    // --------------------------------------------------------

    if (!req.user || !req.user.id) {
      const error = new Error(
        "Authentication required"
      );

      error.statusCode = 401;

      return next(error);
    }

    // --------------------------------------------------------
    // VALIDATE ORDER ID
    // --------------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      const error = new Error(
        "Invalid order ID"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------------

    const order =
      await Order.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate(
        "items.product",
        "name slug image price unit"
      );

    // --------------------------------------------------------
    // ORDER NOT FOUND
    // --------------------------------------------------------

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "GET ORDER DETAILS ERROR:",
      error
    );

    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};