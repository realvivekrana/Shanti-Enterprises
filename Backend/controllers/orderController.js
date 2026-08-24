// ============================================================
// SHANTI ENTERPRISES
// Order Controller
// Phase 3 - Customer Portal
// ============================================================

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
// ============================================================

const createOrder = async (req, res, next) => {
  try {
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

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error(
        "Your cart is empty"
      );

      error.statusCode = 400;

      return next(error);
    }

    const productIds = cart.items.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
      isActive: true,
    });

    if (
      products.length !== cart.items.length
    ) {
      const error = new Error(
        "One or more products in your cart are no longer available"
      );

      error.statusCode = 400;

      return next(error);
    }

    const orderItems = [];

    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = products.find(
        (item) =>
          item._id.toString() ===
          cartItem.product.toString()
      );

      if (!product) {
        const error = new Error(
          "Product not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      if (
        cartItem.quantity >
        product.stock
      ) {
        const error = new Error(
          `Insufficient stock for ${product.name}`
        );

        error.statusCode = 400;

        return next(error);
      }

      const itemSubtotal =
        product.price *
        cartItem.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: cartItem.quantity,
        price: product.price,
        unit: product.unit,
      });
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),

      user: req.user.id,

      items: orderItems,

      shippingAddress: {
        name: name.trim(),
        phone: phone.trim(),
        addressLine1:
          addressLine1.trim(),
        addressLine2:
          addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode:
          postalCode.trim(),
        country: country.trim(),
      },

      subtotal,

      totalAmount: subtotal,

      paymentStatus: "pending",

      orderStatus: "pending",
    });

    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.product,
        {
          $inc: {
            stock: -cartItem.quantity,
          },
        }
      );
    }

    cart.items = [];

    await cart.save();

    res.status(201).json({
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
        items: order.items,
        createdAt:
          order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET CUSTOMER ORDERS
// ============================================================

const getMyOrders = async (
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
      filter.orderStatus =
        status.trim();
    }

    const skip =
      (currentPage - 1) *
      perPage;

    const [
      orders,
      totalOrders,
    ] = await Promise.all([
      Order.find(filter)
        .select(
          "orderNumber items subtotal totalAmount paymentStatus orderStatus createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalOrders / perPage
    );

    res.status(200).json({
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
    next(error);
  }
};

// ============================================================
// GET ORDER DETAILS
// ============================================================

const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await Order.findOne({
        _id: req.params.id,
        user: req.user.id,
      }).populate(
        "items.product",
        "name slug image price unit"
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};