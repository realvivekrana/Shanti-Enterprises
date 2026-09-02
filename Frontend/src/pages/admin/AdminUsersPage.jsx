// ============================================================
// SHANTI ENTERPRISES
// Admin Users Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  deleteAdminUser,
} from "../../api/adminUserApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// USER ROLES
// ============================================================

const USER_ROLES = [
  "customer",
  "admin",
];

// ============================================================
// USER STATUSES
// ============================================================

const USER_STATUSES = [
  "active",
  "inactive",
];

// ============================================================
// ADMIN USERS PAGE
// ============================================================

function AdminUsersPage() {
  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  // ==========================================================
  // LOAD USERS
  // ==========================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminUsers({
          limit: 100,
        });

      let userData = [];

      if (
        Array.isArray(response)
      ) {
        userData =
          response;
      } else if (
        Array.isArray(
          response?.users
        )
      ) {
        userData =
          response.users;
      } else if (
        Array.isArray(
          response?.data
        )
      ) {
        userData =
          response.data;
      } else if (
        Array.isArray(
          response?.data?.users
        )
      ) {
        userData =
          response.data.users;
      }

      setUsers(
        userData
      );
    } catch (err) {
      console.error(
        "Admin users error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
        err.message ||
        "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================================
  // USER ID
  // ==========================================================

  const getUserId = (
    user
  ) => {
    return (
      user._id ||
      user.id ||
      user.userId
    );
  };

  // ==========================================================
  // ROLE
  // ==========================================================

  const getRole = (
    user
  ) => {
    return (
      user.role ||
      user.userRole ||
      "customer"
    )
      .toString()
      .toLowerCase();
  };

  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatus = (
    user
  ) => {
    if (
      typeof user.isActive ===
      "boolean"
    ) {
      return user.isActive
        ? "active"
        : "inactive";
    }

    return (
      user.status ||
      "active"
    )
      .toString()
      .toLowerCase();
  };

  // ==========================================================
  // NAME
  // ==========================================================

  const getName = (
    user
  ) => {
    return (
      user.name ||
      user.fullName ||
      user.username ||
      "User"
    );
  };

  // ==========================================================
  // PHONE
  // ==========================================================

  const getPhone = (
    user
  ) => {
    return (
      user.phone ||
      user.mobile ||
      user.phoneNumber ||
      "Not available"
    );
  };

  // ==========================================================
  // DATE
  // ==========================================================

  const getDate = (
    user
  ) => {
    const value =
      user.createdAt ||
      user.created_at ||
      user.date;

    if (!value) {
      return "N/A";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "N/A";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // ROLE LABEL
  // ==========================================================

  const getRoleLabel = (
    role
  ) => {
    return (
      role
        .charAt(0)
        .toUpperCase() +
      role.slice(1)
    );
  };

  // ==========================================================
  // STATUS LABEL
  // ==========================================================

  const getStatusLabel = (
    status
  ) => {
    return (
      status
        .charAt(0)
        .toUpperCase() +
      status.slice(1)
    );
  };

  // ==========================================================
  // FILTER USERS
  // ==========================================================

  const filteredUsers =
    users.filter(
      (user) => {
        const name =
          getName(
            user
          );

        const email =
          user.email ||
          "";

        const searchText =
          search
            .trim()
            .toLowerCase();

        const searchMatch =
          !searchText ||
          name
            .toLowerCase()
            .includes(
              searchText
            ) ||
          email
            .toLowerCase()
            .includes(
              searchText
            );

        const role =
          getRole(
            user
          );

        const status =
          getStatus(
            user
          );

        const roleMatch =
          roleFilter ===
            "all" ||
          role ===
            roleFilter;

        const statusMatch =
          statusFilter ===
            "all" ||
          status ===
            statusFilter;

        return (
          searchMatch &&
          roleMatch &&
          statusMatch
        );
      }
    );

  // ==========================================================
  // UPDATE ROLE
  // ==========================================================

  const handleRoleChange =
    async (
      userId,
      role
    ) => {
      try {
        setUpdatingId(
          userId
        );

        setError("");

        await updateUserRole(
          userId,
          role
        );

        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (user) => {
                if (
                  getUserId(
                    user
                  ) !== userId
                ) {
                  return user;
                }

                return {
                  ...user,
                  role,
                };
              }
            )
        );
      } catch (err) {
        console.error(
          "Update user role error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to update user role."
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange =
    async (
      userId,
      status
    ) => {
      try {
        setUpdatingId(
          userId
        );

        setError("");

        await updateUserStatus(
          userId,
          status
        );

        setUsers(
          (currentUsers) =>
            currentUsers.map(
              (user) => {
                if (
                  getUserId(
                    user
                  ) !== userId
                ) {
                  return user;
                }

                return {
                  ...user,
                  status,
                  isActive:
                    status ===
                    "active",
                };
              }
            )
        );
      } catch (err) {
        console.error(
          "Update user status error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to update user status."
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  // ==========================================================
  // DELETE USER
  // ==========================================================

  const handleDelete =
    async (
      userId
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this user?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          userId
        );

        setError("");

        await deleteAdminUser(
          userId
        );

        setUsers(
          (currentUsers) =>
            currentUsers.filter(
              (user) =>
                getUserId(
                  user
                ) !== userId
            )
        );
      } catch (err) {
        console.error(
          "Delete user error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to delete user."
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalUsers =
    users.length;

  const adminCount =
    users.filter(
      (user) =>
        getRole(user) ===
        "admin"
    ).length;

  const customerCount =
    users.filter(
      (user) =>
        getRole(user) ===
        "customer"
    ).length;

  const activeCount =
    users.filter(
      (user) =>
        getStatus(user) ===
        "active"
    ).length;

  const blockedCount =
    users.filter(
      (user) =>
        getStatus(user) ===
        "blocked"
    ).length;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading users..."
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-users-page">

      <div className="admin-users-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-users-header">

          <div>

            <Link
              to="/admin"
              className="admin-users-back"
            >
              ← Admin Dashboard
            </Link>

            <span className="admin-users-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>
              Users
            </h1>

            <p>
              Manage customers and
              administrators.
            </p>

          </div>

          <button
            type="button"
            className="admin-users-refresh"
            onClick={
              loadUsers
            }
          >
            ↻ Refresh
          </button>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-users-error">

            <ErrorMessage
              message={error}
              onRetry={
                loadUsers
              }
            />

          </div>
        )}

        {/* ==================================================
            STATS
            ================================================== */}

        <div className="admin-users-stats">

          <div className="admin-user-stat-card">

            <span>
              TOTAL USERS
            </span>

            <strong>
              {totalUsers}
            </strong>

          </div>

          <div className="admin-user-stat-card">

            <span>
              CUSTOMERS
            </span>

            <strong>
              {customerCount}
            </strong>

          </div>

          <div className="admin-user-stat-card">

            <span>
              ADMINS
            </span>

            <strong>
              {adminCount}
            </strong>

          </div>

          <div className="admin-user-stat-card">

            <span>
              ACTIVE
            </span>

            <strong>
              {activeCount}
            </strong>

          </div>

          <div className="admin-user-stat-card">

            <span>
              BLOCKED
            </span>

            <strong>
              {blockedCount}
            </strong>

          </div>

        </div>

        {/* ==================================================
            FILTERS
            ================================================== */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <label htmlFor="userSearch">
              Search Users
            </label>

            <div className="admin-users-search-box">

              <span>
                ⌕
              </span>

              <input
                id="userSearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name or email..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

          </div>

          <div className="admin-users-filter">

            <label htmlFor="roleFilter">
              Role
            </label>

            <select
              id="roleFilter"
              value={
                roleFilter
              }
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Roles
              </option>

              {USER_ROLES.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {getRoleLabel(
                      role
                    )}
                  </option>
                )
              )}

            </select>

          </div>

          <div className="admin-users-filter">

            <label htmlFor="statusFilter">
              Status
            </label>

            <select
              id="statusFilter"
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Status
              </option>

              {USER_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {getStatusLabel(
                      status
                    )}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* ==================================================
            COUNT
            ================================================== */}

        <div className="admin-users-result-count">

          <strong>
            {filteredUsers.length}
          </strong>

          <span>
            users shown
          </span>

          <span className="admin-users-total-count">
            Total: {users.length}
          </span>

        </div>

        {/* ==================================================
            USERS
            ================================================== */}

        {filteredUsers.length ===
        0 ? (
          <div className="admin-users-empty">

            <EmptyState
              title="No users found"
              message="No users match the current search or filters."
            />

          </div>
        ) : (
          <div className="admin-users-list">

            {filteredUsers.map(
              (user) => {

                const userId =
                  getUserId(
                    user
                  );

                const name =
                  getName(
                    user
                  );

                const email =
                  user.email ||
                  "N/A";

                const phone =
                  getPhone(
                    user
                  );

                const role =
                  getRole(
                    user
                  );

                const status =
                  getStatus(
                    user
                  );

                const createdDate =
                  getDate(
                    user
                  );

                const isUpdating =
                  updatingId ===
                  userId;

                const isDeleting =
                  deletingId ===
                  userId;

                return (
                  <article
                    key={
                      userId
                    }
                    className="admin-user-card"
                  >

                    {/* ==================================================
                        USER INFO
                        ================================================== */}

                    <div className="admin-user-main">

                      <div className="admin-user-avatar">
                        {name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="admin-user-info">

                        <div className="admin-user-name-row">

                          <h2>
                            {name}
                          </h2>

                          <span
                            className={`admin-user-role-badge ${role}`}
                          >
                            {getRoleLabel(
                              role
                            )}
                          </span>

                        </div>

                        <p>
                          {email}
                        </p>

                        <div className="admin-user-meta">

                          <span>
                            Phone: {phone}
                          </span>

                          <span>
                            Joined:{" "}
                            {createdDate}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* ==================================================
                        STATUS
                        ================================================== */}

                    <div className="admin-user-current-status">

                      <span>
                        STATUS
                      </span>

                      <strong
                        className={`admin-user-status-badge ${status}`}
                      >
                        <i />
                        {getStatusLabel(
                          status
                        )}
                      </strong>

                    </div>

                    {/* ==================================================
                        ROLE
                        ================================================== */}

                    <div className="admin-user-control">

                      <label
                        htmlFor={`role-${userId}`}
                      >
                        Role
                      </label>

                      <select
                        id={`role-${userId}`}
                        value={
                          role
                        }
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onChange={(
                          event
                        ) =>
                          handleRoleChange(
                            userId,
                            event
                              .target
                              .value
                          )
                        }
                      >

                        {USER_ROLES.map(
                          (
                            userRole
                          ) => (
                            <option
                              key={
                                userRole
                              }
                              value={
                                userRole
                              }
                            >
                              {getRoleLabel(
                                userRole
                              )}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    {/* ==================================================
                        STATUS CONTROL
                        ================================================== */}

                    <div className="admin-user-control">

                      <label
                        htmlFor={`status-${userId}`}
                      >
                        Status
                      </label>

                      <select
                        id={`status-${userId}`}
                        value={
                          status
                        }
                        disabled={
                          isUpdating ||
                          isDeleting
                        }
                        onChange={(
                          event
                        ) =>
                          handleStatusChange(
                            userId,
                            event
                              .target
                              .value
                          )
                        }
                      >

                        {USER_STATUSES.map(
                          (
                            userStatus
                          ) => (
                            <option
                              key={
                                userStatus
                              }
                              value={
                                userStatus
                              }
                            >
                              {getStatusLabel(
                                userStatus
                              )}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    {/* ==================================================
                        DELETE
                        ================================================== */}

                    <button
                      type="button"
                      className="admin-user-delete"
                      disabled={
                        isUpdating ||
                        isDeleting
                      }
                      onClick={() =>
                        handleDelete(
                          userId
                        )
                      }
                    >
                      {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                    {/* ==================================================
                        VIEW DETAILS
                        ================================================== */}

                    <Link
                      to={`/admin/users/${userId}`}
                      className="admin-user-view-link"
                    >
                      View Details →
                    </Link>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminUsersPage;
