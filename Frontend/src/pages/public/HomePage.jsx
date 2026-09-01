// ============================================================
// SHANTI ENTERPRISES — HomePage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import ProductCard from "../../components/customer/ProductCard";

const getImg = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.secure_url || "";
};

const getCatId = (cat) => {
  if (!cat) return "";
  if (typeof cat === "string") return cat;
  return cat._id || cat.id || "";
};

// ── Skeleton ─────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 16, radius = 6, mb = 0 }) {
  return (
    <div
      style={{
        width: w, height: h, borderRadius: radius,
        background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        marginBottom: mb,
        flexShrink: 0,
      }}
    />
  );
}

// ── Stat ─────────────────────────────────────────────────────
function HeroStat({ value, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <strong style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>{value}</strong>
      <span style={{ color: "#64748B", fontSize: 13, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="home-feature-card">
      <div className="home-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// ── Step ─────────────────────────────────────────────────────
function Step({ num, title, desc }) {
  return (
    <div className="home-shopping-item">
      <div className="home-shopping-item-icon">
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{num}</span>
      </div>
      <div className="home-shopping-item-content">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function HomePage() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loadingP, setLoadingP]       = useState(true);
  const [loadingC, setLoadingC]       = useState(true);

  useEffect(() => {
    getProducts({ page: 1, limit: 8 })
      .then(r => setProducts(r?.products || []))
      .catch(() => {})
      .finally(() => setLoadingP(false));
  }, []);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r?.categories || []))
      .catch(() => {})
      .finally(() => setLoadingC(false));
  }, []);

  const cats  = categories.slice(0, 6);
  const prods = products.slice(0, 8);

  return (
    <div className="home-page">

      {/* ── SHIMMER KEYFRAME ─────────────────────────────── */}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════ */}
      <section className="home-hero">
        <div className="home-container">
          <div className="home-hero-grid">

            {/* LEFT */}
            <div className="home-hero-content">
              <span className="home-hero-badge">Trusted B2B Partner since 2010</span>

              <h1>
                Quality Products.<br />
                <span>Reliable Business.</span>
              </h1>

              <p>
                Shanti Enterprises delivers premium industrial &amp; wholesale
                products with transparent pricing, bulk ordering, and fast fulfilment
                — everything your business needs in one place.
              </p>

              <div className="home-hero-actions">
                <Link to="/products" className="home-primary-button">
                  Explore Products <span>→</span>
                </Link>
                <Link to="/categories" className="home-secondary-button">
                  Browse Categories
                </Link>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
                {[
                  { icon: "✓", text: "Quality Assured" },
                  { icon: "🔒", text: "Secure Checkout" },
                  { icon: "⚡", text: "Fast Dispatch" },
                ].map(t => (
                  <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "var(--se-text-3)" }}>
                    <span style={{ color: "var(--se-teal)", fontWeight: 700 }}>{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — hero card */}
            <div className="home-hero-visual">
              <div className="home-hero-card">
                <div className="home-hero-card-icon">🏭</div>
                <h2>Shanti Enterprises</h2>
                <p>Your one-stop wholesale &amp; industrial supply partner.</p>
                <div className="home-hero-card-divider" />
                <div className="home-hero-stats">
                  <HeroStat value="500+" label="Products" />
                  <HeroStat value="1K+"  label="Customers" />
                  <HeroStat value="15+"  label="Categories" />
                  <HeroStat value="24h"  label="Dispatch" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CATEGORIES
          ════════════════════════════════════════════════════ */}
      <section className="home-section">
        <div className="home-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
            <div className="home-section-heading" style={{ marginBottom: 0 }}>
              <span className="home-eyebrow">Shop by Category</span>
              <h2>Explore our range</h2>
              <p>Find exactly what your business needs.</p>
            </div>
            <Link to="/categories" style={{ fontSize: 14, fontWeight: 700, color: "var(--se-teal)", flexShrink: 0 }}>
              View All →
            </Link>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {loadingC
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden" }}>
                    <Skeleton w="100%" h={140} radius={0} mb={0} />
                    <div style={{ padding: "14px 16px" }}>
                      <Skeleton w="70%" h={14} mb={6} />
                      <Skeleton w="50%" h={10} />
                    </div>
                  </div>
                ))
              : cats.map(cat => {
                  const id  = getCatId(cat);
                  const img = getImg(cat.image);
                  return (
                    <Link
                      key={id || cat.name}
                      to={id ? `/products?category=${id}` : "/products"}
                      style={{ display: "block", borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid var(--se-border)", boxShadow: "0 2px 8px rgba(15,23,42,.05)", transition: "all .22s", textDecoration: "none" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,23,42,.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,.05)"; }}
                    >
                      <div style={{ height: 130, background: img ? "none" : "var(--se-teal-soft)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {img
                          ? <img src={img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                          : <span style={{ fontSize: 44 }}>📦</span>
                        }
                      </div>
                      <div style={{ padding: "12px 14px 14px" }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)", marginBottom: 2 }}>{cat.name}</h3>
                        <p style={{ fontSize: 12, color: "var(--se-text-3)" }}>Browse →</p>
                      </div>
                    </Link>
                  );
                })
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PRODUCTS
          ════════════════════════════════════════════════════ */}
      <section className="home-section" style={{ background: "var(--se-surface)", paddingTop: 64, paddingBottom: 72 }}>
        <div className="home-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
            <div className="home-section-heading" style={{ marginBottom: 0 }}>
              <span className="home-eyebrow">Featured Products</span>
              <h2>Popular this month</h2>
              <p>Top picks from our catalogue — ready to order.</p>
            </div>
            <Link to="/products" style={{ fontSize: 14, fontWeight: 700, color: "var(--se-teal)", flexShrink: 0 }}>
              View All →
            </Link>
          </div>

          {loadingP
            ? <div className="home-products-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden" }}>
                    <Skeleton w="100%" h={200} radius={0} mb={0} />
                    <div style={{ padding: 18 }}>
                      <Skeleton w="40%" h={10} mb={10} />
                      <Skeleton w="80%" h={14} mb={8} />
                      <Skeleton w="50%" h={14} mb={14} />
                      <Skeleton w="100%" h={36} radius={8} />
                    </div>
                  </div>
                ))}
              </div>
            : prods.length === 0
              ? <div className="empty-state" style={{ maxWidth: 480, margin: "0 auto" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <h2>Products coming soon</h2>
                  <p>New products will appear here once they are added.</p>
                </div>
              : <div className="home-products-grid">
                  {prods.map(p => <ProductCard key={p._id || p.id} product={p} />)}
                </div>
          }

          <div className="home-section-footer">
            <Link to="/products" className="home-primary-button" style={{ display: "inline-flex" }}>
              See All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          WHY CHOOSE US
          ════════════════════════════════════════════════════ */}
      <section className="home-section">
        <div className="home-container">
          <div className="home-section-heading">
            <span className="home-eyebrow">Why Choose Us</span>
            <h2>Built around your business</h2>
            <p>We combine product quality with a smooth ordering experience tailored for B2B.</p>
          </div>
          <div className="home-feature-grid">
            <FeatureCard icon="🏆" title="Verified Quality" desc="Every product is sourced from trusted suppliers and meets strict quality standards." />
            <FeatureCard icon="⚡" title="Fast Dispatch" desc="Orders confirmed before noon are dispatched the same business day." />
            <FeatureCard icon="💰" title="Wholesale Pricing" desc="Volume-based pricing tiers that scale with your order quantity." />
            <FeatureCard icon="🔒" title="Secure Payments" desc="Razorpay-powered checkout with UPI, cards, net banking &amp; more." />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════════════ */}
      <section className="home-section home-shopping-section" style={{ background: "var(--se-navy-soft)" }}>
        <div className="home-container">
          <div className="home-shopping-grid">
            <div>
              <span className="home-eyebrow" style={{ color: "var(--se-teal-light)" }}>Simple Ordering</span>
              <h2>From browse to delivered — in 3 steps.</h2>
              <p>No complicated process. Add what you need, confirm your address, and pay securely online or on delivery.</p>
              <Link to="/products" className="home-cta-button" style={{ marginTop: 28, display: "inline-flex" }}>
                Start Shopping →
              </Link>
            </div>
            <div className="home-shopping-box">
              <Step num="01" title="Browse & Add" desc="Find products by category or search. Add to cart with one click." />
              <Step num="02" title="Set Address" desc="Use a saved address or enter a new delivery location." />
              <Step num="03" title="Pay & Confirm" desc="Razorpay or Cash on Delivery — your order is confirmed instantly." />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════ */}
      <section className="home-final-cta">
        <div className="home-container">
          <span className="home-eyebrow" style={{ color: "var(--se-teal-light)" }}>Ready to Order?</span>
          <h2>Start exploring our products today.</h2>
          <p>Join hundreds of businesses that trust Shanti Enterprises for their supply needs.</p>
          <div className="home-final-cta-actions">
            <Link to="/products" className="home-cta-button">Browse Products →</Link>
            <Link to="/register" className="home-secondary-button" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "#fff" }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
