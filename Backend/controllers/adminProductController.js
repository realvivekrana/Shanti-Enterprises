// ============================================================
// SHANTI ENTERPRISES
// Admin Product Controller
// Phase 6 - Admin
// ============================================================

const Product = require("../models/Product");
const Category = require("../models/Category");

// ============================================================
// HELPER - NORMALIZE WHOLESALE PRICE TIERS
// ============================================================

const normalizeWholesalePriceTiers = (
  wholesalePriceTiers
) => {
  if (!Array.isArray(wholesalePriceTiers)) {
    return [];
  }

  return wholesalePriceTiers
    .map((tier) => ({
      minQuantity: Number(
        tier?.minQuantity
      ),
      price: Number(
        tier?.price
      ),
    }))
    .filter(
      (tier) =>
        Number.isInteger(
          tier.minQuantity
        ) &&
        tier.minQuantity >= 1 &&
        Number.isFinite(
          tier.price
        ) &&
        tier.price >= 0
    )
    .sort(
      (a, b) =>
        a.minQuantity -
        b.minQuantity
    );
};

// ============================================================
// GET ALL PRODUCTS - ADMIN
// ============================================================

const getAdminProducts = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      category = "",
      status = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    const filter = {};

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (category.trim()) {
      filter.category =
        category.trim();
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    // --------------------------------------------------------
    // PAGINATION
    // --------------------------------------------------------

    const skip =
      (currentPage - 1) *
      perPage;

    // --------------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------------

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Product.countDocuments(
        filter
      ),
    ]);

    const totalPages = Math.ceil(
      totalProducts / perPage
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      count:
        products.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalProducts,
        totalPages,
      },

      products,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE PRODUCT - ADMIN
// ============================================================

