// ============================================================
// SHANTI ENTERPRISES
// Invoice Number Generator
// Backend - Orders / Invoices
// ============================================================

// ============================================================
// GENERATE INVOICE NUMBER
// ============================================================

const generateInvoiceNumber = () => {
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

  return `INV-${year}${month}${day}-${timestamp}`;
};

// ============================================================
// EXPORT
// ============================================================

module.exports =
  generateInvoiceNumber;