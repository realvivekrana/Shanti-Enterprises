// ============================================================
// SHANTI ENTERPRISES — OrderSummaryPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart }    from "../../context/CartContext";
import { useAddress } from "../../context/AddressContext";
import { createOrder, createOrderFromQuotation } from "../../api/orderApi";
import { getQuotationById } from "../../api/quotationApi";
import Loading from "../../components/common/Loading";

// ── helpers ───────────────────────────────────────────────────
const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── step bar (reused from AddressPage style) ──────────────────
function StepBar({ current = 2 }) {
  const steps = [
    { n: 1, label: "Address", to: "/checkout/address" },
    { n: 2, label: "Summary", to: null },
    { n: 3, label: "Payment", to: null },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        const content = (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? "var(--se-teal)" : active ? "var(--se-navy)" : "#fff", border: `2px solid ${done || active ? "transparent" : "var(--se-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: done || active ? "#fff" : "var(--se-text-4)", fontWeight: 800, fontSize: 14, transition: "all .3s" }}>
              {done ? "✓" : s.n}
            </div>
            <p style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--se-navy)" : done ? "var(--se-teal)" : "var(--se-text-4)", marginTop: 6 }}>{s.label}</p>
          </div>
        );
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1 1 0" : "0 0 auto" }}>
            {s.to && done ? <Link to={s.to} style={{ textDecoration: "none" }}>{content}</Link> : content}
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? "var(--se-teal)" : "var(--se-border)", margin: "0 8px", marginBottom: 22, transition: "background .3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── payment option ────────────────────────────────────────────
function PayOption({ value, selected, onChange, icon, label, desc, badge, badgeColor }) {
  return (
    <label onClick={() => onChange(value)}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `2px solid ${selected ? "var(--se-teal)" : "var(--se-border)"}`, background: selected ? "var(--se-teal-soft)" : "#fff", cursor: "pointer", transition: "all .2s" }}>
      <input type="radio" name="pm" value={value} checked={selected} onChange={() => onChange(value)} style={{ display: "none" }} />
      <div style={{ width: 40, height: 40, borderRadius: 10, background: selected ? "var(--se-teal)" : "var(--se-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all .2s", flexShrink: 0 }}>
        <span style={{ filter: selected ? "brightness(10)" : "none" }}>{icon}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12, color: "var(--se-text-3)" }}>{desc}</p>
      </div>
      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: badgeColor || "var(--se-navy)", color: "#fff", flexShrink: 0 }}>{badge}</span>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
function OrderSummaryPage() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const quotationId    = searchParams.get("quotationId");
  const isQuote        = Boolean(quotationId);

  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const { selectedAddress } = useAddress();

  const [quotation,        setQuotation]        = useState(null);
  const [quotationLoading, setQuotationLoading] = useState(isQuote);
  const [paymentMethod,    setPaymentMethod]    = useState("razorpay");
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState("");

  useEffect(() => {
    if (!isQuote) { setQuotationLoading(false); return; }
    let cancelled = false;
    const load = async () => {
      try {
        setQuotationLoading(true);
        const r = await getQuotationById(quotationId);
        const q = r?.quotation || r?.data?.quotation || r?.data || r;
        if (!cancelled) setQuotation(q || null);
      } catch(err) {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || "Unable to load quotation.");
      } finally {
        if (!cancelled) setQuotationLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [quotationId, isQuote]);

  // display items
  const quoteItems  = Array.isArray(quotation?.items) ? quotation.items : [];
  const displayItems = isQuote
    ? quoteItems.map(i => ({ productId: i.product?._id || i.product, name: i.productName || i.product?.name || "Product", image: i.product?.images?.[0] || i.product?.image || "", quantity: Number(i.quantity) || 0, price: Number(i.unitPrice) || 0, unit: i.unit || "piece" }))
    : cartItems;
  const displayQty   = isQuote ? quoteItems.reduce((s,i) => s + Number(i.quantity||0), 0) : totalItems;
  const displaySub   = isQuote ? Number(quotation?.totalAmount ?? quoteItems.reduce((s,i) => s + Number(i.quantity||0)*Number(i.unitPrice||0), 0)) : Number(subtotal);

  // edge cases
  if (isQuote && quotationLoading) return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}><Loading message="Loading quotation…" /></div>
  );

  if (!isQuote && cartItems.length === 0) return (
    <div style={{ padding: "80px 20px", textAlign: "center", width: "min(100%-40px,600px)", margin: "0 auto" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🛒</div>
      <h2 style={{ marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ marginBottom: 24 }}>Add products before reviewing your order.</p>
      <Link to="/products" className="btn-primary" style={{ display: "inline-flex" }}>Browse Products →</Link>
    </div>
  );

  if (!selectedAddress) return (
    <div style={{ padding: "80px 20px", textAlign: "center", width: "min(100%-40px,600px)", margin: "0 auto" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>📍</div>
      <h2 style={{ marginBottom: 8 }}>No delivery address</h2>
      <p style={{ marginBottom: 24 }}>Please select a delivery address before continuing.</p>
      <Link to="/checkout/address" className="btn-primary" style={{ display: "inline-flex" }}>Select Address →</Link>
    </div>
  );

  // place order
  const handlePlaceOrder = async () => {
    try {
      setLoading(true); setError("");

      const shippingAddress = {
        name:         selectedAddress.name?.trim(),
        phone:        selectedAddress.phone?.trim(),
        addressLine1: selectedAddress.address?.trim(),
        addressLine2: selectedAddress.addressLine2 || "",
        city:         selectedAddress.city?.trim(),
        state:        selectedAddress.state?.trim(),
        postalCode:   selectedAddress.pincode?.trim(),
        country:      "India",
      };

      if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode)
        throw new Error("Delivery address is incomplete. Please go back and update it.");

      const response = isQuote
        ? await createOrderFromQuotation({ quotationId, shippingAddress, paymentMethod })
        : await createOrder({
            items: cartItems.map(i => ({ product: i.productId, quantity: Number(i.quantity), price: Number(i.price) })),
            shippingAddress,
            paymentMethod,
          });

      const order = response?.order || response?.data?.order || response?.data || response;
      const orderId = order?._id || order?.id || response?.orderId;
      if (!orderId) throw new Error("Order ID was not returned. Please try again.");

      if (paymentMethod === "cod") {
        if (!isQuote) clearCart();
        navigate(`/order-success/${orderId}`, { replace: true, state: { paymentMethod: "cod" } });
      } else {
        navigate(`/payment/${orderId}`);
      }
    } catch(err) {
      setError(err?.response?.data?.message || err?.message || "Unable to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* BANNER */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", padding: "36px 0 30px" }}>
        <div style={{ width: "min(100% - 40px, 1000px)", margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Checkout · Step 2 of 3</p>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Order Summary</h1>
          <p style={{ color: "#94A3B8", fontSize: 14 }}>Review your items and choose a payment method.</p>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 1000px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {/* STEP BAR */}
        <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "20px 28px", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
          <StepBar current={2} />
        </div>

        {error && <div className="alert-error" role="alert" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Delivery address */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "18px 22px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Delivery Details</p>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Delivery Address</h2>
                </div>
                <Link to="/checkout/address" style={{ fontSize: 13, fontWeight: 700, color: "var(--se-teal)" }}>Change →</Link>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📍</div>
                <div style={{ fontSize: 14, lineHeight: 1.75, color: "var(--se-text-2)" }}>
                  <p style={{ fontWeight: 700, color: "var(--se-text)", marginBottom: 2 }}>{selectedAddress.name}</p>
                  <p>{selectedAddress.phone}</p>
                  <p>{selectedAddress.address}</p>
                  <p>{[selectedAddress.city, selectedAddress.state, selectedAddress.pincode].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--se-border)", background: "var(--se-surface-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Order Items</p>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Products ({displayItems.length})</h2>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--se-text-3)" }}>{displayQty} units total</span>
              </div>
              <div>
                {displayItems.map((item, i) => {
                  const price    = Number(item.price)    || 0;
                  const qty      = Number(item.quantity) || 0;
                  const total    = price * qty;
                  return (
                    <div key={item.productId || i} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 14, padding: "14px 22px", borderBottom: i < displayItems.length - 1 ? "1px solid var(--se-border-soft)" : "none", alignItems: "center" }}>
                      <div style={{ width: 64, height: 64, borderRadius: 10, background: "var(--se-surface-2)", border: "1px solid var(--se-border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} loading="lazy" />
                          : <span style={{ fontSize: 22 }}>📦</span>
                        }
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)", marginBottom: 3 }}>{item.name}</p>
                        <p style={{ fontSize: 13, color: "var(--se-text-3)" }}>{fmt(price)} × {qty} {item.unit || "unit"}</p>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "var(--se-navy)", whiteSpace: "nowrap" }}>{fmt(total)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/checkout/address" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>← Back to Address</Link>
          </div>

          {/* RIGHT: payment + total */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 88 }}>

            {/* Order total */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>Order Total</p>
                <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Payment Summary</h2>
              </div>
              {[
                { label: "Items",    value: `${displayQty}` },
                { label: "Subtotal", value: fmt(displaySub) },
                { label: "Shipping", value: "Free"          },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--se-text-3)", marginBottom: 10 }}>
                  <span>{r.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--se-text-2)" }}>{r.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: "2px solid var(--se-border)", marginTop: 4 }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--se-navy)" }}>Total</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--se-teal-hover)" }}>{fmt(displaySub)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "20px 22px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Payment Method</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <PayOption value="razorpay" selected={paymentMethod==="razorpay"} onChange={setPaymentMethod} icon="💳" label="Online Payment" desc="UPI, Cards, Net Banking" badge="SECURE" badgeColor="var(--se-teal)" />
                <PayOption value="cod"      selected={paymentMethod==="cod"}      onChange={setPaymentMethod} icon="💵" label="Cash on Delivery" desc="Pay when order arrives" badge="COD"    badgeColor="#7C3AED" />
              </div>
            </div>

            {/* Place order button */}
            <button type="button" onClick={handlePlaceOrder} disabled={loading}
              style={{ width: "100%", height: 54, background: loading ? "var(--se-text-4)" : "var(--se-teal)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading ? "none" : "0 6px 20px rgba(13,148,136,.4)", transition: "all .22s", transform: "none" }}>
              {loading
                ? <><span style={{width:20,height:20,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block"}}/> Placing Order…</>
                : paymentMethod === "cod" ? "Place COD Order →" : "Continue to Payment →"}
            </button>

            <p style={{ fontSize: 12, color: "var(--se-text-4)", textAlign: "center" }}>
              🔒 {paymentMethod === "cod" ? "Pay when your order is delivered." : "Secure payment via Razorpay."}
            </p>

          </aside>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:820px){div[style*="grid-template-columns: 1fr 340px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default OrderSummaryPage;
