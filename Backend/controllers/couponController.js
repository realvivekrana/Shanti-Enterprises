const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Coupon = require('../models/Coupon');

// @desc  Create a coupon (admin)
// @route POST /api/coupons
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, maxDiscount, expiresAt, usageLimit } = req.body;

  const exists = await Coupon.findOne({ code: code?.toUpperCase() });
  if (exists) throw new ApiError(400, 'Coupon code already exists');

  const coupon = await Coupon.create({
    code, discountType, discountValue, minOrderValue, maxDiscount, expiresAt, usageLimit,
  });

  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'));
});

// @desc  Get all coupons (admin)
// @route GET /api/coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, coupons, 'Coupons fetched'));
});

// @desc  Delete a coupon (admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  await coupon.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Coupon deleted'));
});

// @desc  Validate & apply a coupon code (customer, at checkout)
// @route POST /api/coupons/apply
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;

  if (!code || cartTotal === undefined) {
    throw new ApiError(400, 'Coupon code and cartTotal are required');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid or inactive coupon code');

  if (coupon.expiresAt < new Date()) {
    throw new ApiError(400, 'This coupon has expired');
  }

  if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
    throw new ApiError(400, 'This coupon has reached its usage limit');
  }

  if (cartTotal < coupon.minOrderValue) {
    throw new ApiError(400, `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, cartTotal); // discount kabhi total se zyada na ho

  res.status(200).json(
    new ApiResponse(200, {
      code: coupon.code,
      discount: Math.round(discount),
      finalTotal: Math.round(cartTotal - discount),
    }, 'Coupon applied successfully')
  );
});

module.exports = { createCoupon, getCoupons, deleteCoupon, applyCoupon };