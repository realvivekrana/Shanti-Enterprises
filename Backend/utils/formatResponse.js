// ============================================================
// SHANTI ENTERPRISES
// Standard API Response Utility
// Backend - Response Formatting
// ============================================================

// ============================================================
// SUCCESS RESPONSE
// ============================================================

const successResponse = (
  res,
  data = null,
  message = "Request successful",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// ============================================================
// ERROR RESPONSE
// ============================================================

const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(
    response
  );
};

// ============================================================
// PAGINATED RESPONSE
// ============================================================

const paginatedResponse = (
  res,
  data,
  pagination,
  message = "Data fetched successfully",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};