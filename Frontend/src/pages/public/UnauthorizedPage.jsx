// ============================================================
// SHANTI ENTERPRISES
// Unauthorized Page
// Frontend Phase 1 - Foundation
// ============================================================

import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div>
      <h1>403</h1>

      <h2>Access Denied</h2>

      <p>
        You do not have permission to access this page.
      </p>

      <Link to="/">
        Go to Home
      </Link>
    </div>
  );
}

export default UnauthorizedPage;