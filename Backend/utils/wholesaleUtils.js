// ============================================================
// SHANTI ENTERPRISES
// Wholesale Utilities
// Phase 4 - Wholesale
// ============================================================

// ============================================================
// VALIDATE WHOLESALE QUANTITY
// ============================================================

const validateWholesaleQuantity = (
  quantity,
  moq
) => {
  const parsedQuantity =
    Number(quantity);

  const parsedMOQ =
    Number(moq);

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1
  ) {
    return {
      valid: false,
      message:
        "Quantity must be a valid positive number",
    };
  }

  if (
    !Number.isInteger(parsedMOQ) ||
    parsedMOQ < 1
  ) {
    return {
      valid: false,
      message:
        "Product MOQ is invalid",
    };
  }

  if (parsedQuantity < parsedMOQ) {
    return {
      valid: false,
      message:
        `Minimum order quantity is ${parsedMOQ}`,
    };
  }

  return {
    valid: true,
  };
};

// ============================================================
// GET WHOLESALE PRICE
// ============================================================

const getWholesalePrice = (
  product,
  quantity
) => {
  const parsedQuantity =
    Number(quantity);

  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1
  ) {
    return null;
  }

  // No wholesale pricing configured
  if (
    !Array.isArray(
      product.wholesalePriceTiers
    ) ||
    product.wholesalePriceTiers.length === 0
  ) {
    return product.price;
  }

  // Highest matching quantity tier wins
  const matchingTiers =
    product.wholesalePriceTiers
      .filter(
        (tier) =>
          parsedQuantity >=
          tier.minQuantity
      )
      .sort(
        (a, b) =>
          b.minQuantity -
          a.minQuantity
      );

  if (matchingTiers.length === 0) {
    return product.price;
  }

  return matchingTiers[0].price;
};

module.exports = {
  validateWholesaleQuantity,
  getWholesalePrice,
};