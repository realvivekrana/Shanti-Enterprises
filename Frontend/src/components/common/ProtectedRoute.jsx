// ============================================================
// SHANTI ENTERPRISES
// Protected Route
// Frontend Phase 7 - Authentication & Navigation
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
  // AUTH CHECK
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Checking authentication..."
      />
    );
  }

  // ==========================================================
  // NOT AUTHENTICATED
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
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================================
  // ACCESS GRANTED
  // ==========================================================

  return <Outlet />;
}

export default ProtectedRoute;