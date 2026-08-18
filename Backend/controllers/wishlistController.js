const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const User =
  require('../models/User');

const Product =
  require('../models/Product');

// ==============================
// GET MY WISHLIST
// ==============================
// GET /api/wishlist

const getMyWishlist =
  asyncHandler(async (req, res) => {

    const user =
      await User.findById(
        req.user._id
      ).populate('wishlist');

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        user.wishlist || [],
        'Wishlist fetched successfully'
      )
    );
  });

// ==============================
// ADD TO WISHLIST
// ==============================
// POST /api/wishlist/:productId

const addToWishlist =
  asyncHandler(async (req, res) => {

    const { productId } =
      req.params;

    // ==============================
    // CHECK PRODUCT
    // ==============================

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    // ==============================
    // GET USER
    // ==============================

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    // ==============================
    // CHECK DUPLICATE
    // ==============================

    const alreadyExists =
      user.wishlist.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    if (alreadyExists) {
      throw new ApiError(
        400,
        'Product already exists in wishlist'
      );
    }

    // ==============================
    // ADD PRODUCT
    // ==============================

    user.wishlist.push(
      productId
    );

    await user.save();

    // ==============================
    // GET UPDATED WISHLIST
    // ==============================

    const updatedUser =
      await User.findById(
        req.user._id
      ).populate('wishlist');

    res.status(200).json(
      new ApiResponse(
        200,
        updatedUser.wishlist,
        'Product added to wishlist'
      )
    );
  });

// ==============================
// REMOVE FROM WISHLIST
// ==============================
// DELETE /api/wishlist/:productId

const removeFromWishlist =
  asyncHandler(async (req, res) => {

    const { productId } =
      req.params;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    const exists =
      user.wishlist.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    if (!exists) {
      throw new ApiError(
        404,
        'Product not found in wishlist'
      );
    }

    // ==============================
    // REMOVE PRODUCT
    // ==============================

    user.wishlist =
      user.wishlist.filter(
        (id) =>
          id.toString() !==
          productId.toString()
      );

    await user.save();

    // ==============================
    // UPDATED WISHLIST
    // ==============================

    const updatedUser =
      await User.findById(
        req.user._id
      ).populate('wishlist');

    res.status(200).json(
      new ApiResponse(
        200,
        updatedUser.wishlist,
        'Product removed from wishlist'
      )
    );
  });

// ==============================
// CHECK WISHLIST
// ==============================
// GET /api/wishlist/check/:productId

const checkWishlist =
  asyncHandler(async (req, res) => {

    const { productId } =
      req.params;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    const isWishlisted =
      user.wishlist.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          isWishlisted,
        },
        'Wishlist status fetched'
      )
    );
  });

// ==============================
// EXPORT
// ==============================

module.exports = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};