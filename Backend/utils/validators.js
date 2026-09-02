// ============================================================
// SHANTI ENTERPRISES
// Validation Utilities
// Backend - Request Validation
// ============================================================

const isRequired = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
};

// ============================================================
// EMAIL VALIDATION
// ============================================================

const isValidEmail = (email) => {
  if (!isRequired(email)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email).trim()
  );
};

// ============================================================
// PASSWORD VALIDATION
// ============================================================

const isValidPassword = (password) => {
  if (!isRequired(password)) {
    return false;
  }

  return String(password).length >= 6;
};

// ============================================================
// PHONE VALIDATION
// ============================================================

const isValidPhone = (phone) => {
  if (!isRequired(phone)) {
    return false;
  }

  return /^[0-9]{10}$/.test(
    String(phone).trim()
  );
};

// ============================================================
// NUMBER VALIDATION
// ============================================================

const isValidNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  return Number.isFinite(
    Number(value)
  );
};

// ============================================================
// POSITIVE NUMBER VALIDATION
// ============================================================

const isPositiveNumber = (value) => {
  return (
    isValidNumber(value) &&
    Number(value) > 0
  );
};

// ============================================================
// POSITIVE INTEGER VALIDATION
// ============================================================

const isPositiveInteger = (value) => {
  return (
    Number.isInteger(
      Number(value)
    ) &&
    Number(value) > 0
  );
};

// ============================================================
// OBJECT ID VALIDATION
// ============================================================

const isValidObjectId = (id) => {
  if (!isRequired(id)) {
    return false;
  }

  return /^[a-fA-F0-9]{24}$/.test(
    String(id)
  );
};

// ============================================================
// URL VALIDATION
// ============================================================

const isValidUrl = (url) => {
  if (!isRequired(url)) {
    return false;
  }

  try {
    new URL(String(url));
    return true;
  } catch (error) {
    return false;
  }
};

// ============================================================
// STRING LENGTH VALIDATION
// ============================================================

const isValidLength = (
  value,
  min,
  max
) => {
  if (!isRequired(value)) {
    return false;
  }

  const length =
    String(value).trim().length;

  return (
    length >= min &&
    length <= max
  );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  isRequired,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidNumber,
  isPositiveNumber,
  isPositiveInteger,
  isValidObjectId,
  isValidUrl,
  isValidLength,
};