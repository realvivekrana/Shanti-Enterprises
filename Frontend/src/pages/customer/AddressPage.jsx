// ============================================================
// SHANTI ENTERPRISES — AddressPage (Premium)
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddress } from "../../context/AddressContext";
import "./AddressPage.css";

const INIT = { name: "", phone: "", address: "", city: "", state: "", pincode: "" };

// ── step progress ─────────────────────────────────────────────
function StepBar({ current = 1 }) {
  const steps = [
    { n: 1, label: "Address",  sub: "Delivery" },
    { n: 2, label: "Summary",  sub: "Review order" },
    { n: 3, label: "Payment",  sub: "Complete" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1 1 0" : "0 0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? "var(--se-teal)" : active ? "var(--se-navy)" : "#fff", border: `2px solid ${done || active ? "transparent" : "var(--se-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: done || active ? "#fff" : "var(--se-text-4)", fontWeight: 800, fontSize: 14, boxShadow: active ? "0 0 0 4px rgba(13,148,136,.15)" : "none", transition: "all .3s" }}>
                {done ? "✓" : s.n}
              </div>
              <p style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--se-navy)" : done ? "var(--se-teal)" : "var(--se-text-4)", marginTop: 6, textAlign: "center" }}>{s.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? "var(--se-teal)" : "var(--se-border)", margin: "0 8px", marginBottom: 22, transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── field ─────────────────────────────────────────────────────
function Field({ id, label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "var(--se-danger)", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function AddressPage() {
  const navigate = useNavigate();
  const { addresses = [], selectedAddressId, addAddress, updateAddress, deleteAddress, selectAddress } = useAddress();

  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(INIT);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [saving,    setSaving]    = useState(false);
  const [deletingId,setDeletingId]= useState(null);

  const change = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(""); setSuccess(""); };
  const reset  = () => { setForm(INIT); setEditingId(null); setError(""); };

  const validate = () => {
    if (!form.name.trim()    || form.name.trim().length < 2) return "Full name is required (min 2 chars).";
    if (!form.phone.trim()   || !/^\d{10}$/.test(form.phone.replace(/\D/g,""))) return "Valid 10-digit phone number required.";
    if (!form.address.trim() || form.address.trim().length < 5) return "Complete address is required.";
    if (!form.city.trim())   return "City is required.";
    if (!form.state.trim())  return "State is required.";
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Valid 6-digit pincode required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const err = validate();
    if (err) return setError(err);
    try {
      setSaving(true);
      const clean = { name: form.name.trim(), phone: form.phone.replace(/\D/g,"").slice(-10), address: form.address.trim(), city: form.city.trim(), state: form.state.trim(), pincode: form.pincode.trim() };
      if (editingId) { await updateAddress(editingId, clean); setSuccess("Address updated successfully."); }
      else           { await addAddress(clean);                setSuccess("Address saved successfully.");   }
      reset();
    } catch(err) {
      setError(err?.message || "Unable to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setForm({ name: addr.name||"", phone: addr.phone||"", address: addr.address||"", city: addr.city||"", state: addr.state||"", pincode: addr.pincode||"" });
    setError(""); setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      setDeletingId(id); setError(""); setSuccess("");
      await deleteAddress(id);
      if (editingId === id) reset();
      setSuccess("Address deleted.");
    } catch(err) {
      setError(err?.message || "Unable to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) return setError("Please select a delivery address to continue.");
    navigate("/checkout/summary");
  };

  return (
    <div className="address-page" style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* BANNER */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", padding: "36px 0 30px" }}>
        <div style={{ width: "min(100% - 40px, 900px)", margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Checkout · Step 1 of 3</p>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Delivery Address</h1>
          <p style={{ color: "#94A3B8", fontSize: 14 }}>Select or add a delivery address.</p>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 900px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {/* STEP BAR */}
        <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "20px 28px", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
          <StepBar current={1} />
        </div>

        {/* MESSAGES */}
        {error   && <div className="alert-error"   role="alert"  style={{ marginBottom: 16 }}>⚠ {error}   <button type="button" onClick={() => setError("")}  style={{ marginLeft: 12, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, color: "inherit" }}>×</button></div>}
        {success && <div className="alert-success" role="status" style={{ marginBottom: 16 }}>✓ {success} <button type="button" onClick={() => setSuccess("")} style={{ marginLeft: 12, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, color: "inherit" }}>×</button></div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

          {/* LEFT: saved addresses */}
          <div>
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--se-border)", background: "var(--se-surface-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Saved Addresses</p>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Choose delivery address</h2>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--se-teal)" }}>{addresses.length} saved</span>
              </div>

              {addresses.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>📍</div>
                  <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>No saved addresses</h3>
                  <p style={{ fontSize: 14 }}>Use the form to add your first delivery address.</p>
                </div>
              ) : (
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {addresses.map((addr, i) => {
                    const id       = addr.id;
                    const selected = selectedAddressId === id;
                    const deleting = deletingId === id;
                    return (
                      <div key={id || i} onClick={() => selectAddress(id)}
                        style={{ padding: "16px 18px", borderRadius: 12, border: `2px solid ${selected ? "var(--se-teal)" : "var(--se-border)"}`, background: selected ? "var(--se-teal-soft)" : "#fff", cursor: "pointer", transition: "all .2s", position: "relative" }}>
                        {/* selected indicator */}
                        <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: selected ? "var(--se-teal)" : "#fff", border: `2px solid ${selected ? "var(--se-teal)" : "var(--se-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800, transition: "all .2s" }}>
                          {selected ? "✓" : ""}
                        </div>

                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingRight: 32 }}>
                          <div style={{ width: 38, height: 38, background: selected ? "var(--se-teal)" : "var(--se-surface-2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, transition: "all .2s" }}>
                            <span style={{ filter: selected ? "brightness(10)" : "none" }}>📍</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--se-text)", marginBottom: 3 }}>{addr.name}</p>
                            <p style={{ fontSize: 13, color: "var(--se-text-3)", marginBottom: 2 }}>{addr.phone}</p>
                            <p style={{ fontSize: 13, color: "var(--se-text-3)", marginBottom: 2 }}>{addr.address}</p>
                            <p style={{ fontSize: 13, color: "var(--se-text-3)" }}>{[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}</p>
                          </div>
                        </div>

                        {selected && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--se-teal-light)", display: "flex", gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", background: "var(--se-teal)", color: "#fff", borderRadius: 999 }}>✓ Selected</span>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                          <button type="button" onClick={() => handleEdit(addr)} disabled={deleting}
                            style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "var(--se-surface-2)", border: "1px solid var(--se-border)", borderRadius: 7, cursor: "pointer", color: "var(--se-text-2)", boxShadow: "none", transform: "none" }}>
                            ✏ Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(id)} disabled={deleting}
                            style={{ height: 32, padding: "0 14px", fontSize: 12, fontWeight: 600, background: "var(--se-danger-bg)", border: "1px solid #FECACA", borderRadius: 7, cursor: "pointer", color: "var(--se-danger)", boxShadow: "none", transform: "none" }}>
                            {deleting ? "Deleting…" : "🗑 Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Continue button */}
            <div style={{ marginTop: 20, background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: selectedAddressId ? "var(--se-success)" : "var(--se-text-2)", marginBottom: 3 }}>
                    {selectedAddressId ? "✓ Delivery address selected" : "Select a delivery address"}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--se-text-3)" }}>Review your order on the next step.</p>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to="/cart" className="btn-secondary" style={{ height: 46, fontSize: 14 }}>← Back to Cart</Link>
                  <button type="button" onClick={handleContinue} disabled={!selectedAddressId}
                    style={{ height: 46, padding: "0 24px", background: selectedAddressId ? "var(--se-teal)" : "var(--se-text-4)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: selectedAddressId ? "pointer" : "not-allowed", boxShadow: selectedAddressId ? "0 4px 16px rgba(13,148,136,.35)" : "none", transition: "all .22s", transform: "none" }}>
                    Continue to Summary →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)", position: "sticky", top: 88 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{editingId ? "Update Address" : "New Address"}</p>
                <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>{editingId ? "Edit Address" : "Add New Address"}</h2>
              </div>
              {editingId && (
                <button type="button" onClick={reset} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 700, color: "var(--se-danger)", cursor: "pointer", padding: 0, boxShadow: "none", transform: "none" }}>Cancel</button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <Field id="addr-name"    label="Full Name"        required><input id="addr-name"    name="name"    type="text"     value={form.name}    onChange={change} placeholder="Receiver's full name"    autoComplete="name"         maxLength={80}  disabled={saving} style={{height:44,fontSize:14}} /></Field>
              <Field id="addr-phone"   label="Phone Number"     required><input id="addr-phone"   name="phone"   type="tel"      value={form.phone}   onChange={change} placeholder="10-digit mobile number" autoComplete="tel"          maxLength={15}  disabled={saving} style={{height:44,fontSize:14}} inputMode="numeric" /></Field>

              <div style={{ marginBottom: 16 }}>
                <label htmlFor="addr-address" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", display: "block", marginBottom: 6 }}>
                  Complete Address <span style={{ color: "var(--se-danger)" }}>*</span>
                </label>
                <textarea id="addr-address" name="address" value={form.address} onChange={change} placeholder="House/Flat, Building, Street, Area" rows={3} maxLength={300} autoComplete="street-address" disabled={saving} style={{ fontSize: 14, minHeight: 80 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field id="addr-city"  label="City"    required><input id="addr-city"  name="city"    type="text" value={form.city}    onChange={change} placeholder="City"    autoComplete="address-level2" maxLength={60} disabled={saving} style={{height:44,fontSize:14}} /></Field>
                <Field id="addr-state" label="State"   required><input id="addr-state" name="state"   type="text" value={form.state}   onChange={change} placeholder="State"   autoComplete="address-level1" maxLength={60} disabled={saving} style={{height:44,fontSize:14}} /></Field>
              </div>
              <Field id="addr-pincode" label="Pincode (6 digits)" required>
                <input id="addr-pincode" name="pincode" type="text" value={form.pincode} onChange={change} placeholder="e.g. 411014" autoComplete="postal-code" maxLength={6} inputMode="numeric" disabled={saving} style={{height:44,fontSize:14}} />
              </Field>

              <button type="submit" disabled={saving}
                style={{ width: "100%", height: 48, background: saving ? "var(--se-text-4)" : "var(--se-teal)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: saving ? "none" : "0 4px 16px rgba(13,148,136,.3)", transition: "all .22s", transform: "none", marginTop: 4 }}>
                {saving
                  ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block"}}/> Saving…</>
                  : editingId ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:820px){div[style*="grid-template-columns: 1fr 380px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default AddressPage;
