// ============================================================
// SHANTI ENTERPRISES
// Loading Component
// Frontend Phase 1 - Foundation
// ============================================================

function Loading({
  message = "Loading...",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>
    </div>
  );
}

export default Loading;