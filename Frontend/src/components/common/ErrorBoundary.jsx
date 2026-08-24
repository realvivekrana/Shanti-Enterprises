// ============================================================
// SHANTI ENTERPRISES
// Error Boundary
// Frontend Phase 1 - Foundation
// ============================================================

import {
  Component,
} from "react";

// ============================================================
// ERROR BOUNDARY
// ============================================================

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  // ==========================================================
  // UPDATE ERROR STATE
  // ==========================================================

  static getDerivedStateFromError(
    error
  ) {
    return {
      hasError: true,
      error,
    };
  }

  // ==========================================================
  // LOG ERROR
  // ==========================================================

  componentDidCatch(
    error,
    errorInfo
  ) {
    console.error(
      "Shanti Enterprises Frontend Error:",
      error
    );

    console.error(
      "Component Error Information:",
      errorInfo
    );
  }

  // ==========================================================
  // RESET ERROR
  // ==========================================================

  handleReload = () => {
    window.location.reload();
  };

  // ==========================================================
  // FALLBACK UI
  // ==========================================================

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div>
            <h1>
              Something went wrong
            </h1>

            <p>
              We could not load this
              page correctly.
            </p>

            <button
              type="button"
              onClick={
                this.handleReload
              }
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;