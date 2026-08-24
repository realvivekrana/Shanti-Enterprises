// ============================================================
// SHANTI ENTERPRISES
// Customer Protected Test Page
// Frontend Phase 1 - Foundation
// ============================================================

import { useAuth } from "../../context/AuthContext";

function CustomerTestPage() {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <div>
      <h1>
        Customer Protected Page
      </h1>

      <p>
        Welcome, {user?.name}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default CustomerTestPage;