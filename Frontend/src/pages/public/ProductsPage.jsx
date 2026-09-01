// ============================================================
// SHANTI ENTERPRISES — ProductsPage (Premium)
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts }   from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import ProductCard       from "../../components/customer/ProductCard";
import Loading           from "../../components/common/Loading";
import ErrorMessage      from "../../components/common/ErrorMessage";

// ── skeleton card ─────────────────────────────────────────────
function ProductSkeleton() {
  const s = (w, h, r=8, mb=0) => (
    <div style={{ width:w, height:h, borderRadius:r, marginBottom:mb,
      background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", flexShrink:0 }} />
  );
  return (
    <div style={{ background:"#fff", border:"1px solid var(--se-border)", borderRadius:16, overflow:"hidden" }}>
      {s("100%",200,0,0)}
      <div style={{ padding:18 }}>
        {s("40%",10,6,10)}
        {s("80%",14,6,8)}
        {s("50%",20,6,14)}
        {s("100%",38,8,0)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [pagination, setPagination] = useState({ page:1, limit:12, totalProducts:0, totalPages:0 });

  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const sort     = searchParams.get("sort")     || "";
  const rawPage  = Number(searchParams.get("page") || 1);
  const page     = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  // load categories for filter sidebar
  useEffect(() => {
    getCategories().then(r => setCategories(r?.categories || [])).catch(() => {});
  }, []);

  // load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = { page, limit: 12 };
      if (search.trim())   params.search   = search.trim();
      if (category.trim()) params.category = category.trim();
      if (sort.trim())     params.sort     = sort.trim();

      const data = await getProducts(params);
      const list = Array.isArray(data) ? data
        : Array.isArray(data?.products) ? data.products
        : Array.isArray(data?.data?.products) ? data.data.products
        : [];
      setProducts(list);

      const pg = data?.pagination || data?.data?.pagination;
      if (pg) {
        setPagination({
          page:          Number(pg.page)          || page,
          limit:         Number(pg.limit)         || 12,
          totalProducts: Number(pg.totalProducts  ?? pg.total ?? list.length),
          totalPages:    Number(pg.totalPages)    || (list.length > 0 ? 1 : 0),
        });
      } else {
        setPagination({ page, limit:12, totalProducts: list.length, totalPages: list.length > 0 ? 1 : 0 });
      }
    } catch(err) {
      setProducts([]);
      setError(err?.response?.data?.message || err?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const setParam = (updates) => {
    const p = {};
    if (search)   p.search   = search;
    if (category) p.category = category;
    if (sort)     p.sort     = sort;
    p.page = "1";
    setSearchParams({ ...p, ...updates });
  };

  const changePage = (n) => {
    if (!Number.isFinite(n) || n < 1 || (pagination.totalPages > 0 && n > pagination.totalPages)) return;
    setParam({ page: String(n) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = !!(search || category || sort);

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)", padding: "48px 0 40px", marginBottom: 0 }}>
        <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto" }}>
          <span style={{ display:"inline-block", fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"var(--se-teal-light)", marginBottom:10 }}>
            Shop Collection
          </span>
          <h1 style={{ color:"#fff", fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:800, letterSpacing:"-0.03em", marginBottom:8 }}>
            All Products
          </h1>
          <p style={{ color:"#94A3B8", fontSize:16 }}>
            {pagination.totalProducts > 0
              ? `${pagination.totalProducts} products available`
              : "Browse our complete catalogue"}
          </p>
        </div>
      </div>

      <div style={{ width:"min(100% - 40px, 1240px)", margin:"0 auto", padding:"32px 0 72px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:28, alignItems:"start" }}>

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside>
            {/* search */}
            <div style={{ background:"#fff", border:"1px solid var(--se-border)", borderRadius:14, padding:20, marginBottom:16, boxShadow:"var(--shadow-sm)" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--se-text-3)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Search</p>
              <form onSubmit={e => { e.preventDefault(); const v = new FormData(e.currentTarget).get("search")?.toString().trim() || ""; setParam({ search: v || undefined, page:"1" }); }}>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--se-text-4)", fontSize:15 }}>⌕</span>
                  <input name="search" type="search" defaultValue={search} placeholder="Search products…" style={{ paddingLeft:36, height:40, fontSize:14 }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width:"100%", marginTop:10, height:40, fontSize:14 }}>Search</button>
              </form>
            </div>

            {/* sort */}
            <div style={{ background:"#fff", border:"1px solid var(--se-border)", borderRadius:14, padding:20, marginBottom:16, boxShadow:"var(--shadow-sm)" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--se-text-3)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Sort By</p>
              <select value={sort} onChange={e => setParam({ sort: e.target.value || undefined })} style={{ height:40, fontSize:14 }}>
                <option value="">Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* categories */}
            {categories.length > 0 && (
              <div style={{ background:"#fff", border:"1px solid var(--se-border)", borderRadius:14, padding:20, boxShadow:"var(--shadow-sm)" }}>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--se-text-3)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Category</p>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <button type="button" onClick={() => setParam({ category: undefined })}
                    style={{ textAlign:"left", padding:"8px 12px", borderRadius:8, fontSize:14, fontWeight: !category ? 700 : 500, color: !category ? "var(--se-teal-hover)" : "var(--se-text-2)", background: !category ? "var(--se-teal-soft)" : "transparent", border:"none", cursor:"pointer", boxShadow:"none", transform:"none" }}>
                    All Categories
                  </button>
                  {categories.map(cat => {
                    const id = cat._id || cat.id;
                    const active = category === id;
                    return (
                      <button key={id} type="button" onClick={() => setParam({ category: id })}
                        style={{ textAlign:"left", padding:"8px 12px", borderRadius:8, fontSize:14, fontWeight: active ? 700 : 500, color: active ? "var(--se-teal-hover)" : "var(--se-text-2)", background: active ? "var(--se-teal-soft)" : "transparent", border:"none", cursor:"pointer", boxShadow:"none", transform:"none" }}>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* clear */}
            {hasFilters && (
              <button type="button" onClick={() => setSearchParams({})} className="btn-secondary" style={{ width:"100%", marginTop:16, fontSize:13 }}>
                ✕ Clear All Filters
              </button>
            )}
          </aside>

          {/* ── MAIN ────────────────────────────────────── */}
          <div>
            {/* active filters */}
            {hasFilters && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {search && (
                  <span style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", background:"var(--se-teal-soft)", border:"1px solid var(--se-teal-light)", borderRadius:999, fontSize:13, fontWeight:600, color:"var(--se-teal-hover)" }}>
                    🔍 "{search}"
                    <button type="button" onClick={() => setParam({ search: undefined })} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", padding:0, fontSize:14, lineHeight:1, boxShadow:"none", transform:"none" }}>×</button>
                  </span>
                )}
                {sort && (
                  <span style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", background:"var(--se-info-bg)", border:"1px solid #BFDBFE", borderRadius:999, fontSize:13, fontWeight:600, color:"var(--se-info)" }}>
                    ↕ {sort === "price_asc" ? "Price ↑" : sort === "price_desc" ? "Price ↓" : "Newest"}
                    <button type="button" onClick={() => setParam({ sort: undefined })} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", padding:0, fontSize:14, lineHeight:1, boxShadow:"none", transform:"none" }}>×</button>
                  </span>
                )}
              </div>
            )}

            {/* result count */}
            {!loading && !error && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:8 }}>
                <p style={{ fontSize:14, color:"var(--se-text-3)" }}>
                  <strong style={{ color:"var(--se-text)", fontWeight:700 }}>{products.length}</strong> products shown
                  {pagination.totalPages > 1 && <> · Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong></>}
                </p>
              </div>
            )}

            {/* loading */}
            {loading && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
                {Array.from({length:9}).map((_,i) => <ProductSkeleton key={i} />)}
              </div>
            )}

            {/* error */}
            {!loading && error && (
              <ErrorMessage message={error} onRetry={loadProducts} />
            )}

            {/* empty */}
            {!loading && !error && products.length === 0 && (
              <div style={{ padding:"64px 32px", textAlign:"center", background:"#fff", border:"2px dashed var(--se-border)", borderRadius:20 }}>
                <div style={{ fontSize:52, marginBottom:16 }}>📦</div>
                <h3 style={{ marginBottom:8 }}>No products found</h3>
                <p style={{ marginBottom:20 }}>Try adjusting your search or filters.</p>
                {hasFilters && (
                  <button type="button" className="btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
                )}
              </div>
            )}

            {/* grid */}
            {!loading && !error && products.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
                {products.map((p, i) => <ProductCard key={p._id || p.id || i} product={p} />)}
              </div>
            )}

            {/* pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginTop:40 }}>
                <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => changePage(page-1)}>← Previous</button>

                <div style={{ display:"flex", gap:6 }}>
                  {Array.from({length: pagination.totalPages}, (_,i)=>i+1)
                    .filter(n => n === 1 || n === pagination.totalPages || Math.abs(n-page) <= 2)
                    .reduce((acc, n, i, arr) => {
                      if (i > 0 && n - arr[i-1] > 1) acc.push("…");
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, i) => n === "…"
                      ? <span key={`e${i}`} style={{ display:"flex", alignItems:"center", color:"var(--se-text-4)", padding:"0 4px" }}>…</span>
                      : <button key={n} type="button" onClick={() => changePage(n)}
                          style={{ width:38, height:38, borderRadius:8, border: n===page ? "none" : "1px solid var(--se-border)", background: n===page ? "var(--se-teal)" : "#fff", color: n===page ? "#fff" : "var(--se-text-2)", fontWeight: n===page ? 700 : 500, fontSize:14, cursor:"pointer", boxShadow:"none", transform:"none" }}>
                          {n}
                        </button>
                    )
                  }
                </div>

                <button type="button" className="btn-secondary" disabled={page >= pagination.totalPages} onClick={() => changePage(page+1)}>Next →</button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* responsive: stack sidebar on mobile */}
      <style>{`@media(max-width:860px){div[style*="grid-template-columns: 240px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default ProductsPage;
