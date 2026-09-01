// ============================================================
// SHANTI ENTERPRISES — ErrorMessage Component (Premium)
// ============================================================

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert-error" role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>⚠</span>
        <span>{message || "Something went wrong. Please try again."}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: 'transparent',
            border: '1px solid currentColor',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'inherit',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
