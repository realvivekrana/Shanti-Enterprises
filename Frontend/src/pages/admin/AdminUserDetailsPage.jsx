// ============================================================
// SHANTI ENTERPRISES
// Admin User Details Page
// Frontend Phase 5 - User Management
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
];

// ============================================================
// ADMIN USER DETAILS
// ============================================================

function AdminUserDetailsPage() {
  const {
    userId,
  } = useParams();

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ==========================================================
  // LOAD USER
  // ==========================================================

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminUserById(
          userId
        );

      const userData =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response;

      if (!userData) {
        throw new Error(
          "User not found."
        );
      }

      setUser(
        userData
      );
    } catch (err) {
      console.error(
        "User details error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
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
    if (
      typeof user?.isActive ===
      "boolean"
    ) {
      return user.isActive
        ? "active"
        : "inactive";
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

  const handleRoleChange =
    async (
      newRole
    ) => {
      try {
        setUpdating(true);
        setError("");
        setSuccess("");

        await updateUserRole(
          userId,
          newRole
        );

        setUser(
          (current) => ({
            ...current,
            role:
              newRole,
          })
        );

        setSuccess(
          "User role updated successfully."
        );
      } catch (err) {
        console.error(
          "Update role error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
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

  const handleStatusChange =
    async (
      newStatus
    ) => {
      try {
        setUpdating(true);
        setError("");
        setSuccess("");

        await updateUserStatus(
          userId,
          newStatus
        );

        setUser(
          (current) => ({
            ...current,
            status:
              newStatus,
            isActive:
              newStatus ===
              "active",
          })
        );

        setSuccess(
          "User status updated successfully."
        );
      } catch (err) {
        console.error(
          "Update status error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
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
    return (
      <Loading
        message="Loading user details..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !user) {
    return (
      <section className="app-page">

        <Link to="/admin/users">
          ← User Management
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
      <section className="app-page">

        <Link to="/admin/users">
          ← User Management
        </Link>

        <h1>
          User Not Found
        </h1>

        <p>
          The requested user
          could not be found.
        </p>

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

  const email =
    user.email ||
    "N/A";

  const phone =
    user.phone ||
    user.mobile ||
    user.contactNumber ||
    "N/A";

  const role =
    getRole();

  const status =
    getStatus();

  const createdAt =
    user.createdAt ||
    user.created_at ||
    user.date;

  const formattedDate =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleString(
          "en-IN"
        )
      : "N/A";

  const address =
    user.address ||
    user.shippingAddress ||
    null;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin/users">
          ← User Management
        </Link>

        <h1>
          User Details
        </h1>

        <p>
          User ID:{" "}
          {userId}
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadUser}
        />
      )}

      {/* ====================================================
          SUCCESS
          ==================================================== */}

      {success && (
        <div>

          <strong>
            Success
          </strong>

          <p>
            {success}
          </p>

        </div>
      )}

      {/* ====================================================
          BASIC INFORMATION
          ==================================================== */}

      <div>

        <h2>
          Basic Information
        </h2>

        <p>
          Name:{" "}
          {name}
        </p>

        <p>
          Email:{" "}
          {email}
        </p>

        <p>
          Phone:{" "}
          {phone}
        </p>

        <p>
          User ID:{" "}
          {userId}
        </p>

        <p>
          Registered:{" "}
          {formattedDate}
        </p>

      </div>

      {/* ====================================================
          ROLE MANAGEMENT
          ==================================================== */}

      <div>

        <h2>
          Role Management
        </h2>

        <p>
          Current Role:{" "}
          {role}
        </p>

        <label htmlFor="userRole">
          Change Role
        </label>

        <select
          id="userRole"
          value={role}
          disabled={updating}
          onChange={(event) =>
            handleRoleChange(
              event.target.value
            )
          }
        >

          {USER_ROLES.map(
            (userRole) => (
              <option
                key={userRole}
                value={userRole}
              >
                {userRole}
              </option>
            )
          )}

        </select>

      </div>

      {/* ====================================================
          STATUS MANAGEMENT
          ==================================================== */}

      <div>

        <h2>
          Account Status
        </h2>

        <p>
          Current Status:{" "}
          {status}
        </p>

        <label htmlFor="userStatus">
          Change Status
        </label>

        <select
          id="userStatus"
          value={status}
          disabled={updating}
          onChange={(event) =>
            handleStatusChange(
              event.target.value
            )
          }
        >

          {USER_STATUSES.map(
            (userStatus) => (
              <option
                key={userStatus}
                value={userStatus}
              >
                {userStatus}
              </option>
            )
          )}

        </select>

      </div>

      {/* ====================================================
          ADDRESS
          ==================================================== */}

      <div>

        <h2>
          Address
        </h2>

        {address ? (
          <div>

            <p>
              {address.name ||
                address.fullName ||
                ""}
            </p>

            <p>
              {address.addressLine1 ||
                address.address ||
                address.street ||
                ""}
            </p>

            {address.addressLine2 && (
              <p>
                {
                  address.addressLine2
                }
              </p>
            )}

            <p>
              {address.city ||
                ""}

              {address.city &&
                address.state
                ? ", "
                : ""}

              {address.state ||
                ""}
            </p>

            <p>
              {address.pincode ||
                address.zipCode ||
                address.postalCode ||
                ""}
            </p>

            <p>
              {address.country ||
                "India"}
            </p>

          </div>
        ) : (
          <p>
            Address not available.
          </p>
        )}

      </div>

    </section>
  );
}

export default AdminUserDetailsPage;
