// ============================================================
// SHANTI ENTERPRISES
// Admin Profile Page
// Premium UI/UX — Admin Account Management
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
import AccountsNav from "./AccountsNav";

import "./AdminProfilePage.css";

// ============================================================
// HELPERS
// ============================================================

const getInitials = (name) => {
  const trimmed = (name || "").trim();
  if (!trimmed) return "A";

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// ADMIN PROFILE PAGE
// ============================================================

function AdminProfilePage() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/auth/me");

      const user =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (!user) {
        throw new Error("Admin profile not found.");
      }

      setProfile(user);

      setForm({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || user.mobile || "",
      });
    } catch (err) {
      console.error("Admin profile error:", err);

      setError(
        err.response?.data?.message ||
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/profile", {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });

      const updatedUser =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (updatedUser) {
        setProfile(updatedUser);

        setForm({
          name: updatedUser.name || updatedUser.fullName || form.name,
          email: updatedUser.email || form.email,
          phone: updatedUser.phone || updatedUser.mobile || form.phone,
        });
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update admin profile error:", err);

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
    return <Loading message="Loading admin profile..." />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !profile) {
    return (
      <section className="admin-profile-page">
        <div className="admin-profile-container">
          <Link to="/admin" className="admin-profile-back">
            <span aria-hidden="true">←</span>
            Admin Dashboard
          </Link>

          <ErrorMessage message={error} onRetry={loadProfile} />
        </div>
      </section>
    );
  }

  const displayName = form.name || "Admin";
  const role = profile?.role || profile?.userRole || "admin";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-profile-page">
      <div className="admin-profile-container">
        <AccountsNav active="profile" />

        {/* HERO */}
        <header className="admin-profile-hero">
          <Link to="/admin" className="admin-profile-back">
            <span aria-hidden="true">←</span>
            Admin Dashboard
          </Link>

          <div className="admin-profile-hero-body">
            <div className="admin-profile-avatar">
              {getInitials(displayName)}
            </div>

            <div className="admin-profile-hero-text">
              <span className="admin-profile-eyebrow">
                ADMIN ACCOUNT
              </span>

              <h1>{displayName}</h1>

              <p>Manage your administrator account information.</p>

              <span className="admin-profile-role-pill">
                {role}
              </span>
            </div>
          </div>
        </header>

        {/* ALERTS */}
        {(error || success) && (
          <div className="admin-profile-alerts">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="status">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="admin-profile-grid">
          {/* ACCOUNT INFORMATION */}
          <div className="admin-profile-panel">
            <h2>Account Information</h2>

            <div className="admin-profile-info-list">
              <div className="admin-profile-info-row">
                <span>Role</span>
                <strong>{role}</strong>
              </div>

              <div className="admin-profile-info-row">
                <span>Email</span>
                <strong>{profile?.email || "N/A"}</strong>
              </div>

              <div className="admin-profile-info-row">
                <span>Member Since</span>
                <strong>{formatDate(profile?.createdAt)}</strong>
              </div>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="admin-profile-panel">
            <h2>Edit Profile</h2>

            <form className="admin-profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  disabled
                />
                <span className="form-help">
                  Email cannot be changed from this page.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="admin-profile-form-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <Link to="/admin" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProfilePage;