// ============================================================
// SHANTI ENTERPRISES
// Admin Profile Page
// Frontend Phase 5 - Admin
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/axios";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// ADMIN PROFILE PAGE
// ============================================================

function AdminProfilePage() {
  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    phone: "",
  });

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

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/auth/me"
        );

      const user =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (!user) {
        throw new Error(
          "Admin profile not found."
        );
      }

      setProfile(user);

      setForm({
        name:
          user.name ||
          user.fullName ||
          "",
        email:
          user.email ||
          "",
        phone:
          user.phone ||
          user.mobile ||
          "",
      });
    } catch (err) {
      console.error(
        "Admin profile error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to load admin profile."
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
  // HANDLE CHANGE
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

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Name is required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await api.put(
          "/auth/profile",
          {
            name:
              form.name.trim(),
            phone:
              form.phone.trim(),
          }
        );

      const updatedUser =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (updatedUser) {
        setProfile(
          updatedUser
        );

        setForm({
          name:
            updatedUser.name ||
            updatedUser.fullName ||
            form.name,
          email:
            updatedUser.email ||
            form.email,
          phone:
            updatedUser.phone ||
            updatedUser.mobile ||
            form.phone,
        });
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update admin profile error:",
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
        message="Loading admin profile..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !profile) {
    return (
      <section className="app-page">

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <ErrorMessage
          message={error}
          onRetry={loadProfile}
        />

      </section>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          Admin Profile
        </h1>

        <p>
          Manage your administrator
          account information.
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

          <strong>
            Success
          </strong>

          <p>
            {success}
          </p>

        </div>
      )}

      {/* ====================================================
          PROFILE INFORMATION
          ==================================================== */}

      <div>

        <h2>
          Account Information
        </h2>

        <p>
          Role:{" "}
          {profile?.role ||
            profile?.userRole ||
            "admin"}
        </p>

        <p>
          Email:{" "}
          {profile?.email ||
            "N/A"}
        </p>

      </div>

      {/* ====================================================
          EDIT FORM
          ==================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* NAME */}

        <div>

          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            placeholder="Enter your name"
          />

        </div>

        {/* EMAIL */}

        <div>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={
              form.email
            }
            disabled
          />

          <small>
            Email cannot be changed
            from this page.
          </small>

        </div>

        {/* PHONE */}

        <div>

          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={
              form.phone
            }
            onChange={
              handleChange
            }
            placeholder="Enter phone number"
          />

        </div>

        {/* SUBMIT */}

        <div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <Link to="/admin">
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default AdminProfilePage;