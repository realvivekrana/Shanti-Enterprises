const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const FAQ = require('../models/FAQ');

// @desc  Get all active FAQs (public, sorted by order)
// @route GET /api/faqs
const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse(200, faqs, 'FAQs fetched'));
});

// @desc  Get all FAQs including inactive (admin)
// @route GET /api/faqs/all
const getAllFAQsAdmin = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 });
  res.status(200).json(new ApiResponse(200, faqs, 'All FAQs fetched'));
});

// @desc  Create a FAQ (admin)
// @route POST /api/faqs
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, order } = req.body;
  if (!question || !answer) throw new ApiError(400, 'Question and answer are required');

  const faq = await FAQ.create({ question, answer, order });
  res.status(201).json(new ApiResponse(201, faq, 'FAQ created'));
});

// @desc  Update a FAQ (admin)
// @route PUT /api/faqs/:id
const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) throw new ApiError(404, 'FAQ not found');

  Object.assign(faq, req.body);
  await faq.save();

  res.status(200).json(new ApiResponse(200, faq, 'FAQ updated'));
});

// @desc  Delete a FAQ (admin)
// @route DELETE /api/faqs/:id
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) throw new ApiError(404, 'FAQ not found');

  await faq.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'FAQ deleted'));
});

module.exports = { getFAQs, getAllFAQsAdmin, createFAQ, updateFAQ, deleteFAQ };