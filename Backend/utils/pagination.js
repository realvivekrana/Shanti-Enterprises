// ============================================================
// SHANTI ENTERPRISES
// Pagination Utility
// Backend - API Pagination
// ============================================================

// ============================================================
// GET PAGINATION VALUES
// ============================================================

const getPagination = (
  page = 1,
  limit = 10
) => {
  let currentPage = Number(page);
  let currentLimit = Number(limit);

  if (
    !Number.isFinite(currentPage) ||
    currentPage < 1
  ) {
    currentPage = 1;
  }

  if (
    !Number.isFinite(currentLimit) ||
    currentLimit < 1
  ) {
    currentLimit = 10;
  }

  // Prevent excessively large requests
  currentLimit = Math.min(
    currentLimit,
    100
  );

  const skip =
    (currentPage - 1) *
    currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
  };
};

// ============================================================
// CREATE PAGINATION RESPONSE
// ============================================================

const createPagination = (
  page,
  limit,
  total
) => {
  const totalItems =
    Number(total) || 0;

  const totalPages =
    Math.ceil(
      totalItems / limit
    );

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage:
      page < totalPages,
    hasPreviousPage:
      page > 1,
  };
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getPagination,
  createPagination,
};