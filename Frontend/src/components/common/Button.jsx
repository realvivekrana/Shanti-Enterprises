// ============================================================
// SHANTI ENTERPRISES
// Button Component
// Frontend Phase 1 - Foundation
// ============================================================

function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;