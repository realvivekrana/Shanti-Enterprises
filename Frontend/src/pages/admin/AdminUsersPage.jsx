// ============================================================
// SHANTI ENTERPRISES
// Admin Users Page
// Frontend Phase 5 - User Management
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
  "blocked",
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
  // FILTER
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
    <section className="app-page">

      {/* HEADER */}

      <div>

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          User Management
        </h1>

        <p>
          Manage customers and
          administrators.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadUsers}
        />
      )}

      {/* SEARCH */}

      <div>

        <label htmlFor="userSearch">
          Search Users
        </label>

        <input
          id="userSearch"
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search name or email..."
        />

      </div>

      {/* ROLE FILTER */}

      <div>

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
                {role}
              </option>
            )
          )}

        </select>

      </div>

      {/* STATUS FILTER */}

      <div>

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
                {status}
              </option>
            )
          )}

        </select>

      </div>

      {/* REFRESH */}

      <div>

        <button
          type="button"
          onClick={
            loadUsers
          }
        >
          Refresh
        </button>

      </div>

      {/* COUNT */}

      <p>
        Showing{" "}
        {
          filteredUsers.length
        }{" "}
        of{" "}
        {users.length} users
      </p>

      {/* USERS */}

      {filteredUsers.length ===
      0 ? (
        <EmptyState
          title="No users found"
          message="No users match the current search or filters."
        />
      ) : (
        <div>

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

              const role =
                getRole(
                  user
                );

              const status =
                getStatus(
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
                >

                  <h2>
                    {name}
                  </h2>

                  <p>
                    Email:{" "}
                    {email}
                  </p>

                  <p>
                    Role:{" "}
                    {role}
                  </p>

                  <p>
                    Status:{" "}
                    {status}
                  </p>

                  {/* ROLE */}

                  <div>

                    <label
                      htmlFor={`role-${userId}`}
                    >
                      Change Role
                    </label>

                    <select
                      id={`role-${userId}`}
                      value={role}
                      disabled={
                        isUpdating ||
                        isDeleting
                      }
                      onChange={(
                        event
                      ) =>
                        handleRoleChange(
                          userId,
                          event.target
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
                            {
                              userRole
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* STATUS */}

                  <div>

                    <label
                      htmlFor={`status-${userId}`}
                    >
                      Change Status
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
                          event.target
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
                            {
                              userStatus
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* DELETE */}

                  <button
                    type="button"
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
                      : "Delete User"}
                  </button>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default AdminUsersPage;