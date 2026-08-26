// ============================================================
// SHANTI ENTERPRISES
// Category Controller
// Phase 2 - Shopping + Admin CRUD
// ============================================================

const Category = require("../models/Category");

// ============================================================
// GET ALL ACTIVE CATEGORIES
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
// GET SINGLE ACTIVE CATEGORY
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

// ============================================================
// CREATE CATEGORY
// ADMIN ONLY
// ============================================================

const createCategory = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      slug,
      description,
      image,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!name || !name.trim()) {
      const error = new Error(
        "Category name is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (!slug || !slug.trim()) {
      const error = new Error(
        "Category slug is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const normalizedName =
      name.trim();

    const normalizedSlug =
      slug.trim().toLowerCase();

    // --------------------------------------------------------
    // CHECK DUPLICATE NAME
    // --------------------------------------------------------

    const existingName =
      await Category.findOne({
        name: normalizedName,
      });

    if (existingName) {
      const error = new Error(
        "A category with this name already exists"
      );

      error.statusCode = 409;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK DUPLICATE SLUG
    // --------------------------------------------------------

    const existingSlug =
      await Category.findOne({
        slug: normalizedSlug,
      });

    if (existingSlug) {
      const error = new Error(
        "A category with this slug already exists"
      );

      error.statusCode = 409;

      return next(error);
    }

    // --------------------------------------------------------
    // CREATE CATEGORY
    // --------------------------------------------------------

    const category =
      await Category.create({
        name: normalizedName,
        slug: normalizedSlug,
        description:
          description
            ? description.trim()
            : "",
        image:
          image
            ? image.trim()
            : "",
        isActive: true,
      });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE CATEGORY
// ADMIN ONLY
// ============================================================

const updateCategory = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      isActive,
    } = req.body;

    // --------------------------------------------------------
    // FIND CATEGORY
    // --------------------------------------------------------

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      const error = new Error(
        "Category not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // UPDATE NAME
    // --------------------------------------------------------

    if (
      name !== undefined
    ) {
      const normalizedName =
        name.trim();

      if (!normalizedName) {
        const error = new Error(
          "Category name cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      const duplicateName =
        await Category.findOne({
          name: normalizedName,
          _id: {
            $ne: category._id,
          },
        });

      if (duplicateName) {
        const error = new Error(
          "A category with this name already exists"
        );

        error.statusCode = 409;

        return next(error);
      }

      category.name =
        normalizedName;
    }

    // --------------------------------------------------------
    // UPDATE SLUG
    // --------------------------------------------------------

    if (
      slug !== undefined
    ) {
      const normalizedSlug =
        slug.trim().toLowerCase();

      if (!normalizedSlug) {
        const error = new Error(
          "Category slug cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      const duplicateSlug =
        await Category.findOne({
          slug: normalizedSlug,
          _id: {
            $ne: category._id,
          },
        });

      if (duplicateSlug) {
        const error = new Error(
          "A category with this slug already exists"
        );

        error.statusCode = 409;

        return next(error);
      }

      category.slug =
        normalizedSlug;
    }

    // --------------------------------------------------------
    // UPDATE DESCRIPTION
    // --------------------------------------------------------

    if (
      description !== undefined
    ) {
      category.description =
        description.trim();
    }

    // --------------------------------------------------------
    // UPDATE IMAGE
    // --------------------------------------------------------

    if (
      image !== undefined
    ) {
      category.image =
        image.trim();
    }

    // --------------------------------------------------------
    // UPDATE ACTIVE STATUS
    // --------------------------------------------------------

    if (
      isActive !== undefined
    ) {
      category.isActive =
        Boolean(isActive);
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await category.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE CATEGORY
// ADMIN ONLY
// ============================================================
//
// Soft delete is used instead of permanently removing the
// category from MongoDB.
//
// isActive = false
//
// This keeps historical data safe.
// ============================================================

const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      const error = new Error(
        "Category not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    category.isActive =
      false;

    await category.save();

    res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};