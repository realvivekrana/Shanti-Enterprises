// ============================================================
// SHANTI ENTERPRISES
// Price Calculation Utility
// Backend - B2B / Wholesale Pricing
// ============================================================

// ============================================================
// CALCULATE UNIT PRICE
// ============================================================
//
// quantity ke according wholesale price apply hota hai.
// Expected product structure:
//
// product.price
// product.wholesalePrice
// product.wholesalePricing = [
//   {
//     minQuantity,
//     price
//   }
// ]
//

const calculateUnitPrice = (
  product,
  quantity = 1
) => {
  if (!product) {
    throw new Error(
      "Product is required for price calculation"
    );
  }

  const qty = Number(quantity);

  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error(
      "Quantity must be greater than 0"
    );
  }

  let unitPrice = Number(
    product.price || 0
  );

  // ==========================================================
  // WHOLESALE PRICING
  // ==========================================================

  if (
    Array.isArray(
      product.wholesalePricing
    ) &&
    product.wholesalePricing.length > 0
  ) {
    const applicableTier =
      [...product.wholesalePricing]
        .filter((tier) => {
          const minQuantity = Number(
            tier.minQuantity || 0
          );

          return (
            Number.isFinite(
              minQuantity
            ) &&
            qty >= minQuantity
          );
        })
        .sort(
          (a, b) =>
            Number(
              b.minQuantity || 0
            ) -
            Number(
              a.minQuantity || 0
            )
        )[0];

    if (applicableTier) {
      unitPrice = Number(
        applicableTier.price
      );
    }
  }

  // ==========================================================
  // WHOLESALE PRICE FALLBACK
  // ==========================================================

  if (
    qty >=
      Number(
        product.wholesaleMinQuantity ||
          0
      ) &&
    product.wholesalePrice !==
      undefined &&
    product.wholesalePrice !== null
  ) {
    const wholesalePrice =
      Number(
        product.wholesalePrice
      );

    if (
      Number.isFinite(
        wholesalePrice
      ) &&
      wholesalePrice > 0
    ) {
      unitPrice =
        wholesalePrice;
    }
  }

  // ==========================================================
  // FINAL PRICE VALIDATION
  // ==========================================================

  if (
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {
    throw new Error(
      "Invalid product price"
    );
  }

  return Number(
    unitPrice.toFixed(2)
  );
};

// ============================================================
// CALCULATE TOTAL PRICE
// ============================================================

const calculateTotalPrice = (
  product,
  quantity = 1
) => {
  const unitPrice =
    calculateUnitPrice(
      product,
      quantity
    );

  const qty =
    Number(quantity);

  return Number(
    (unitPrice * qty).toFixed(2)
  );
};

// ============================================================
// CALCULATE CART ITEM TOTAL
// ============================================================

const calculateCartItemTotal = (
  item
) => {
  if (!item) {
    throw new Error(
      "Cart item is required"
    );
  }

  const product =
    item.product || item;

  const quantity =
    item.quantity || 1;

  return calculateTotalPrice(
    product,
    quantity
  );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  calculateUnitPrice,
  calculateTotalPrice,
  calculateCartItemTotal,
};