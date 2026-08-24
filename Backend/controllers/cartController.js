// ============================================================
// SHANTI ENTERPRISES
// Cart Controller
// Phase 2 - Shopping
// ============================================================

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ============================================================
// GET CART
// ============================================================

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.id,
    }).populate({
      path: "items.product",
      select:
        "name slug image price stock unit isActive category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });

      cart = await Cart.findById(cart._id).populate({
        path: "items.product",
        select:
          "name slug image price stock unit isActive category",
        populate: {
          path: "category",
          select: "name slug",
        },
      });
    }

    const items = cart.items
      .filter(
        (item) =>
          item.product && item.product.isActive
      )
      .map((item) => ({
        product: item.product,
        quantity: item.quantity,
        subtotal:
          item.product.price * item.quantity,
      }));

    const totalItems = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const subtotal = items.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    res.status(200).json({
      success: true,
      cart: {
        id: cart._id,
        items,
        totalItems,
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADD TO CART
// ============================================================

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const parsedQuantity = Number(quantity);

    if (
      !productId ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      const error = new Error(
        "Product ID and valid quantity are required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (product.stock < parsedQuantity) {
      const error = new Error(
        "Requested quantity is not available in stock"
      );

      error.statusCode = 400;

      return next(error);
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
      });
    }

    const existingItemIndex =
      cart.items.findIndex(
        (item) =>
          item.product.toString() ===
          productId.toString()
      );

    if (existingItemIndex !== -1) {
      const newQuantity =
        cart.items[existingItemIndex].quantity +
        parsedQuantity;

      if (newQuantity > product.stock) {
        const error = new Error(
          "Requested quantity exceeds available stock"
        );

        error.statusCode = 400;

        return next(error);
      }

      cart.items[existingItemIndex].quantity =
        newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity: parsedQuantity,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate({
      path: "items.product",
      select:
        "name slug image price stock unit isActive category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE CART ITEM
// ============================================================

const updateCartItem = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      const error = new Error(
        "Quantity must be a positive whole number"
      );

      error.statusCode = 400;

      return next(error);
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (parsedQuantity > product.stock) {
      const error = new Error(
        "Requested quantity exceeds available stock"
      );

      error.statusCode = 400;

      return next(error);
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      const error = new Error(
        "Cart not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.product.toString() ===
        productId.toString()
    );

    if (!item) {
      const error = new Error(
        "Product is not in your cart"
      );

      error.statusCode = 404;

      return next(error);
    }

    item.quantity = parsedQuantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// REMOVE FROM CART
// ============================================================

const removeFromCart = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      const error = new Error(
        "Cart not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

    if (
      cart.items.length === originalLength
    ) {
      const error = new Error(
        "Product is not in your cart"
      );

      error.statusCode = 404;

      return next(error);
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CLEAR CART
// ============================================================

const clearCart = async (
  req,
  res,
  next
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};