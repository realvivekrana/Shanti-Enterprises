// ============================================================
// SHANTI ENTERPRISES
// Product Controller
// Phase 2 - Shopping + Admin CRUD
// ============================================================

const Product = require("../models/Product");
const Category = require("../models/Category");

// ============================================================
// GET ALL ACTIVE PRODUCTS
// ============================================================

const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const {
      search = "",
      category = "",
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 12,
        1
      ),
      50
    );

    const filter = {
      isActive: true,
    };

    if (search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (category.trim()) {
      filter.category =
        category.trim();
    }

    const skip =
      (currentPage - 1) *
      perPage;

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

    const totalPages =
      Math.ceil(
        totalProducts /
          perPage
      );

    res.status(200).json({
      success: true,
      count:
        products.length,

      pagination: {
        page:
          currentPage,

        limit:
          perPage,

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
// GET SINGLE ACTIVE PRODUCT
// ============================================================

const getProductById =
  async (
    req,
    res,
    next
  ) => {
    try {
      const product =
        await Product.findOne({
          _id:
            req.params.id,

          isActive:
            true,
        }).populate(
          "category",
          "name slug"
        );

      if (!product) {
        const error =
          new Error(
            "Product not found"
          );

        error.statusCode =
          404;

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
// CREATE PRODUCT
// ADMIN ONLY
// ============================================================

const createProduct =
  async (
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
        price,
        unit,
        stock,
        moq,
        isWholesale,
        wholesalePriceTiers,
        category,
        isActive,
      } = req.body;

      // --------------------------------------------------------
      // REQUIRED NAME
      // --------------------------------------------------------

      if (
        !name ||
        !name.trim()
      ) {
        const error =
          new Error(
            "Product name is required"
          );

        error.statusCode =
          400;

        return next(error);
      }

      // --------------------------------------------------------
      // REQUIRED SLUG
      // --------------------------------------------------------

      if (
        !slug ||
        !slug.trim()
      ) {
        const error =
          new Error(
            "Product slug is required"
          );

        error.statusCode =
          400;

        return next(error);
      }

      // --------------------------------------------------------
      // REQUIRED PRICE
      // --------------------------------------------------------

      if (
        price === undefined ||
        price === null ||
        price === ""
      ) {
        const error =
          new Error(
            "Product price is required"
          );

        error.statusCode =
          400;

        return next(error);
      }

      const numericPrice =
        Number(price);

      if (
        Number.isNaN(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        const error =
          new Error(
            "Product price must be a valid non-negative number"
          );

        error.statusCode =
          400;

        return next(error);
      }

      // --------------------------------------------------------
      // NORMALIZE
      // --------------------------------------------------------

      const normalizedName =
        name.trim();

      const normalizedSlug =
        slug
          .trim()
          .toLowerCase();

      // --------------------------------------------------------
      // DUPLICATE SLUG
      // --------------------------------------------------------

      const existingProduct =
        await Product.findOne({
          slug:
            normalizedSlug,
        });

      if (
        existingProduct
      ) {
        const error =
          new Error(
            "A product with this slug already exists"
          );

        error.statusCode =
          409;

        return next(error);
      }

      // --------------------------------------------------------
      // CATEGORY VALIDATION
      // --------------------------------------------------------

      let categoryId =
        null;

      if (
        category !==
          undefined &&
        category !==
          null &&
        category !== ""
      ) {
        const categoryExists =
          await Category.findOne({
            _id:
              category,

            isActive:
              true,
          });

        if (
          !categoryExists
        ) {
          const error =
            new Error(
              "Selected category not found or inactive"
            );

          error.statusCode =
            400;

          return next(error);
        }

        categoryId =
          categoryExists._id;
      }

      // --------------------------------------------------------
      // WHOLESALE TIERS
      // --------------------------------------------------------

      let normalizedTiers =
        [];

      if (
        Array.isArray(
          wholesalePriceTiers
        )
      ) {
        normalizedTiers =
          wholesalePriceTiers.map(
            (tier) => ({
              minQuantity:
                Number(
                  tier.minQuantity
                ),

              price:
                Number(
                  tier.price
                ),
            })
          );

        for (
          const tier of normalizedTiers
        ) {
          if (
            !Number.isInteger(
              tier.minQuantity
            ) ||
            tier.minQuantity <
              1
          ) {
            const error =
              new Error(
                "Wholesale minQuantity must be at least 1"
              );

            error.statusCode =
              400;

            return next(
              error
            );
          }

          if (
            Number.isNaN(
              tier.price
            ) ||
            tier.price < 0
          ) {
            const error =
              new Error(
                "Wholesale tier price must be a valid non-negative number"
              );

            error.statusCode =
              400;

            return next(
              error
            );
          }
        }
      }

      // --------------------------------------------------------
      // CREATE PRODUCT
      // --------------------------------------------------------

      const product =
        await Product.create({
          name:
            normalizedName,

          slug:
            normalizedSlug,

          description:
            description
              ? description.trim()
              : "",

          image:
            image
              ? image.trim()
              : "",

          price:
            numericPrice,

          unit:
            unit
              ? unit.trim()
              : "piece",

          stock:
            stock !==
              undefined &&
            stock !== ""
              ? Number(stock)
              : 0,

          moq:
            moq !==
              undefined &&
            moq !== ""
              ? Number(moq)
              : 1,

          isWholesale:
            isWholesale !==
            undefined
              ? Boolean(
                  isWholesale
                )
              : true,

          wholesalePriceTiers:
            normalizedTiers,

          category:
            categoryId,

          isActive:
            isActive !==
            undefined
              ? Boolean(
                  isActive
                )
              : true,
        });

      // --------------------------------------------------------
      // POPULATE CATEGORY
      // --------------------------------------------------------

      await product.populate(
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

        product,
      });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// UPDATE PRODUCT
// ADMIN ONLY
// ============================================================

const updateProduct =
  async (
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
        price,
        unit,
        stock,
        moq,
        isWholesale,
        wholesalePriceTiers,
        category,
        isActive,
      } = req.body;

      // --------------------------------------------------------
      // FIND PRODUCT
      // --------------------------------------------------------

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        const error =
          new Error(
            "Product not found"
          );

        error.statusCode =
          404;

        return next(error);
      }

      // --------------------------------------------------------
      // NAME
      // --------------------------------------------------------

      if (
        name !==
        undefined
      ) {
        const normalizedName =
          name.trim();

        if (
          !normalizedName
        ) {
          const error =
            new Error(
              "Product name cannot be empty"
            );

          error.statusCode =
            400;

          return next(error);
        }

        product.name =
          normalizedName;
      }

      // --------------------------------------------------------
      // SLUG
      // --------------------------------------------------------

      if (
        slug !==
        undefined
      ) {
        const normalizedSlug =
          slug
            .trim()
            .toLowerCase();

        if (
          !normalizedSlug
        ) {
          const error =
            new Error(
              "Product slug cannot be empty"
            );

          error.statusCode =
            400;

          return next(error);
        }

        const duplicate =
          await Product.findOne({
            slug:
              normalizedSlug,

            _id: {
              $ne:
                product._id,
            },
          });

        if (duplicate) {
          const error =
            new Error(
              "A product with this slug already exists"
            );

          error.statusCode =
            409;

          return next(error);
        }

        product.slug =
          normalizedSlug;
      }

      // --------------------------------------------------------
      // DESCRIPTION
      // --------------------------------------------------------

      if (
        description !==
        undefined
      ) {
        product.description =
          description.trim();
      }

      // --------------------------------------------------------
      // IMAGE
      // --------------------------------------------------------

      if (
        image !==
        undefined
      ) {
        product.image =
          image.trim();
      }

      // --------------------------------------------------------
      // PRICE
      // --------------------------------------------------------

      if (
        price !==
        undefined
      ) {
        const numericPrice =
          Number(price);

        if (
          Number.isNaN(
            numericPrice
          ) ||
          numericPrice < 0
        ) {
          const error =
            new Error(
              "Product price must be a valid non-negative number"
            );

          error.statusCode =
            400;

          return next(error);
        }

        product.price =
          numericPrice;
      }

      // --------------------------------------------------------
      // UNIT
      // --------------------------------------------------------

      if (
        unit !==
        undefined
      ) {
        product.unit =
          unit.trim();
      }

      // --------------------------------------------------------
      // STOCK
      // --------------------------------------------------------

      if (
        stock !==
        undefined
      ) {
        const numericStock =
          Number(stock);

        if (
          Number.isNaN(
            numericStock
          ) ||
          numericStock < 0
        ) {
          const error =
            new Error(
              "Stock must be a valid non-negative number"
            );

          error.statusCode =
            400;

          return next(error);
        }

        product.stock =
          numericStock;
      }

      // --------------------------------------------------------
      // MOQ
      // --------------------------------------------------------

      if (
        moq !==
        undefined
      ) {
        const numericMoq =
          Number(moq);

        if (
          !Number.isInteger(
            numericMoq
          ) ||
          numericMoq < 1
        ) {
          const error =
            new Error(
              "MOQ must be at least 1"
            );

          error.statusCode =
            400;

          return next(error);
        }

        product.moq =
          numericMoq;
      }

      // --------------------------------------------------------
      // WHOLESALE
      // --------------------------------------------------------

      if (
        isWholesale !==
        undefined
      ) {
        product.isWholesale =
          Boolean(
            isWholesale
          );
      }

      // --------------------------------------------------------
      // WHOLESALE PRICE TIERS
      // --------------------------------------------------------

      if (
        wholesalePriceTiers !==
        undefined
      ) {
        if (
          !Array.isArray(
            wholesalePriceTiers
          )
        ) {
          const error =
            new Error(
              "wholesalePriceTiers must be an array"
            );

          error.statusCode =
            400;

          return next(error);
        }

        const normalizedTiers =
          wholesalePriceTiers.map(
            (tier) => ({
              minQuantity:
                Number(
                  tier.minQuantity
                ),

              price:
                Number(
                  tier.price
                ),
            })
          );

        for (
          const tier of normalizedTiers
        ) {
          if (
            !Number.isInteger(
              tier.minQuantity
            ) ||
            tier.minQuantity <
              1
          ) {
            const error =
              new Error(
                "Wholesale minQuantity must be at least 1"
              );

            error.statusCode =
              400;

            return next(
              error
            );
          }

          if (
            Number.isNaN(
              tier.price
            ) ||
            tier.price < 0
          ) {
            const error =
              new Error(
                "Wholesale tier price must be valid"
              );

            error.statusCode =
              400;

            return next(
              error
            );
          }
        }

        product.wholesalePriceTiers =
          normalizedTiers;
      }

      // --------------------------------------------------------
      // CATEGORY
      // --------------------------------------------------------

      if (
        category !==
        undefined
      ) {
        if (
          category ===
          null ||
          category ===
          ""
        ) {
          product.category =
            null;
        } else {
          const categoryExists =
            await Category.findOne({
              _id:
                category,

              isActive:
                true,
            });

          if (
            !categoryExists
          ) {
            const error =
              new Error(
                "Selected category not found or inactive"
              );

            error.statusCode =
              400;

            return next(
              error
            );
          }

          product.category =
            categoryExists._id;
        }
      }

      // --------------------------------------------------------
      // ACTIVE STATUS
      // --------------------------------------------------------

      if (
        isActive !==
        undefined
      ) {
        product.isActive =
          Boolean(
            isActive
          );
      }

      // --------------------------------------------------------
      // SAVE
      // --------------------------------------------------------

      await product.save();

      await product.populate(
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

        product,
      });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// DELETE PRODUCT
// ADMIN ONLY
// ============================================================
//
// Soft delete:
// isActive = false
//
// Product remains in MongoDB for historical data safety.
// ============================================================

const deleteProduct =
  async (
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
        const error =
          new Error(
            "Product not found"
          );

        error.statusCode =
          404;

        return next(error);
      }

      product.isActive =
        false;

      await product.save();

      res.status(200).json({
        success: true,

        message:
          "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};