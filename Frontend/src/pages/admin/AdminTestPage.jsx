// ============================================================
// SHANTI ENTERPRISES
// Admin Protected Test Page
// Frontend Phase 1 - Foundation
// ============================================================

import { useAuth } from "../../context/AuthContext";

function AdminTestPage() {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <div>
      <h1>
        Admin Protected Page
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

export default AdminTestPage;