// ============================================================
// SHANTI ENTERPRISES
// Customer Profile
// Frontend Phase 4 - Customer
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

  const loadProfile = async () => {
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

      // --------------------------------------------
      // Fallback to logged-in user
      // --------------------------------------------

      if (user) {
        setProfile(user);

        setForm({
          name:
            user.name || "",
          phone:
            user.phone || "",
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

  const handleChange = (
    event
  ) => {
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

  const handleSubmit = async (
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
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      <div>

        <Link to="/dashboard">
          ← Dashboard
        </Link>

        <h1>
          My Profile
        </h1>

        <p>
          Manage your personal
          information.
        </p>

      </div>

      {/* ====================================================
          PROFILE INFORMATION
          ==================================================== */}

      <div>

        <h2>
          Account Information
        </h2>

        <p>
          Email:{" "}
          {profile?.email ||
            user?.email ||
            "-"}
        </p>

        <p>
          Role:{" "}
          {profile?.role ||
            user?.role ||
            "customer"}
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadProfile}
        />
      )}

      {/* ====================================================
          SUCCESS
          ==================================================== */}

      {success && (
        <div>
          <p>
            {success}
          </p>
        </div>
      )}

      {/* ====================================================
          EDIT PROFILE
          ==================================================== */}

      <div>

        <h2>
          Edit Profile
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div>

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              placeholder="Enter your name"
            />

          </div>

          <div>

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={
                form.phone
              }
              onChange={
                handleChange
              }
              placeholder="Enter phone number"
            />

          </div>

          <div>

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={
                profile?.email ||
                user?.email ||
                ""
              }
              disabled
            />

            <small>
              Email cannot be changed
              from this page.
            </small>

          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>

      </div>

    </section>
  );
}

export default ProfilePage;