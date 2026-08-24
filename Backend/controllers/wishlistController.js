// ============================================================
// SHANTI ENTERPRISES
// Wishlist Controller
// Phase 3 - Customer Portal
// ============================================================

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ============================================================
// GET MY WISHLIST
// ============================================================

const getWishlist = async (
  req,
  res,
  next
) => {
  try {
    let wishlist =
      await Wishlist.findOne({
        user: req.user.id,
      }).populate(
        "products",
        "name slug image price stock unit category"
      );

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [],
      });

      wishlist =
        await Wishlist.findById(
          wishlist._id
        ).populate(
          "products",
          "name slug image price stock unit category"
        );
    }

    const activeProducts =
      wishlist.products.filter(
        (product) =>
          product && product.stock >= 0
      );

    res.status(200).json({
      success: true,
      count: activeProducts.length,
      products: activeProducts,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADD TO WISHLIST
// ============================================================

const addToWishlist = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      const error = new Error(
        "Product ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const product =
      await Product.findOne({
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

    let wishlist =
      await Wishlist.findOne({
        user: req.user.id,
      });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: [],
      });
    }

    const alreadyExists =
      wishlist.products.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message:
          "Product is already in wishlist",
      });
    }

    wishlist.products.push(
      product._id
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message:
        "Product added to wishlist",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

const removeFromWishlist = async (
  req,
  res,
  next
) => {
  try {
    const { productId } =
      req.params;

    const wishlist =
      await Wishlist.findOne({
        user: req.user.id,
      });

    if (!wishlist) {
      const error = new Error(
        "Wishlist not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const originalLength =
      wishlist.products.length;

    wishlist.products =
      wishlist.products.filter(
        (id) =>
          id.toString() !==
          productId.toString()
      );

    if (
      wishlist.products.length ===
      originalLength
    ) {
      const error = new Error(
        "Product is not in wishlist"
      );

      error.statusCode = 404;

      return next(error);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message:
        "Product removed from wishlist",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CLEAR WISHLIST
// ============================================================

const clearWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist =
      await Wishlist.findOne({
        user: req.user.id,
      });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message:
          "Wishlist is already empty",
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message:
        "Wishlist cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};