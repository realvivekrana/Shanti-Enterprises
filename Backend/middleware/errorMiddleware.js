// ============================================================
// SHANTI ENTERPRISES
// Centralized Error Handling Middleware
// Phase 1 - Foundation
// ============================================================

const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("");
  console.error("================================================");
  console.error("              API ERROR");
  console.error("================================================");
  console.error(`Method  : ${req.method}`);
  console.error(`Route   : ${req.originalUrl}`);
  console.error(`Message : ${err.message}`);

  if (err.details) {
    console.error("Details :", err.details);
  }

  console.error("================================================");
  console.error("");

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,
  };

  if (err.details) {
    response.errors = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};