// ============================================================
// SHANTI ENTERPRISES
// Confirm Modal Component
// Reusable confirmation dialog to replace window.confirm()
// ============================================================

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import "./ConfirmModal.css";

/**
 * ConfirmModal
 *
 * Props:
 *  - open        : boolean — whether the modal is visible
 *  - title       : string  — heading text (default "Are you sure?")
 *  - message     : string | node — body text / description
 *  - confirmText : string  — label for the confirm button (default "Confirm")
 *  - cancelText  : string  — label for the cancel button (default "Cancel")
 *  - variant     : "danger" | "primary" — controls confirm button + icon color
 *  - loading     : boolean — shows a busy state on the confirm button
 *  - onConfirm   : () => void
 *  - onCancel    : () => void
 */
function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
      if (e.key === "Enter" && !loading) onConfirm?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div
      className="confirm-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel?.();
      }}
    >
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <button
          type="button"
          className="confirm-modal-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className={`confirm-modal-icon confirm-modal-icon--${variant}`}>
          <AlertTriangle size={22} />
        </div>

        <h2 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h2>

        {message && <p className="confirm-modal-message">{message}</p>}

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;