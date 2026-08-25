// ============================================================
// SHANTI ENTERPRISES
// Customer Profile
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
  useAuth,
} from "../../context/AuthContext";

import {
  getMyProfile,
  updateMyProfile,
} from "../../api/profileApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// PROFILE PAGE
// ============================================================

function ProfilePage() {
  const {
    user,
  } = useAuth();

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
  });

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await getMyProfile();

        const profileData =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          response;

        setProfile(
          profileData
        );

        setForm({
          name:
            profileData?.name ||
            "",

          phone:
            profileData?.phone ||
            "",
        });
      } catch (err) {
        console.error(
          "Profile loading error:",
          err
        );

        if (user) {
          setProfile(user);

          setForm({
            name:
              user.name ||
              "",

            phone:
              user.phone ||
              "",
          });
        }

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setForm(
        (current) => ({
          ...current,
          [name]: value,
        })
      );

      setSuccess("");

      setError("");
    };

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      try {
        setSaving(true);

        setError("");

        setSuccess("");

        if (!form.name.trim()) {
          throw new Error(
            "Name is required."
          );
        }

        if (!form.phone.trim()) {
          throw new Error(
            "Phone number is required."
          );
        }

        const response =
          await updateMyProfile({
            name:
              form.name.trim(),

            phone:
              form.phone.trim(),
          });

        const updatedUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          response;

        if (
          updatedUser &&
          typeof updatedUser ===
            "object"
        ) {
          setProfile(
            updatedUser
          );

          setForm({
            name:
              updatedUser.name ||
              form.name,

            phone:
              updatedUser.phone ||
              form.phone,
          });
        }

        setSuccess(
          response?.message ||
            "Profile updated successfully."
        );
      } catch (err) {
        console.error(
          "Profile update error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading profile..."
      />
    );
  }

  // ==========================================================
  // USER INFORMATION
  // ==========================================================

  const profileName =
    profile?.name ||
    user?.name ||
    "Customer";

  const profileEmail =
    profile?.email ||
    user?.email ||
    "-";

  const profilePhone =
    profile?.phone ||
    user?.phone ||
    "-";

  const profileRole =
    profile?.role ||
    user?.role ||
    "customer";

  const initial =
    profileName
      .charAt(0)
      .toUpperCase();

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="profile-page">

      <div className="profile-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="profile-header">

          <div>

            <Link
              to="/dashboard"
              className="profile-back-link"
            >
              ← Dashboard
            </Link>

            <span className="profile-eyebrow">
              ACCOUNT SETTINGS
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal
              information and account
              details.
            </p>

          </div>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="profile-message-error">

            <ErrorMessage
              message={error}
              onRetry={loadProfile}
            />

          </div>
        )}

        {/* ==================================================
            SUCCESS
            ================================================== */}

        {success && (
          <div
            className="profile-success-message"
            role="status"
          >

            <span>
              ✓
            </span>

            <p>
              {success}
            </p>

          </div>
        )}

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="profile-layout">

          {/* ==================================================
              PROFILE CARD
              ================================================== */}

          <aside className="profile-account-card">

            <div className="profile-avatar">
              {initial}
            </div>

            <h2>
              {profileName}
            </h2>

            <p className="profile-account-email">
              {profileEmail}
            </p>

            <span className="profile-role-badge">
              {profileRole}
            </span>

            <div className="profile-account-divider" />

            <div className="profile-account-info">

              <div>

                <span>
                  EMAIL
                </span>

                <strong>
                  {profileEmail}
                </strong>

              </div>

              <div>

                <span>
                  PHONE
                </span>

                <strong>
                  {profilePhone}
                </strong>

              </div>

            </div>

            <Link
              to="/addresses"
              className="profile-address-link"
            >
              Manage Addresses
              <span>
                →
              </span>
            </Link>

          </aside>

          {/* ==================================================
              EDIT PROFILE
              ================================================== */}

          <div className="profile-edit-card">

            <div className="profile-card-header">

              <div>

                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Edit Profile
                </h2>

                <p>
                  Update your name and phone
                  number below.
                </p>

              </div>

            </div>

            <form
              className="profile-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* NAME */}

              <div className="profile-form-group">

                <label htmlFor="profile-name">
                  Full Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                />

              </div>

              {/* PHONE */}

              <div className="profile-form-group">

                <label htmlFor="profile-phone">
                  Phone Number
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter phone number"
                  autoComplete="tel"
                />

              </div>

              {/* EMAIL */}

              <div className="profile-form-group">

                <label htmlFor="profile-email">
                  Email Address
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={
                    profileEmail === "-"
                      ? ""
                      : profileEmail
                  }
                  disabled
                />

                <small>
                  Email cannot be changed
                  from this page.
                </small>

              </div>

              {/* ACTIONS */}

              <div className="profile-form-actions">

                <Link
                  to="/dashboard"
                  className="profile-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProfilePage;