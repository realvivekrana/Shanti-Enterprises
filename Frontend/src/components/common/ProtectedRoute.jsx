// ============================================================
// SHANTI ENTERPRISES
// Protected Route
// Frontend Phase 1 - Foundation
// ============================================================

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import Loading from "./Loading";

// ============================================================
// PROTECTED ROUTE
// ============================================================

function ProtectedRoute({
  allowedRoles = [],
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location =
    useLocation();

  // ==========================================================
  // AUTH CHECK LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Checking authentication..."
      />
    );
  }

  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================================
  // ROLE CHECK
  // ==========================================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // ==========================================================
  // ACCESS GRANTED
  // ==========================================================

  return <Outlet />;
}

export default ProtectedRoute;