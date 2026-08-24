// ============================================================
// SHANTI ENTERPRISES
// Error Message Component
// Frontend Phase 1 - Foundation
// ============================================================

function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div
      role="alert"
    >
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;