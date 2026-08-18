const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');

// @desc  Get logged-in user's wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json(new ApiResponse(200, user.wishlist, 'Wishlist fetched'));
});

// @desc  Add a product to wishlist
// @route POST /api/wishlist/:productId
const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  if (user.wishlist.includes(productId)) {
    throw new ApiError(400, 'Product already in wishlist');
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json(new ApiResponse(200, user.wishlist, 'Added to wishlist'));
});

// @desc  Remove a product from wishlist
// @route DELETE /api/wishlist/:productId
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  res.status(200).json(new ApiResponse(200, user.wishlist, 'Removed from wishlist'));
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };