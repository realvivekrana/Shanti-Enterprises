// ============================================================
// SHANTI ENTERPRISES — AdminUserDetailsPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link, useParams }     from "react-router-dom";
import {
  getAdminUserById,
  updateUserRole,
  updateUserStatus,
} from "../../api/adminUserApi";
import Loading      from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const USER_ROLES    = ["customer", "admin"];
const USER_STATUSES = ["active", "inactive"];

const fmtDate = (v) => {
  if (!v) return "N/A";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "N/A"
    : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// ── info row ─────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid var(--se-border-soft)", gap: 20 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text)", textAlign: "right", wordBreak: "break-all" }}>{value || "—"}</span>
    </div>
  );
}

// ── control select ───────────────────────────────────────────
function ControlSelect({ label, id, value, options, disabled, onChange }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 700, color: "var(--se-text-3)", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 8 }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{ height: 44, fontSize: 14, fontWeight: 600 }}
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function AdminUserDetailsPage() {
  const { userId } = useParams();

  const [user,     setUser]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  // load
  const loadUser = async () => {
    try {
      setLoading(true); setError("");
      const r = await getAdminUserById(userId);
      const u = r?.user || r?.data?.user || r?.data || r;
      if (!u) throw new Error("User not found.");
      setUser(u);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userId) loadUser(); }, [userId]);

  // derived
  const getRole   = () => String(user?.role   || "customer").toLowerCase();
  const getStatus = () => typeof user?.isActive === "boolean" ? (user.isActive ? "active" : "inactive") : String(user?.status || "active").toLowerCase();

  // update role
  const handleRoleChange = async (newRole) => {
    try {
      setUpdating(true); setError(""); setSuccess("");
      await updateUserRole(userId, newRole);
      setUser(u => ({ ...u, role: newRole }));
      setSuccess("Role updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to update role.");
    } finally {
      setUpdating(false);
    }
  };

  // update status
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true); setError(""); setSuccess("");
      await updateUserStatus(userId, newStatus);
      setUser(u => ({ ...u, status: newStatus, isActive: newStatus === "active" }));
      setSuccess("Status updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to update status.");
    } finally {
      setUpdating(false);
    }
  };

  // ── states ──────────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: "64px 20px" }}><Loading message="Loading user details…" /></div>
  );

  if (error && !user) return (
    <div className="page-container">
      <Link to="/admin/users" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", display: "inline-block", marginBottom: 20 }}>← User Management</Link>
      <ErrorMessage message={error} onRetry={loadUser} />
    </div>
  );

  if (!user) return (
    <div className="page-container">
      <Link to="/admin/users" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", display: "inline-block", marginBottom: 20 }}>← User Management</Link>
      <div className="empty-state"><h2>User not found</h2></div>
    </div>
  );

  const name    = user.name || user.fullName || "User";
  const email   = user.email || "N/A";
  const phone   = user.phone || user.mobile || "N/A";
  const role    = getRole();
  const status  = getStatus();
  const initial = name.charAt(0).toUpperCase();
  const address = user.address || user.shippingAddress || null;

  const roleBadge   = role   === "admin"    ? { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" } : { bg: "var(--se-teal-soft)", color: "var(--se-teal-hover)", border: "var(--se-teal-light)" };
  const statusBadge = status === "active"   ? { bg: "var(--se-success-bg)", color: "var(--se-success)", border: "#A7F3D0" } : { bg: "var(--se-danger-bg)", color: "var(--se-danger)", border: "#FECACA" };

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* BANNER */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E293B 100%)", padding: "36px 0 30px" }}>
        <div style={{ width: "min(100% - 40px, 1100px)", margin: "0 auto" }}>
          <Link to="/admin/users" style={{ fontSize: 12, fontWeight: 700, color: "var(--se-teal-light)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            ← User Management
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--se-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 4px 16px rgba(13,148,136,.4)" }}>
              {initial}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Admin · User Details</p>
              <h1 style={{ color: "#fff", fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>{name}</h1>
              <p style={{ color: "#94A3B8", fontSize: 14 }}>{email}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: roleBadge.bg, color: roleBadge.color, border: `1px solid ${roleBadge.border}` }}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
              <span style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}` }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 1100px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {/* alerts */}
        {error   && <div className="alert-error"   style={{ marginBottom: 20 }}>⚠ {error}</div>}
        {success && <div className="alert-success" style={{ marginBottom: 20 }}>✓ {success}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* ── LEFT ──────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Basic info */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Basic Information</p>
              <InfoRow label="Full Name"    value={name}              />
              <InfoRow label="Email"        value={email}             />
              <InfoRow label="Phone"        value={phone}             />
              <InfoRow label="User ID"      value={userId}            />
              <InfoRow label="Registered"   value={fmtDate(user.createdAt)} />
              <InfoRow label="Last Updated" value={fmtDate(user.updatedAt)} />
            </div>

            {/* Address */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Address</p>
              {address ? (
                <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--se-text-2)" }}>
                  {address.name        && <p style={{ fontWeight: 700, color: "var(--se-text)" }}>{address.name}</p>}
                  {address.addressLine1 || address.address || address.street
                    ? <p>{address.addressLine1 || address.address || address.street}</p>
                    : null}
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  {(address.city || address.state || address.pincode || address.postalCode) && (
                    <p>{[address.city, address.state, address.pincode || address.postalCode].filter(Boolean).join(", ")}</p>
                  )}
                  <p>{address.country || "India"}</p>
                </div>
              ) : (
                <p style={{ fontSize: 14, color: "var(--se-text-4)" }}>No address saved.</p>
              )}
            </div>

          </div>

          {/* ── RIGHT ─────────────────────────────────────── */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Role & Status Management */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>Account Management</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ControlSelect
                  label="User Role"
                  id="userRole"
                  value={role}
                  options={USER_ROLES}
                  disabled={updating}
                  onChange={handleRoleChange}
                />
                <ControlSelect
                  label="Account Status"
                  id="userStatus"
                  value={status}
                  options={USER_STATUSES}
                  disabled={updating}
                  onChange={handleStatusChange}
                />
              </div>

              {updating && (
                <p style={{ fontSize: 13, color: "var(--se-text-3)", marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid var(--se-border)", borderTopColor: "var(--se-teal)", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
                  Saving…
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Account Status</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--se-text-3)" }}>Role</span>
                  <span style={{ fontWeight: 700, padding: "2px 10px", borderRadius: 999, fontSize: 12, background: roleBadge.bg, color: roleBadge.color }}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--se-text-3)" }}>Status</span>
                  <span style={{ fontWeight: 700, padding: "2px 10px", borderRadius: 999, fontSize: 12, background: statusBadge.bg, color: statusBadge.color }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--se-text-3)" }}>Verified</span>
                  <span style={{ fontWeight: 600, color: "var(--se-success)" }}>{user.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            {/* Back link */}
            <Link to="/admin/users" className="btn-secondary" style={{ justifyContent: "center", width: "100%" }}>
              ← Back to Users
            </Link>

          </aside>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:820px){div[style*="grid-template-columns: 1fr 320px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default AdminUserDetailsPage;
