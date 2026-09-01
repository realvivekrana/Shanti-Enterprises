// ============================================================
// SHANTI ENTERPRISES — EmptyState Component (Premium)
// ============================================================

function EmptyState({ title = "Nothing here", message = "", icon = "📭", action, actionLabel }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '52px', marginBottom: '16px', lineHeight: 1 }}>{icon}</div>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          className="btn-primary"
          style={{ marginTop: '20px', display: 'inline-flex' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
