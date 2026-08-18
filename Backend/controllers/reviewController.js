const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Product ki average rating aur count recalculate karke save karta hai
const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const averageRating = numReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });
};

// @desc  Get all reviews for a product
// @route GET /api/reviews/:productId
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched'));
});

// @desc  Add a review (logged-in user)
// @route POST /api/reviews/:productId
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating || !comment) throw new ApiError(400, 'Rating and comment are required');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) throw new ApiError(400, 'You have already reviewed this product');

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment,
  });

  await recalculateProductRating(productId);

  res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

// @desc  Delete own review
// @route DELETE /api/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
});

module.exports = { getProductReviews, addReview, deleteReview };