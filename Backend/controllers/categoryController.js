// ============================================================
// SHANTI ENTERPRISES
// Category Controller
// Phase 2 - Shopping
// ============================================================

const Category = require("../models/Category");

// ============================================================
// GET ALL CATEGORIES
// ============================================================

const getCategories = async (
  req,
  res,
  next
) => {
  try {
    const categories =
      await Category.find({
        isActive: true,
      }).sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE CATEGORY
// ============================================================

const getCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await Category.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!category) {
      const error = new Error(
        "Category not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
};