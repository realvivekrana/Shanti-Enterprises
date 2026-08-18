const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/Product');

// @desc  Adjust stock (increase or decrease) for a product
// @route PATCH /api/inventory/:id/adjust
const adjustStock = asyncHandler(async (req, res) => {
  const { change, reason } = req.body; // change: +5 or -3

  if (change === undefined || isNaN(change)) {
    throw new ApiError(400, 'A numeric "change" value is required');
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const newStock = product.stock + Number(change);
  if (newStock < 0) {
    throw new ApiError(400, `Cannot reduce stock below 0 (current stock: ${product.stock})`);
  }

  product.stock = newStock;
  await product.save();

  res.status(200).json(
    new ApiResponse(200, { product, change, reason: reason || 'Manual adjustment' }, 'Stock updated successfully')
  );
});

// @desc  Set exact stock value for a product
// @route PATCH /api/inventory/:id/set
const setStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || isNaN(stock) || stock < 0) {
    throw new ApiError(400, 'A valid non-negative "stock" value is required');
  }

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  product.stock = Number(stock);
  await product.save();

  res.status(200).json(new ApiResponse(200, product, 'Stock set successfully'));
});

// @desc  Get all products with low stock (at or below their threshold)
// @route GET /api/inventory/low-stock
const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  }).sort({ stock: 1 });

  res.status(200).json(new ApiResponse(200, products, 'Low stock products fetched'));
});

module.exports = { adjustStock, setStock, getLowStockProducts };