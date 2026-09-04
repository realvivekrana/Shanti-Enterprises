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

import "./ProfilePage.css";

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

        setProfile(profileData);

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
          err.response?.data?.message ||
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
    async (event) => {
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
          typeof updatedUser === "object"
        ) {
          setProfile(updatedUser);

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
          err.response?.data?.message ||
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
      <section className="profile-page profile-page-loading">
        <div className="profile-loading-shell">
          <div className="profile-loading-orb" />
          <div className="profile-loading-content">
            <span className="profile-loading-kicker">
              SHANTI ENTERPRISES
            </span>
            <h1>Loading your profile</h1>
            <p>
              Fetching your account information...
            </p>
          </div>
        </div>
      </section>
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
      <div className="profile-page-glow profile-page-glow-one" />
      <div className="profile-page-glow profile-page-glow-two" />

      <div className="profile-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="profile-header">
          <div className="profile-header-copy">
            <Link
              to="/dashboard"
              className="profile-back-link"
            >
              <span className="profile-back-icon">
                ←
              </span>
              Dashboard
            </Link>

            <div className="profile-eyebrow-row">
              <span className="profile-eyebrow-dot" />
              <span className="profile-eyebrow">
                ACCOUNT SETTINGS
              </span>
            </div>

            <h1>
              My Profile
              <span className="profile-title-accent">.</span>
            </h1>

            <p>
              Keep your personal information up to date
              for a smoother business ordering experience.
            </p>
          </div>

          <div className="profile-header-badge">
            <span className="profile-header-badge-icon">
              ✓
            </span>
            <div>
              <strong>Account active</strong>
              <span>Your profile is protected</span>
            </div>
          </div>
        </header>

        {/* ==================================================
            MESSAGES
            ================================================== */}

        {error && (
          <div className="profile-message-error">
            <ErrorMessage
              message={error}
              onRetry={loadProfile}
            />
          </div>
        )}

        {success && (
          <div
            className="profile-success-message"
            role="status"
            aria-live="polite"
          >
            <span className="profile-success-icon">
              ✓
            </span>

            <div>
              <strong>Profile updated</strong>
              <p>{success}</p>
            </div>
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
            <div className="profile-account-card-top">
              <span className="profile-card-label">
                ACCOUNT
              </span>

              <span className="profile-status-dot">
                <span />
                Active
              </span>
            </div>

            <div className="profile-avatar-wrap">
              <div className="profile-avatar-ring" />
              <div className="profile-avatar">
                {initial}
              </div>
              <span className="profile-avatar-check">
                ✓
              </span>
            </div>

            <h2>{profileName}</h2>

            <p className="profile-account-email">
              {profileEmail}
            </p>

            <span className="profile-role-badge">
              {String(profileRole).toUpperCase()}
            </span>

            <div className="profile-account-divider" />

            <div className="profile-account-info">
              <div className="profile-info-row">
                <span className="profile-info-icon profile-info-icon-email">
                  @
                </span>
                <div>
                  <span>EMAIL</span>
                  <strong>{profileEmail}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-icon profile-info-icon-phone">
                  #
                </span>
                <div>
                  <span>PHONE</span>
                  <strong>{profilePhone}</strong>
                </div>
              </div>
            </div>

            <Link
              to="/addresses"
              className="profile-address-link"
            >
              <span>
                Manage Addresses
              </span>
              <span className="profile-address-arrow">
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
                <div className="profile-card-header-kicker">
                  <span />
                  PERSONAL INFORMATION
                </div>

                <h2>
                  Edit Profile
                </h2>

                <p>
                  Update your contact details below.
                  Your email remains connected to your account.
                </p>
              </div>

              <div className="profile-edit-icon">
                ✦
              </div>
            </div>

            <div className="profile-form-divider" />

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="profile-form-group">
                <label htmlFor="profile-name">
                  <span>Full Name</span>
                  <small>Required</small>
                </label>

                <div className="profile-input-wrap">
                  <span className="profile-input-symbol">
                    A
                  </span>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="profile-form-group">
                <label htmlFor="profile-phone">
                  <span>Phone Number</span>
                  <small>Required</small>
                </label>

                <div className="profile-input-wrap">
                  <span className="profile-input-symbol">
                    #
                  </span>

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="profile-form-group">
                <label htmlFor="profile-email">
                  <span>Email Address</span>
                  <small>Account email</small>
                </label>

                <div className="profile-input-wrap profile-input-disabled">
                  <span className="profile-input-symbol">
                    @
                  </span>

                  <input
                    id="profile-email"
                    type="email"
                    value={
                      profileEmail === "-"
                        ? ""
                        : profileEmail
                    }
                    disabled
                    readOnly
                  />

                  <span className="profile-input-lock">
                    🔒
                  </span>
                </div>

                <small className="profile-field-hint">
                  Email cannot be changed from this page.
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
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="profile-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="profile-security-note">
              <span className="profile-security-icon">
                ✓
              </span>
              <div>
                <strong>Your information is secure</strong>
                <p>
                  Profile changes are saved securely to your
                  Shanti Enterprises account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER NAVIGATION
            ================================================== */}

        <nav className="profile-footer-nav" aria-label="Account navigation">
          <Link to="/orders">
            <span>Orders</span>
            <span>→</span>
          </Link>

          <Link to="/quotations">
            <span>Quotations</span>
            <span>→</span>
          </Link>

          <Link to="/rfqs">
            <span>RFQs</span>
            <span>→</span>
          </Link>

          <Link to="/addresses">
            <span>Addresses</span>
            <span>→</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default ProfilePage;
