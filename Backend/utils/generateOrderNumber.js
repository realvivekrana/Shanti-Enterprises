// ============================================================
// SHANTI ENTERPRISES
// Order Number Generator
// Backend - Orders
// ============================================================

// ============================================================
// GENERATE ORDER NUMBER
// ============================================================

const generateOrderNumber = () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const timestamp = String(
    Date.now()
  ).slice(-6);

  return `ORD-${year}${month}${day}-${timestamp}`;
};

// ============================================================
// EXPORT
// ============================================================

module.exports =
  generateOrderNumber;