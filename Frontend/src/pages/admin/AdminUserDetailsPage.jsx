// ============================================================
// SHANTI ENTERPRISES
// Admin User Details Page
// Premium Admin UI - User Management
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getAdminUserById,
  updateUserRole,
  updateUserStatus,
} from "../../api/adminUserApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import "./AdminUserDetailsPage.css";

// ============================================================
// OPTIONS
// ============================================================

const USER_ROLES = [
  "customer",
  "admin",
];

const USER_STATUSES = [
  "active",
  "inactive",
  "blocked",
];

// ============================================================
// HELPERS
// ============================================================

const getInitials = (name = "User") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

const formatLabel = (value = "") =>
  value
    .toString()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

// ============================================================
// ADMIN USER DETAILS
// ============================================================

function AdminUserDetailsPage() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD USER
  // ==========================================================

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUserById(userId);

      const userData =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response;

      if (!userData) {
        throw new Error("User not found.");
      }

      setUser(userData);
    } catch (err) {
      console.error("User details error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  // ==========================================================
  // GET ROLE
  // ==========================================================

  const getRole = () => {
    return (
      user?.role ||
      user?.userRole ||
      "customer"
    )
      .toString()
      .toLowerCase();
  };

  // ==========================================================
  // GET STATUS
  // ==========================================================

  const getStatus = () => {
    if (typeof user?.isActive === "boolean") {
      return user.isActive ? "active" : "inactive";
    }

    return (
      user?.status ||
      "active"
    )
      .toString()
      .toLowerCase();
  };

  // ==========================================================
  // UPDATE ROLE
  // ==========================================================

  const handleRoleChange = async (newRole) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await updateUserRole(userId, newRole);

      setUser((current) => ({
        ...current,
        role: newRole,
      }));

      setSuccess("User role updated successfully.");
    } catch (err) {
      console.error("Update role error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update user role."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await updateUserStatus(userId, newStatus);

      setUser((current) => ({
        ...current,
        status: newStatus,
        isActive: newStatus === "active",
      }));

      setSuccess("User status updated successfully.");
    } catch (err) {
      console.error("Update status error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update user status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <Loading message="Loading user details..." />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !user) {
    return (
      <section className="app-page admin-user-details-page">
        <Link
          to="/admin/users"
          className="admin-user-back-link"
        >
          <span>←</span>
          User Management
        </Link>

        <ErrorMessage
          message={error}
          onRetry={loadUser}
        />
      </section>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!user) {
    return (
      <section className="app-page admin-user-details-page">
        <Link
          to="/admin/users"
          className="admin-user-back-link"
        >
          <span>←</span>
          User Management
        </Link>

        <div className="admin-user-empty-card">
          <div className="admin-user-empty-icon">?</div>
          <h1>User Not Found</h1>
          <p>
            The requested user could not be found.
          </p>
        </div>
      </section>
    );
  }

  // ==========================================================
  // USER DATA
  // ==========================================================

  const name =
    user.name ||
    user.fullName ||
    user.username ||
    "User";

  const email = user.email || "N/A";

  const phone =
    user.phone ||
    user.mobile ||
    user.contactNumber ||
    "N/A";

  const role = getRole();
  const status = getStatus();

  const createdAt =
    user.createdAt ||
    user.created_at ||
    user.date;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-IN")
    : "N/A";

  const address =
    user.address ||
    user.shippingAddress ||
    null;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page admin-user-details-page">

      {/* HEADER */}

      <div className="admin-user-details-topbar">
        <Link
          to="/admin/users"
          className="admin-user-back-link"
        >
          <span>←</span>
          User Management
        </Link>

        <div className="admin-user-top-actions">
          <button
            type="button"
            className="admin-user-refresh-btn"
            onClick={loadUser}
            disabled={loading || updating}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <header className="admin-user-page-header">
        <div>
          <span className="admin-user-eyebrow">
            SHANTI ENTERPRISES · USER MANAGEMENT
          </span>

          <h1>User Details</h1>

          <p>
            Review account information and manage
            access permissions for this customer.
          </p>
        </div>

        <div className="admin-user-id-chip">
          <span>User ID</span>
          <strong>{userId}</strong>
        </div>
      </header>

      {/* ALERTS */}

      {error && (
        <div className="admin-user-alert admin-user-alert-error">
          <div className="admin-user-alert-icon">!</div>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="admin-user-alert admin-user-alert-success">
          <div className="admin-user-alert-icon">✓</div>
          <div>
            <strong>Update successful</strong>
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* PROFILE HERO */}

      <section className="admin-user-profile-card">
        <div className="admin-user-avatar">
          {getInitials(name)}
        </div>

        <div className="admin-user-profile-main">
          <div className="admin-user-name-row">
            <h2>{name}</h2>
            <span className={`admin-user-status-badge status-${status}`}>
              <span className="admin-user-status-dot" />
              {formatLabel(status)}
            </span>
          </div>

          <p className="admin-user-email">
            {email}
          </p>

          <div className="admin-user-profile-meta">
            <span>Role: {formatLabel(role)}</span>
            <span>Registered: {formattedDate}</span>
          </div>
        </div>

        <div className="admin-user-profile-side">
          <span>Account status</span>
          <strong>{formatLabel(status)}</strong>
        </div>
      </section>

      {/* CONTENT GRID */}

      <div className="admin-user-details-grid">

        {/* BASIC INFORMATION */}

        <section className="admin-user-panel admin-user-basic-panel">
          <div className="admin-user-panel-heading">
            <div className="admin-user-panel-icon">◈</div>
            <div>
              <h2>Basic Information</h2>
              <p>Registered account information</p>
            </div>
          </div>

          <div className="admin-user-info-grid">
            <div className="admin-user-info-item">
              <span>Full Name</span>
              <strong>{name}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Email Address</span>
              <strong>{email}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>Phone Number</span>
              <strong>{phone}</strong>
            </div>

            <div className="admin-user-info-item">
              <span>User ID</span>
              <strong className="admin-user-mono">
                {userId}
              </strong>
            </div>

            <div className="admin-user-info-item admin-user-info-wide">
              <span>Registered On</span>
              <strong>{formattedDate}</strong>
            </div>
          </div>
        </section>

        {/* ROLE MANAGEMENT */}

        <section className="admin-user-panel admin-user-control-panel">
          <div className="admin-user-panel-heading">
            <div className="admin-user-panel-icon role-icon">◆</div>
            <div>
              <h2>Role Management</h2>
              <p>Control administrator permissions</p>
            </div>
          </div>

          <div className="admin-user-current-state">
            <span>Current Role</span>
            <strong className={`role-${role}`}>
              {formatLabel(role)}
            </strong>
          </div>

          <label
            htmlFor="userRole"
            className="admin-user-field-label"
          >
            Change Role
          </label>

          <select
            id="userRole"
            className="admin-user-select"
            value={role}
            disabled={updating}
            onChange={(event) =>
              handleRoleChange(event.target.value)
            }
          >
            {USER_ROLES.map((userRole) => (
              <option
                key={userRole}
                value={userRole}
              >
                {formatLabel(userRole)}
              </option>
            ))}
          </select>

          <p className="admin-user-control-note">
            Admin accounts can access protected
            management areas.
          </p>
        </section>

        {/* STATUS MANAGEMENT */}

        <section className="admin-user-panel admin-user-control-panel">
          <div className="admin-user-panel-heading">
            <div className="admin-user-panel-icon status-icon">●</div>
            <div>
              <h2>Account Status</h2>
              <p>Manage customer account access</p>
            </div>
          </div>

          <div className="admin-user-current-state">
            <span>Current Status</span>
            <strong className={`status-text-${status}`}>
              {formatLabel(status)}
            </strong>
          </div>

          <label
            htmlFor="userStatus"
            className="admin-user-field-label"
          >
            Change Status
          </label>

          <select
            id="userStatus"
            className="admin-user-select"
            value={status}
            disabled={updating}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
          >
            {USER_STATUSES.map((userStatus) => (
              <option
                key={userStatus}
                value={userStatus}
              >
                {formatLabel(userStatus)}
              </option>
            ))}
          </select>

          <p className="admin-user-control-note">
            Inactive or blocked accounts may lose
            access depending on backend rules.
          </p>
        </section>

        {/* ADDRESS */}

        <section className="admin-user-panel admin-user-address-panel">
          <div className="admin-user-panel-heading">
            <div className="admin-user-panel-icon address-icon">⌖</div>
            <div>
              <h2>Address</h2>
              <p>Saved customer address information</p>
            </div>
          </div>

          {address ? (
            <div className="admin-user-address-card">
              <div className="admin-user-address-title">
                <span className="admin-user-address-pin">⌖</span>
                <strong>
                  {address.name ||
                    address.fullName ||
                    "Customer Address"}
                </strong>
              </div>

              <p>
                {address.addressLine1 ||
                  address.address ||
                  address.street ||
                  ""}
              </p>

              {address.addressLine2 && (
                <p>{address.addressLine2}</p>
              )}

              <p>
                {address.city || ""}
                {address.city && address.state
                  ? ", "
                  : ""}
                {address.state || ""}
              </p>

              <p>
                {address.pincode ||
                  address.zipCode ||
                  address.postalCode ||
                  ""}
              </p>

              <p>
                {address.country || "India"}
              </p>
            </div>
          ) : (
            <div className="admin-user-no-address">
              <div>⌂</div>
              <strong>Address not available</strong>
              <p>
                No saved address information is
                available for this user.
              </p>
            </div>
          )}
        </section>

      </div>

      {/* FOOTER ACTIONS */}

      <div className="admin-user-footer-actions">
        <Link
          to="/admin/users"
          className="admin-user-secondary-btn"
        >
          ← Back to Users
        </Link>

        <button
          type="button"
          className="admin-user-primary-btn"
          onClick={loadUser}
          disabled={loading || updating}
        >
          ↻ Reload User
        </button>
      </div>

    </section>
  );
}

export default AdminUserDetailsPage;
