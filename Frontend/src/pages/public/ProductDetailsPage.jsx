// ============================================================
// SHANTI ENTERPRISES — ProductDetailsPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../api/productApi";
import { useCart }        from "../../context/CartContext";
import Loading            from "../../components/common/Loading";
import ErrorMessage       from "../../components/common/ErrorMessage";

// ── helpers ───────────────────────────────────────────────────
const getImg = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img?.url || img?.secure_url || img?.src || "";
};

const extractProduct = (data) =>
  data?.product || data?.data?.product || data?.data || (data?._id ? data : null);

const fmt = (n) =>
  `₹${Number(n||0).toLocaleString("en-IN",{ minimumFractionDigits:2, maximumFractionDigits:2 })}`;

// ── tier price table ──────────────────────────────────────────
function PricingTiers({ tiers, basePrice, unit }) {
  if (!Array.isArray(tiers) || tiers.length === 0) return null;
  return (
    <div style={{ marginTop:20 }}>
      <p style={{ fontSize:13, fontWeight:700, color:"var(--se-text-2)", marginBottom:10, letterSpacing:".04em", textTransform:"uppercase" }}>Wholesale Pricing</p>
      <div style={{ borderRadius:10, overflow:"hidden", border:"1px solid var(--se-border)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"var(--se-surface-2)" }}>
              <th style={{ padding:"8px 14px", textAlign:"left", fontWeight:700, color:"var(--se-text-3)", borderBottom:"1px solid var(--se-border)" }}>Min Qty</th>
              <th style={{ padding:"8px 14px", textAlign:"right", fontWeight:700, color:"var(--se-text-3)", borderBottom:"1px solid var(--se-border)" }}>Price / {unit||"unit"}</th>
              <th style={{ padding:"8px 14px", textAlign:"right", fontWeight:700, color:"var(--se-success)", borderBottom:"1px solid var(--se-border)" }}>Saving</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier,i) => {
              const saving = basePrice > tier.price ? Math.round((1 - tier.price/basePrice)*100) : 0;
              return (
                <tr key={i} style={{ borderBottom:"1px solid var(--se-border-soft)" }}>
                  <td style={{ padding:"8px 14px", fontWeight:600, color:"var(--se-text-2)" }}>{tier.minQuantity}+ units</td>
                  <td style={{ padding:"8px 14px", textAlign:"right", fontWeight:700, color:"var(--se-teal-hover)" }}>{fmt(tier.price)}</td>
                  <td style={{ padding:"8px 14px", textAlign:"right", fontWeight:600, color:saving>0?"var(--se-success)":"var(--se-text-4)" }}>{saving>0 ? `Save ${saving}%` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── meta item ─────────────────────────────────────────────────
function MetaItem({ label, value }) {
  return (
    <div style={{ padding:"12px 16px", background:"var(--se-surface-2)", borderRadius:10, border:"1px solid var(--se-border-soft)" }}>
      <p style={{ fontSize:11, fontWeight:700, color:"var(--se-text-4)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:14, fontWeight:700, color:"var(--se-text)" }}>{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();

  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [quantity,     setQuantity]     = useState(1);
  const [selImg,       setSelImg]       = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const [cartError,    setCartError]    = useState("");
  const [imgErrors,    setImgErrors]    = useState({});
  const [activeTab,    setActiveTab]    = useState("description"); // description | specs

  const loadProduct = async () => {
    if (!productId) { setLoading(false); setError("Product ID is missing."); return; }
    try {
      setLoading(true); setError(""); setProduct(null); setSelImg(0); setImgErrors({}); setCartError(""); setAddedToCart(false);
      const data = await getProductById(productId);
      const p = extractProduct(data);
      if (!p) { setProduct(null); return; }
      setProduct(p);
      const m = Math.max(1, Number(p.moq ?? 1) || 1);
      const s = Number(p.stock ?? 0);
      setQuantity(s > 0 ? Math.min(m, s) : m);
    } catch(err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProduct(); }, [productId]);

  if (loading) return (
    <div style={{ width:"min(100%-40px,1240px)", margin:"0 auto", padding:"64px 0" }}>
      <Loading message="Loading product…" />
    </div>
  );

  if (error) return (
    <div style={{ width:"min(100%-40px,1240px)", margin:"0 auto", padding:"40px 0" }}>
      <Link to="/products" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:14, fontWeight:600, color:"var(--se-text-3)", marginBottom:20 }}>← Back to Products</Link>
      <ErrorMessage message={error} onRetry={loadProduct} />
    </div>
  );

  if (!product) return (
    <div style={{ width:"min(100%-40px,1240px)", margin:"0 auto", padding:"40px 0" }}>
      <Link to="/products" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:14, fontWeight:600, color:"var(--se-text-3)", marginBottom:20 }}>← Back to Products</Link>
      <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>📦</div><h2>Product not found</h2><p>This product doesn't exist or has been removed.</p></div>
    </div>
  );

  // derived values
  const name  = product?.name || "Product";
  const price = Number(product?.price ?? 0);
  const stock = Math.max(0, Number(product?.stock ?? 0));
  const moq   = Math.max(1, Number(product?.moq ?? 1));
  const unit  = product?.unit || "unit";
  const brand = typeof product?.brand === "object" ? product.brand?.name : product?.brand;
  const catObj = product?.category;
  const catName = typeof catObj === "object" ? catObj?.name : catObj;
  const catId   = typeof catObj === "object" ? catObj?._id || catObj?.id : "";
  const tiers   = Array.isArray(product?.wholesalePriceTiers) ? product.wholesalePriceTiers.filter(t=>t.minQuantity && t.price) : [];

  const rawImages = Array.isArray(product?.images) ? product.images : product?.image ? [product.image] : [];
  const images    = rawImages.map(getImg).filter(Boolean);
  const inStock   = stock > 0;
  const minQty    = inStock ? Math.min(moq, stock) : moq;

  // handlers
  const inc = () => { if (inStock && quantity < stock) { setQuantity(q=>Math.min(stock,q+1)); setCartError(""); } };
  const dec = () => { if (inStock && quantity > minQty) { setQuantity(q=>Math.max(minQty,q-1)); setCartError(""); } };
  const qChange = (e) => {
    const v = Math.floor(Number(e.target.value));
    if (!Number.isFinite(v)) return;
    setQuantity(Math.min(stock, Math.max(minQty, v)));
    setCartError("");
  };

  const handleAddToCart = async () => {
    if (!inStock || addingToCart) return;
    setCartError(""); setAddedToCart(false);
    const q = Math.min(stock, Math.max(minQty, Math.floor(Number(quantity)||minQty)));
    if (q < moq) return setCartError(`Minimum order quantity is ${moq} units.`);
    if (q > stock) return setCartError(`Only ${stock} units available.`);
    try {
      setAddingToCart(true);
      await addToCart(product, q);
      setQuantity(q); setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch(err) {
      setCartError(err?.response?.data?.message || err?.message || "Unable to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRFQ = () => {
    navigate("/rfq/create", { state: { product: { ...product }, quantity: Math.max(moq, Math.floor(Number(quantity)||moq)) } });
  };

  return (
    <div style={{ background:"var(--se-bg)", minHeight:"calc(100vh - 68px)" }}>
      <div style={{ width:"min(100% - 40px, 1240px)", margin:"0 auto", padding:"32px 0 72px" }}>

        {/* BREADCRUMB */}
        <nav style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--se-text-4)", marginBottom:24, flexWrap:"wrap" }}>
          <Link to="/" style={{ color:"var(--se-text-3)", fontWeight:500 }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color:"var(--se-text-3)", fontWeight:500 }}>Products</Link>
          {catName && <><span>/</span><span>{catName}</span></>}
          <span>/</span>
          <span style={{ color:"var(--se-text-2)", fontWeight:600, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</span>
        </nav>

        {/* MAIN GRID */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>

          {/* ── IMAGE SECTION ──────────────────────────── */}
          <div>
            {/* main image */}
            <div style={{ background:"#fff", border:"1px solid var(--se-border)", borderRadius:20, overflow:"hidden", aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", boxShadow:"var(--shadow-md)" }}>
              {images.length > 0 && !imgErrors[selImg]
                ? <img src={images[selImg]||images[0]} alt={name} onError={()=>setImgErrors(p=>({...p,[selImg]:true}))} style={{ width:"100%", height:"100%", objectFit:"contain", padding:16 }} />
                : <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, color:"var(--se-text-4)" }}>
                    <span style={{ fontSize:64 }}>📦</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>No Image</span>
                  </div>
              }
              {/* stock badge */}
              <span style={{ position:"absolute", top:16, left:16, padding:"5px 12px", borderRadius:999, fontSize:12, fontWeight:700, background: inStock ? "var(--se-success-bg)" : "var(--se-danger-bg)", color: inStock ? "var(--se-success)" : "var(--se-danger)", border: `1px solid ${inStock ? "#A7F3D0" : "#FECACA"}` }}>
                {inStock ? `● In Stock` : "✕ Out of Stock"}
              </span>
            </div>

            {/* thumbnails */}
            {images.length > 1 && (
              <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
                {images.map((img,i) => (
                  <button key={i} type="button" onClick={() => setSelImg(i)}
                    style={{ width:72, height:72, borderRadius:10, overflow:"hidden", border: selImg===i ? "2px solid var(--se-teal)" : "2px solid var(--se-border)", cursor:"pointer", background:"#fff", padding:4, boxShadow: selImg===i ? "0 0 0 3px rgba(13,148,136,.15)" : "none", transition:"all .2s", transform:"none" }}>
                    {!imgErrors[i]
                      ? <img src={img} alt={`View ${i+1}`} onError={()=>setImgErrors(p=>({...p,[i]:true}))} style={{ width:"100%", height:"100%", objectFit:"contain" }} loading="lazy" />
                      : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", fontSize:20 }}>📦</span>
                    }
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ───────────────────────────── */}
          <div>
            {catName && (
              <Link to={catId ? `/products?category=${catId}` : "/products"}
                style={{ fontSize:12, fontWeight:700, color:"var(--se-teal)", textTransform:"uppercase", letterSpacing:".08em", display:"inline-block", marginBottom:10 }}>
                {catName}
              </Link>
            )}

            <h1 style={{ fontSize:"clamp(1.4rem,2.5vw,1.9rem)", fontWeight:800, color:"var(--se-navy)", letterSpacing:"-0.03em", marginBottom:8, lineHeight:1.25 }}>
              {name}
            </h1>

            {brand && (
              <p style={{ fontSize:14, color:"var(--se-text-3)", marginBottom:16 }}>
                Brand: <strong style={{ color:"var(--se-text-2)" }}>{brand}</strong>
                {product?.sku && <> &nbsp;·&nbsp; SKU: <strong style={{ color:"var(--se-text-2)", fontFamily:"monospace" }}>{product.sku}</strong></>}
              </p>
            )}

            {/* price */}
            <div style={{ marginBottom:20, padding:"16px 20px", background:"var(--se-teal-soft)", border:"1px solid var(--se-teal-light)", borderRadius:12 }}>
              <span style={{ fontSize:"2rem", fontWeight:900, color:"var(--se-navy)", letterSpacing:"-0.04em" }}>{fmt(price)}</span>
              <span style={{ fontSize:14, color:"var(--se-text-3)", marginLeft:6 }}>/ {unit}</span>
              {tiers.length > 0 && <p style={{ fontSize:12, color:"var(--se-teal-hover)", fontWeight:600, marginTop:4 }}>● Volume discounts available</p>}
            </div>

            {/* meta grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
              <MetaItem label="Min Order" value={`${moq} ${unit}${moq>1?"s":""}`} />
              <MetaItem label="In Stock"  value={inStock ? `${stock} ${unit}${stock>1?"s":""}` : "Unavailable"} />
              <MetaItem label="Unit"      value={unit} />
            </div>

            {/* wholesale tiers */}
            <PricingTiers tiers={tiers} basePrice={price} unit={unit} />

            {/* ── PURCHASE BOX ──────────────────────── */}
            <div style={{ marginTop:24, padding:20, background:"#fff", border:"1px solid var(--se-border)", borderRadius:14, boxShadow:"var(--shadow-sm)" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"var(--se-text-2)", marginBottom:14 }}>Select Quantity</p>

              {/* qty control */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--se-border)", borderRadius:10, overflow:"hidden" }}>
                  <button type="button" onClick={dec} disabled={!inStock||quantity<=minQty}
                    style={{ width:42, height:42, background:"var(--se-surface-2)", border:"none", fontSize:20, cursor:!inStock||quantity<=minQty?"not-allowed":"pointer", color:"var(--se-text-2)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"none", transform:"none", opacity: (!inStock||quantity<=minQty) ? .4 : 1 }}>
                    −
                  </button>
                  <input type="number" value={quantity} onChange={qChange} min={minQty} max={stock||undefined} disabled={!inStock}
                    style={{ width:64, height:42, textAlign:"center", fontWeight:800, fontSize:16, border:"none", borderLeft:"1px solid var(--se-border)", borderRight:"1px solid var(--se-border)", borderRadius:0 }} />
                  <button type="button" onClick={inc} disabled={!inStock||quantity>=stock}
                    style={{ width:42, height:42, background:"var(--se-surface-2)", border:"none", fontSize:20, cursor:!inStock||quantity>=stock?"not-allowed":"pointer", color:"var(--se-text-2)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"none", transform:"none", opacity:(!inStock||quantity>=stock)?.4:1 }}>
                    +
                  </button>
                </div>
                <p style={{ fontSize:13, color:"var(--se-text-3)" }}>
                  MOQ: <strong style={{ color:"var(--se-text-2)" }}>{moq}</strong>
                  {inStock && <> · Max: <strong style={{ color:"var(--se-text-2)" }}>{stock}</strong></>}
                </p>
              </div>

              {/* total */}
              {inStock && (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"var(--se-surface-2)", borderRadius:8, marginBottom:14 }}>
                  <span style={{ fontSize:13, color:"var(--se-text-3)" }}>Total ({quantity} {unit}{quantity>1?"s":""})</span>
                  <span style={{ fontSize:18, fontWeight:800, color:"var(--se-teal-hover)" }}>{fmt(price * quantity)}</span>
                </div>
              )}

              {/* cart error */}
              {cartError && <div className="alert-error" style={{ marginBottom:12, fontSize:13 }}>{cartError}</div>}

              {/* add to cart */}
              <button type="button" onClick={handleAddToCart} disabled={!inStock||addingToCart}
                style={{ width:"100%", height:50, background: addedToCart ? "var(--se-success)" : inStock ? "var(--se-teal)" : "var(--se-text-4)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:!inStock?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow: inStock && !addedToCart ? "0 6px 20px rgba(13,148,136,.35)" : "none", transition:"all .22s", transform:"none", marginBottom:10 }}>
                {addingToCart ? <><span style={{width:18,height:18,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block"}}/> Adding…</>
                  : addedToCart ? "✓ Added to Cart!"
                  : inStock ? `Add ${quantity} to Cart`
                  : "Out of Stock"}
              </button>

              {/* go to cart */}
              {addedToCart && (
                <button type="button" onClick={() => navigate("/cart")} className="btn-secondary" style={{ width:"100%", height:44, fontSize:14 }}>
                  Go to Cart →
                </button>
              )}

              {/* request quote */}
              <button type="button" onClick={handleRFQ}
                style={{ width:"100%", height:44, background:"transparent", color:"var(--se-teal-hover)", border:"1px solid var(--se-teal-light)", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer", marginTop:10, boxShadow:"none", transform:"none", transition:"all .2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="var(--se-teal-soft)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
                📋 Request a Quote
              </button>
            </div>
          </div>
        </div>

        {/* ── TABS: Description / Specs ──────────────────── */}
        <div style={{ marginTop:40, background:"#fff", border:"1px solid var(--se-border)", borderRadius:16, overflow:"hidden", boxShadow:"var(--shadow-sm)" }}>
          <div style={{ display:"flex", borderBottom:"1px solid var(--se-border)" }}>
            {["description","specs"].map(tab => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                style={{ height:52, padding:"0 28px", background:"transparent", border:"none", borderBottom: activeTab===tab ? "3px solid var(--se-teal)" : "3px solid transparent", color: activeTab===tab ? "var(--se-teal-hover)" : "var(--se-text-3)", fontWeight: activeTab===tab ? 700 : 500, fontSize:15, cursor:"pointer", boxShadow:"none", transform:"none", transition:"all .2s", textTransform:"capitalize" }}>
                {tab === "description" ? "Description" : "Specifications"}
              </button>
            ))}
          </div>
          <div style={{ padding:28 }}>
            {activeTab === "description" && (
              <p style={{ fontSize:15, lineHeight:1.85, color:"var(--se-text-2)", maxWidth:720 }}>
                {product?.description || "No description available for this product."}
              </p>
            )}
            {activeTab === "specs" && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
                {[
                  catName && ["Category", catName],
                  brand   && ["Brand", brand],
                  product?.sku && ["SKU", product.sku],
                  ["Unit", unit],
                  ["MOQ", `${moq} ${unit}${moq>1?"s":""}`],
                  ["Stock", inStock ? `${stock} available` : "Out of stock"],
                  product?.isWholesale && ["Type", "Wholesale"],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} style={{ padding:"12px 16px", background:"var(--se-surface-2)", borderRadius:10, border:"1px solid var(--se-border-soft)" }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"var(--se-text-4)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>{label}</p>
                    <p style={{ fontSize:14, fontWeight:600, color:"var(--se-text)" }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* back nav */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:32, flexWrap:"wrap", gap:12 }}>
          <Link to="/products" style={{ fontSize:14, fontWeight:600, color:"var(--se-text-3)", display:"flex", alignItems:"center", gap:6 }}>← Continue Shopping</Link>
          <Link to="/cart" style={{ fontSize:14, fontWeight:600, color:"var(--se-teal)", display:"flex", alignItems:"center", gap:6 }}>View Cart →</Link>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:860px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default ProductDetailsPage;
