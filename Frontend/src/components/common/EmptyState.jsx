// ============================================================
// SHANTI ENTERPRISES
// Empty State Component
// Frontend Phase 1 - Foundation
// ============================================================

function EmptyState({
  title = "No data found",
  message = "There is nothing to display.",
}) {
  return (
    <div>
      <h2>{title}</h2>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;