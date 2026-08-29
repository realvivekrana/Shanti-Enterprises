// ============================================================
// SHANTI ENTERPRISES
// Quotation API
// Frontend - Customer + Admin Wholesale Quotation
// ============================================================

import api from "./axios";

// ============================================================
// CUSTOMER QUOTATIONS
// ============================================================

// ------------------------------------------------------------
// GET CUSTOMER QUOTATIONS
// ------------------------------------------------------------

export const getMyQuotations = async (params = {}) => {
  const response = await api.get("/quotations", {
    params,
  });

  return response?.data;
};

// ------------------------------------------------------------
// GET CUSTOMER QUOTATION BY ID
// ------------------------------------------------------------

export const getQuotationById = async (quotationId) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.get(
    `/quotations/${quotationId}`
  );

  return response?.data;
};

// ------------------------------------------------------------
// ACCEPT CUSTOMER QUOTATION
// ------------------------------------------------------------

export const acceptQuotation = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.patch(
    `/quotations/${quotationId}/accept`
  );

  return response?.data;
};

// ------------------------------------------------------------
// REJECT CUSTOMER QUOTATION
// ------------------------------------------------------------

export const rejectQuotation = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.patch(
    `/quotations/${quotationId}/reject`
  );

  return response?.data;
};

// ============================================================
// ADMIN QUOTATIONS
// ============================================================

// ------------------------------------------------------------
// GET ALL ADMIN QUOTATIONS
// ------------------------------------------------------------

export const getAdminQuotations = async (
  params = {}
) => {
  const response = await api.get(
    "/quotations/admin",
    {
      params,
    }
  );

  return response?.data;
};

// ------------------------------------------------------------
// GET SINGLE ADMIN QUOTATION
// ------------------------------------------------------------

export const getAdminQuotationById = async (
  quotationId
) => {
  if (!quotationId) {
    throw new Error(
      "Quotation ID is required."
    );
  }

  const response = await api.get(
    `/quotations/admin/${quotationId}`
  );

  return response?.data;
};

// ------------------------------------------------------------
// CREATE ADMIN QUOTATION FROM RFQ
// ------------------------------------------------------------

export const createAdminQuotation = async (
  quotationData
) => {
  if (!quotationData) {
    throw new Error(
      "Quotation data is required."
    );
  }

  const response = await api.post(
    "/quotations/admin",
    quotationData
  );

  return response?.data;
};

// ------------------------------------------------------------
// UPDATE ADMIN QUOTATION STATUS
// ------------------------------------------------------------

export const updateAdminQuotationStatus =
  async (
    quotationId,
    status
  ) => {
    if (!quotationId) {
      throw new Error(
        "Quotation ID is required."
      );
    }

    if (!status) {
      throw new Error(
        "Quotation status is required."
      );
    }

    const response = await api.patch(
      `/quotations/admin/${quotationId}/status`,
      {
        status,
      }
    );

    return response?.data;
  };

// ------------------------------------------------------------
// CANCEL ADMIN QUOTATION
// ------------------------------------------------------------

export const cancelAdminQuotation =
  async (
    quotationId
  ) => {
    if (!quotationId) {
      throw new Error(
        "Quotation ID is required."
      );
    }

    const response = await api.patch(
      `/quotations/admin/${quotationId}/cancel`
    );

    return response?.data;
  };