const getAdminProductById = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).populate(
        "category",
        "name slug"
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE PRODUCT - ADMIN
// ============================================================

const createAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      slug,
      sku,
      description = "",
      brand = "",
      category,
      price,
      moq,
      stock,
      unit = "piece",
      isWholesale,
      isActive,
      image = "",
      wholesalePriceTiers = [],
    } = req.body;

    // --------------------------------------------------------
    // NAME VALIDATION
    // --------------------------------------------------------

    if (
      !name ||
      !String(name).trim()
    ) {
      const error = new Error(
        "Product name is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // SLUG VALIDATION
    // --------------------------------------------------------

    if (
      !slug ||
      !String(slug).trim()
    ) {
      const error = new Error(
        "Product slug is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    const normalizedSlug =
      String(slug)
        .trim()
        .toLowerCase();

    // --------------------------------------------------------
    // PRICE VALIDATION
    // --------------------------------------------------------

    const numericPrice =
      Number(price);

    if (
      price === undefined ||
      price === null ||
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
    ) {
      const error = new Error(
        "Valid product price is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // DUPLICATE SLUG CHECK
    // --------------------------------------------------------

    const existingProduct =
      await Product.findOne({
        slug: normalizedSlug,
      });

    if (existingProduct) {
      const error = new Error(
        "A product with this slug already exists"
      );

      error.statusCode = 409;

      return next(error);
    }

    // --------------------------------------------------------
    // SKU VALIDATION
    // --------------------------------------------------------

    const normalizedSku =
      sku === undefined ||
      sku === null ||
      String(sku).trim() === ""
        ? undefined
        : String(sku).trim().toUpperCase();

    if (normalizedSku) {
      const existingSku =
        await Product.findOne({
          sku: normalizedSku,
        });

      if (existingSku) {
        const error = new Error(
          "A product with this SKU already exists"
        );

        error.statusCode = 409;

        return next(error);
      }
    }

    // --------------------------------------------------------
    // CATEGORY VALIDATION
    // --------------------------------------------------------

    let categoryId = null;

    if (category) {
      const categoryExists =
        await Category.findOne({
          _id: category,
          isActive: true,
        });

      if (!categoryExists) {
        const error = new Error(
          "Category not found or inactive"
        );

        error.statusCode = 400;

        return next(error);
      }

      categoryId =
        categoryExists._id;
    }

    // --------------------------------------------------------
    // STOCK
    // --------------------------------------------------------

    const numericStock =
      Number(stock);

    const finalStock =
      Number.isFinite(
        numericStock
      ) &&
      numericStock >= 0
        ? numericStock
        : 0;

    // --------------------------------------------------------
    // MOQ
    // --------------------------------------------------------

    const numericMoq =
      Number(moq);

    const finalMoq =
      Number.isInteger(
        numericMoq
      ) &&
      numericMoq >= 1
        ? numericMoq
        : 1;

    // --------------------------------------------------------
    // WHOLESALE PRICE TIERS
    // --------------------------------------------------------

    const normalizedTiers =
      normalizeWholesalePriceTiers(
        wholesalePriceTiers
      );

    // --------------------------------------------------------
    // PRODUCT DATA
    // --------------------------------------------------------

    const productData = {
      name:
        String(name).trim(),

      slug:
        normalizedSlug,

      sku:
        normalizedSku,

      description:
        String(
          description
        ).trim(),

      brand:
        String(
          brand || ""
        ).trim(),

      image:
        String(
          image || ""
        ).trim(),

      price:
        numericPrice,

      unit:
        String(
          unit || "piece"
        ).trim(),

      stock:
        finalStock,

      moq:
        finalMoq,

      isWholesale:
        isWholesale !== false,

      wholesalePriceTiers:
        normalizedTiers,

      category:
        categoryId,

      isActive:
        isActive !== false,
    };

    // --------------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------------

    const product =
      await Product.create(
        productData
      );

    // --------------------------------------------------------
    // POPULATE CATEGORY
    // --------------------------------------------------------

    const populatedProduct =
      await Product.findById(
        product._id
      ).populate(
        "category",
        "name slug"
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(201).json({
      success: true,

      message:
        "Product created successfully",

      product:
        populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE PRODUCT - ADMIN
// ============================================================

const updateAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const {
      name,
      slug,
      sku,
      description,
      brand,
      category,
      price,
      moq,
      stock,
      unit,
      isWholesale,
      isActive,
      image,
      wholesalePriceTiers,
    } = req.body;

    // --------------------------------------------------------
    // UPDATE NAME
    // --------------------------------------------------------

    if (
      name !== undefined
    ) {
      const normalizedName =
        String(name).trim();

      if (!normalizedName) {
        const error = new Error(
          "Product name cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.name =
        normalizedName;
    }

    // --------------------------------------------------------
    // UPDATE SLUG
    // --------------------------------------------------------

    if (
      slug !== undefined
    ) {
      const normalizedSlug =
        String(slug)
          .trim()
          .toLowerCase();

      if (!normalizedSlug) {
        const error = new Error(
          "Product slug cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      const duplicateSlug =
        await Product.findOne({
          slug: normalizedSlug,
          _id: {
            $ne: product._id,
          },
        });

      if (duplicateSlug) {
        const error = new Error(
          "A product with this slug already exists"
        );

        error.statusCode = 409;

        return next(error);
      }

      product.slug =
        normalizedSlug;
    }

    // --------------------------------------------------------
    // UPDATE SKU
    // --------------------------------------------------------

    if (
      sku !== undefined
    ) {
      const normalizedSku =
        String(sku || "")
          .trim()
          .toUpperCase();

      if (!normalizedSku) {
        product.sku = undefined;
      } else {
        const duplicateSku =
          await Product.findOne({
            sku: normalizedSku,
            _id: {
              $ne: product._id,
            },
          });

        if (duplicateSku) {
          const error = new Error(
            "A product with this SKU already exists"
          );

          error.statusCode = 409;

          return next(error);
        }

        product.sku = normalizedSku;
      }
    }

    // --------------------------------------------------------
    // UPDATE DESCRIPTION
    // --------------------------------------------------------

    if (
      description !== undefined
    ) {
      product.description =
        String(
          description
        ).trim();
    }

    // --------------------------------------------------------
    // UPDATE BRAND
    // --------------------------------------------------------

    if (
      brand !== undefined
    ) {
      product.brand =
        String(brand || "").trim();
    }

    // --------------------------------------------------------
    // UPDATE CATEGORY
    // --------------------------------------------------------

    if (
      category !== undefined
    ) {
      if (
        category === null ||
        category === ""
      ) {
        product.category =
          null;
      } else {
        const categoryExists =
          await Category.findOne({
            _id: category,
            isActive: true,
          });

        if (!categoryExists) {
          const error = new Error(
            "Category not found or inactive"
          );

          error.statusCode = 400;

          return next(error);
        }

        product.category =
          categoryExists._id;
      }
    }

    // --------------------------------------------------------
    // UPDATE PRICE
    // --------------------------------------------------------

    if (
      price !== undefined
    ) {
      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        const error = new Error(
          "Invalid product price"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.price =
        numericPrice;
    }

    // --------------------------------------------------------
    // UPDATE MOQ
    // --------------------------------------------------------

    if (
      moq !== undefined
    ) {
      const numericMoq =
        Number(moq);

      if (
        !Number.isInteger(
          numericMoq
        ) ||
        numericMoq < 1
      ) {
        const error = new Error(
          "MOQ must be a positive whole number"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.moq =
        numericMoq;
    }

    // --------------------------------------------------------
    // UPDATE STOCK
    // --------------------------------------------------------

    if (
      stock !== undefined
    ) {
      const numericStock =
        Number(stock);

      if (
        !Number.isFinite(
          numericStock
        ) ||
        numericStock < 0
      ) {
        const error = new Error(
          "Stock cannot be negative"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.stock =
        numericStock;
    }

    // --------------------------------------------------------
    // UPDATE UNIT
    // --------------------------------------------------------

    if (
      unit !== undefined
    ) {
      const normalizedUnit =
        String(unit).trim();

      if (!normalizedUnit) {
        const error = new Error(
          "Unit cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.unit =
        normalizedUnit;
    }

    // --------------------------------------------------------
    // UPDATE WHOLESALE STATUS
    // --------------------------------------------------------

    if (
      isWholesale !== undefined
    ) {
      product.isWholesale =
        Boolean(isWholesale);
    }

    // --------------------------------------------------------
    // UPDATE WHOLESALE PRICE TIERS
    // --------------------------------------------------------

    if (
      wholesalePriceTiers !==
      undefined
    ) {
      product.wholesalePriceTiers =
        normalizeWholesalePriceTiers(
          wholesalePriceTiers
        );
    }

    // --------------------------------------------------------
    // UPDATE ACTIVE STATUS
    // --------------------------------------------------------

    if (
      isActive !== undefined
    ) {
      product.isActive =
        Boolean(isActive);
    }

    // --------------------------------------------------------
    // UPDATE IMAGE
    // --------------------------------------------------------

    if (
      image !== undefined
    ) {
      product.image =
        String(image).trim();
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await product.save();

    // --------------------------------------------------------
    // POPULATE CATEGORY
    // --------------------------------------------------------

    const updatedProduct =
      await Product.findById(
        product._id
      ).populate(
        "category",
        "name slug"
      );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(200).json({
      success: true,

      message:
        "Product updated successfully",

      product:
        updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE PRODUCT - ADMIN
// ============================================================
//
// Soft delete is safer for an ecommerce system.
// Existing orders can still keep their product reference.
// ============================================================

const deleteAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    product.isActive =
      false;

    await product.save();

    res.status(200).json({
      success: true,

      message:
        "Product deleted successfully",

      product: {
        id: product._id,

        name: product.name,

        isActive:
          product.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// TOGGLE PRODUCT STATUS
// ============================================================

const toggleProductStatus = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    product.isActive =
      !product.isActive;

    await product.save();

    res.status(200).json({
      success: true,

      message:
        product.isActive
          ? "Product activated successfully"
          : "Product deactivated successfully",

      product: {
        id: product._id,

        name: product.name,

        isActive:
          product.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductStatus,
};
