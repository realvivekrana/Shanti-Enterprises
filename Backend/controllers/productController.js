const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/Product');
const logAction = require('../utils/logAction');

const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category) {
    const categories = category.split(',');
    filter.category = categories.length > 1 ? { $in: categories } : categories[0];
  }
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, products, 'Products fetched'));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse(200, product, 'Product fetched'));
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();

  await logAction({
    user: req.user._id,
    action: 'PRODUCT_CREATED',
    entityType: 'Product',
    entityId: createdProduct._id,
    details: { name: createdProduct.name },
  });

  res.status(201).json(new ApiResponse(201, createdProduct, 'Product created'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  await logAction({
    user: req.user._id,
    action: 'PRODUCT_UPDATED',
    entityType: 'Product',
    entityId: updatedProduct._id,
    details: { changes: req.body },
  });

  res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  await product.deleteOne();

  await logAction({
    user: req.user._id,
    action: 'PRODUCT_DELETED',
    entityType: 'Product',
    entityId: req.params.id,
    details: { name: product.name },
  });

  res.status(200).json(new ApiResponse(200, null, 'Product removed'));
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };