const getWholesaleUnitPrice = (
  product,
  quantity
) => {
  const requestedQuantity =
    Number(quantity);

  if (
    !Number.isInteger(
      requestedQuantity
    ) ||
    requestedQuantity < 1
  ) {
    throw new Error(
      'Quantity must be a positive whole number'
    );
  }

  const moq =
    Number(product.moq || 1);

  if (
    requestedQuantity < moq
  ) {
    throw new Error(
      `Minimum order quantity for ${product.name} is ${moq} pieces`
    );
  }

  let unitPrice =
    Number(product.price);

  let matchedTier = null;

  const pricingTiers = [
    ...(product.wholesalePricing ||
      []),
  ].sort(
    (a, b) =>
      Number(a.minQuantity) -
      Number(b.minQuantity)
  );

  for (const tier of pricingTiers) {
    const minQuantity =
      Number(
        tier.minQuantity
      );

    const maxQuantity =
      tier.maxQuantity === null ||
      tier.maxQuantity ===
        undefined ||
      tier.maxQuantity === ''
        ? null
        : Number(
            tier.maxQuantity
          );

    const isMatch =
      requestedQuantity >=
        minQuantity &&
      (
        maxQuantity === null ||
        requestedQuantity <=
          maxQuantity
      );

    if (isMatch) {
      unitPrice =
        Number(tier.price);

      matchedTier = {
        minQuantity,
        maxQuantity,
        price: unitPrice,
      };

      break;
    }
  }

  return {
    unitPrice,
    matchedTier,
  };
};

module.exports = {
  getWholesaleUnitPrice,
};