// ============================================================
// SHANTI ENTERPRISES
// Date Utilities
// Backend - Date / Time Helpers
// ============================================================

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (
  date,
  locale = "en-IN"
) => {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ============================================================
// FORMAT DATE AND TIME
// ============================================================

const formatDateTime = (
  date,
  locale = "en-IN"
) => {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate.toLocaleString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ============================================================
// GET START OF DAY
// ============================================================

const startOfDay = (date = new Date()) => {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
};

// ============================================================
// GET END OF DAY
// ============================================================

const endOfDay = (date = new Date()) => {
  const result =
    new Date(date);

  result.setHours(
    23,
    59,
    59,
    999
  );

  return result;
};

// ============================================================
// ADD DAYS
// ============================================================

const addDays = (
  date,
  days
) => {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      Number(days)
  );

  return result;
};

// ============================================================
// ADD MONTHS
// ============================================================

const addMonths = (
  date,
  months
) => {
  const result =
    new Date(date);

  result.setMonth(
    result.getMonth() +
      Number(months)
  );

  return result;
};

// ============================================================
// CHECK VALID DATE
// ============================================================

const isValidDate = (date) => {
  if (!date) {
    return false;
  }

  return !Number.isNaN(
    new Date(date).getTime()
  );
};

// ============================================================
// CHECK DATE EXPIRED
// ============================================================

const isExpired = (date) => {
  if (!isValidDate(date)) {
    return false;
  }

  return (
    new Date(date).getTime() <
    Date.now()
  );
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  formatDate,
  formatDateTime,
  startOfDay,
  endOfDay,
  addDays,
  addMonths,
  isValidDate,
  isExpired,
};