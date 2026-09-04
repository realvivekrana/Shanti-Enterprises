// ============================================================
// SHANTI ENTERPRISES
// Admin Inventory Page
// Frontend - Admin Inventory Management
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getInventory,
  updateInventoryStock,
  adjustInventoryStock,
  updateLowStockThreshold,
} from "../../api/inventoryApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import "./AdminInventoryPage.css";

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============================================================
// ADMIN INVENTORY PAGE
// ============================================================

function AdminInventoryPage() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalMode, setModalMode]   = useState("set"); // "set" | "adjust" | "threshold"
  const [inputValue, setInputValue] = useState("");
  const [adjustType, setAdjustType] = useState("add");
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ==========================================================
  // LOAD INVENTORY
  // ==========================================================

  const loadInventory = async (
    requestedPage = 1,
    searchTerm = search,
    lowStock = lowStockOnly
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: requestedPage,
        limit: 20,
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (lowStock) params.lowStock = "true";

      const response = await getInventory(params);
      setProducts(response?.products || []);
      setTotalPages(response?.pagination?.totalPages || 1);
      setTotalProducts(response?.pagination?.totalProducts || 0);
      setPage(requestedPage);
    } catch (err) {
      setError(err.message || "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory(1, search, lowStockOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowStockOnly]);

  // search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadInventory(1, search, lowStockOnly);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ==========================================================
  // OPEN MODAL
  // ==========================================================

  const openModal = (product, mode) => {
    setEditingProduct(product);
    setModalMode(mode);
    setInputValue(
      mode === "threshold"
        ? String(product?.lowStockThreshold ?? 10)
        : mode === "set"
        ? String(product?.stock ?? 0)
        : ""
    );
    setAdjustType("add");
    setSaveError("");
    setSuccessMsg("");
  };

  const closeModal = () => {
    setEditingProduct(null);
    setInputValue("");
    setSaveError("");
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = async () => {
    const productId = editingProduct?._id || editingProduct?.id;
    const numVal = Number(inputValue);

    if (inputValue === "" || Number.isNaN(numVal) || numVal < 0) {
      setSaveError("Please enter a valid number.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      let response;

      if (modalMode === "set") {
        response = await updateInventoryStock(productId, numVal);
      } else if (modalMode === "adjust") {
        if (numVal <= 0) {
          setSaveError("Quantity must be greater than 0.");
          return;
        }
        response = await adjustInventoryStock(productId, numVal, adjustType);
      } else {
        response = await updateLowStockThreshold(productId, numVal);
      }

      const updatedInv = response?.inventory;

      setProducts((prev) =>
        prev.map((p) => {
          if ((p._id || p.id) !== productId) return p;
          return {
            ...p,
            stock: updatedInv?.currentStock ?? updatedInv?.stock ?? p.stock,
            lowStockThreshold:
              updatedInv?.lowStockThreshold ?? p.lowStockThreshold,
          };
        })
      );

      setSuccessMsg(
        modalMode === "set"
          ? "Stock updated successfully."
          : modalMode === "adjust"
          ? "Stock adjusted successfully."
          : "Threshold updated successfully."
      );
      closeModal();
    } catch (err) {
      setSaveError(err.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && products.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <Loading message="Loading inventory..." />
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="app-page">
        <div className="page-container">
          <ErrorMessage message={error} onRetry={() => loadInventory(1)} />
        </div>
      </section>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="app-page admin-inventory-page">
      <div className="page-container admin-inventory-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>
            <h1>Inventory</h1>
            <p>{totalProducts} products · manage stock levels</p>
          </div>
          <Link to="/admin/products" className="btn-secondary">
            ← Products
          </Link>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="alert-success" role="status" style={{ marginBottom: "16px" }}>
            {successMsg}
            <button
              type="button"
              onClick={() => setSuccessMsg("")}
              style={{ marginLeft: "12px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* TOOLBAR */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <input
            type="search"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "220px",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />

          <button
            type="button"
            className={lowStockOnly ? "btn-primary" : "btn-secondary"}
            onClick={() => setLowStockOnly((prev) => !prev)}
          >
            {lowStockOnly ? "⚠ Low Stock Only" : "Show Low Stock"}
          </button>
        </div>

        {/* EMPTY */}
        {products.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <h2>No products found</h2>
            <p>
              {lowStockOnly
                ? "No low-stock products at the moment."
                : "Try a different search term."}
            </p>
          </div>
        )}

        {/* TABLE */}
        {products.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                  {["Product", "SKU", "Stock", "Threshold", "Status", "Price", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#6b7280",
                          letterSpacing: "0.06em",
                          borderBottom: "1px solid #e5e7eb",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const pId = product?._id || product?.id;
                  const threshold = product?.lowStockThreshold ?? 10;
                  const stock = product?.stock ?? 0;
                  const isLow = stock <= threshold;

                  return (
                    <tr
                      key={pId}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: isLow ? "#fffbeb" : "#fff",
                      }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #e5e7eb",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                background: "#f3f4f6",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                              }}
                            >
                              📦
                            </div>
                          )}
                          <span style={{ fontWeight: 600 }}>{product?.name || "—"}</span>
                        </div>
                      </td>

                      <td style={{ padding: "12px 16px", color: "#6b7280", fontFamily: "monospace" }}>
                        {product?.sku || "—"}
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "16px",
                            color: isLow ? "#dc2626" : "#111827",
                          }}
                        >
                          {stock}
                        </span>
                        <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "4px" }}>
                          {product?.unit || ""}
                        </span>
                      </td>

                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{threshold}</td>

                      <td style={{ padding: "12px 16px" }}>
                        {isLow ? (
                          <span
                            style={{
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "999px",
                              padding: "3px 10px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            ⚠ Low
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "#f0fdf4",
                              color: "#15803d",
                              border: "1px solid #bbf7d0",
                              borderRadius: "999px",
                              padding: "3px 10px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            OK
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                        {formatCurrency(product?.price)}
                      </td>

                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            onClick={() => openModal(product, "set")}
                          >
                            Set
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            onClick={() => openModal(product, "adjust")}
                          >
                            ± Adjust
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            onClick={() => openModal(product, "threshold")}
                          >
                            Threshold
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
            <button type="button" className="btn-secondary" disabled={page <= 1 || loading} onClick={() => loadInventory(page - 1)}>
              ← Previous
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>
            <button type="button" className="btn-secondary" disabled={page >= totalPages || loading} onClick={() => loadInventory(page + 1)}>
              Next →
            </button>
          </div>
        )}

      </div>

      {/* ==============================================================
          MODAL
          ============================================================== */}
      {editingProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700 }}>
              {modalMode === "set"
                ? "Set Stock"
                : modalMode === "adjust"
                ? "Adjust Stock"
                : "Update Threshold"}
            </h2>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#6b7280" }}>
              {editingProduct?.name}
            </p>

            {modalMode === "adjust" && (
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className={adjustType === "add" ? "btn-primary" : "btn-secondary"}
                  style={{ flex: 1 }}
                  onClick={() => setAdjustType("add")}
                >
                  + Add
                </button>
                <button
                  type="button"
                  className={adjustType === "remove" ? "btn-danger" : "btn-secondary"}
                  style={{ flex: 1 }}
                  onClick={() => setAdjustType("remove")}
                >
                  − Remove
                </button>
              </div>
            )}

            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              {modalMode === "set"
                ? "New Stock Value"
                : modalMode === "adjust"
                ? "Quantity"
                : "Low Stock Threshold"}
            </label>

            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                marginTop: "6px",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") closeModal();
              }}
            />

            {saveError && (
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#dc2626" }}>
                {saveError}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default AdminInventoryPage;
