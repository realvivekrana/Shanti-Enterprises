// ============================================================
// SHANTI ENTERPRISES — ProductsPage
// Premium • Mobile First • Responsive
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import ProductCard from "../../components/customer/ProductCard";
import ErrorMessage from "../../components/common/ErrorMessage";

import "./ProductsPage.css";

// ============================================================
// PRODUCT SKELETON
// ============================================================

function ProductSkeleton() {
  return (
    <div className="products-skeleton-card">
      <div className="products-skeleton-image" />

      <div className="products-skeleton-content">
        <div className="products-skeleton-line products-skeleton-line--small" />
        <div className="products-skeleton-line products-skeleton-line--title" />
        <div className="products-skeleton-line products-skeleton-line--price" />

        <div className="products-skeleton-button" />
      </div>
    </div>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function getPaginationItems(currentPage, totalPages) {
  if (!totalPages || totalPages <= 1) {
    return [];
  }

  const pages = [];

  for (let i = 1; i <= totalPages; i += 1) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 2
    ) {
      pages.push(i);
    }
  }

  return pages.reduce((result, page, index, array) => {
    if (
      index > 0 &&
      page - array[index - 1] > 1
    ) {
      result.push("...");
    }

    result.push(page);

    return result;
  }, []);
}

// ============================================================
// PRODUCTS PAGE
// ============================================================

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 0,
  });

  // ==========================================================
  // URL PARAMETERS
  // ==========================================================

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const rawPage = Number(searchParams.get("page") || 1);

  const page =
    Number.isFinite(rawPage) && rawPage >= 1
      ? Math.floor(rawPage)
      : 1;

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (!mounted) {
          return;
        }

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.categories)
            ? response.categories
            : Array.isArray(response?.data?.categories)
              ? response.data.categories
              : [];

        setCategories(list);
      } catch {
        if (mounted) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category.trim()) {
        params.category = category.trim();
      }

      if (sort.trim()) {
        params.sort = sort.trim();
      }

      const data = await getProducts(params);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data?.products)
            ? data.data.products
            : [];

      setProducts(list);

      const pg =
        data?.pagination ||
        data?.data?.pagination;

      if (pg) {
        setPagination({
          page: Number(pg.page) || page,
          limit: Number(pg.limit) || 12,
          totalProducts:
            Number(
              pg.totalProducts ??
                pg.total ??
                list.length
            ) || 0,
          totalPages:
            Number(pg.totalPages) ||
            (list.length > 0 ? 1 : 0),
        });
      } else {
        setPagination({
          page,
          limit: 12,
          totalProducts: list.length,
          totalPages: list.length > 0 ? 1 : 0,
        });
      }
    } catch (err) {
      setProducts([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ==========================================================
  // URL PARAMETER HELPER
  // ==========================================================

  const setParam = (updates) => {
    const params = {};

    if (search) {
      params.search = search;
    }

    if (category) {
      params.category = category;
    }

    if (sort) {
      params.sort = sort;
    }

    params.page = "1";

    const finalParams = {
      ...params,
      ...updates,
    };

    Object.keys(finalParams).forEach((key) => {
      if (
        finalParams[key] === undefined ||
        finalParams[key] === null ||
        finalParams[key] === ""
      ) {
        delete finalParams[key];
      }
    });

    setSearchParams(finalParams);
  };

  // ==========================================================
  // PAGE CHANGE
  // ==========================================================

  const changePage = (nextPage) => {
    if (
      !Number.isFinite(nextPage) ||
      nextPage < 1 ||
      (pagination.totalPages > 0 &&
        nextPage > pagination.totalPages)
    ) {
      return;
    }

    setParam({
      page: String(nextPage),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  // ==========================================================
  // ACTIVE FILTERS
  // ==========================================================

  const hasFilters = Boolean(
    search || category || sort
  );

  const selectedCategory = categories.find(
    (cat) =>
      (cat?._id || cat?.id)?.toString() ===
      category.toString()
  );

  const selectedCategoryName =
    selectedCategory?.name || "Category";

  const paginationItems = getPaginationItems(
    page,
    pagination.totalPages
  );

  // ==========================================================
  // FILTER PANEL
  // ==========================================================

  const filterPanel = (
    <div className="products-filter-panel">
      {/* SEARCH */}
      <div className="products-filter-card">
        <div className="products-filter-heading">
          <Search size={16} />

          <span>Search Products</span>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(
              event.currentTarget
            );

            const value =
              formData
                .get("search")
                ?.toString()
                .trim() || "";

            setParam({
              search: value || undefined,
              page: "1",
            });

            setMobileFiltersOpen(false);
          }}
        >
          <div className="products-search-field">
            <Search size={16} />

            <input
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search products..."
              aria-label="Search products"
            />

            {search && (
              <button
                type="button"
                className="products-search-clear"
                onClick={() =>
                  setParam({
                    search: undefined,
                  })
                }
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="products-filter-search-button"
          >
            Search Products
          </button>
        </form>
      </div>

      {/* SORT */}
      <div className="products-filter-card">
        <div className="products-filter-heading">
          <SlidersHorizontal size={16} />

          <span>Sort By</span>
        </div>

        <select
          value={sort}
          onChange={(event) => {
            setParam({
              sort:
                event.target.value || undefined,
            });

            setMobileFiltersOpen(false);
          }}
          className="products-sort-select"
          aria-label="Sort products"
        >
          <option value="">Default</option>
          <option value="price_asc">
            Price: Low → High
          </option>
          <option value="price_desc">
            Price: High → Low
          </option>
          <option value="newest">
            Newest First
          </option>
        </select>
      </div>

      {/* CATEGORY */}
      {categories.length > 0 && (
        <div className="products-filter-card">
          <div className="products-filter-heading">
            <Package size={16} />

            <span>Categories</span>
          </div>

          <div className="products-category-list">
            <button
              type="button"
              className={`products-category-button ${
                !category
                  ? "products-category-button--active"
                  : ""
              }`}
              onClick={() => {
                setParam({
                  category: undefined,
                });

                setMobileFiltersOpen(false);
              }}
            >
              <span>All Categories</span>

              {!category && (
                <span className="products-category-check">
                  ✓
                </span>
              )}
            </button>

            {categories.map((cat) => {
              const id = cat?._id || cat?.id;

              if (!id) {
                return null;
              }

              const active =
                category.toString() ===
                id.toString();

              return (
                <button
                  key={id}
                  type="button"
                  className={`products-category-button ${
                    active
                      ? "products-category-button--active"
                      : ""
                  }`}
                  onClick={() => {
                    setParam({
                      category: id,
                    });

                    setMobileFiltersOpen(false);
                  }}
                >
                  <span>
                    {cat?.name || "Unnamed Category"}
                  </span>

                  {active && (
                    <span className="products-category-check">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CLEAR FILTERS */}
      {hasFilters && (
        <button
          type="button"
          className="products-clear-button"
          onClick={clearFilters}
        >
          <X size={15} />

          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="products-page">
      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="products-hero">
        <div className="products-container">
          <div className="products-hero-content">
            <div className="products-hero-eyebrow">
              <Sparkles size={14} />

              <span>Shanti Enterprises</span>
            </div>

            <h1>Explore Our Products</h1>

            <p>
              Discover quality products for your
              business with reliable sourcing,
              competitive pricing, and convenient
              ordering.
            </p>

            <div className="products-hero-meta">
              <div className="products-hero-meta-item">
                <Package size={16} />

                <span>
                  {pagination.totalProducts > 0
                    ? `${pagination.totalProducts} products`
                    : "Complete catalogue"}
                </span>
              </div>

              <div className="products-hero-meta-divider" />

              <div className="products-hero-meta-item">
                <Filter size={16} />

                <span>
                  {hasFilters
                    ? "Filters applied"
                    : "Browse all"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <section className="products-content">
        <div className="products-container">
          {/* MOBILE FILTER BUTTON */}

          <button
            type="button"
            className="products-mobile-filter-button"
            onClick={() =>
              setMobileFiltersOpen(
                (current) => !current
              )
            }
            aria-expanded={mobileFiltersOpen}
          >
            <span>
              <Filter size={17} />

              {mobileFiltersOpen
                ? "Hide Filters"
                : "Filters & Sort"}
            </span>

            {hasFilters && (
              <span className="products-filter-count">
                Active
              </span>
            )}
          </button>

          {/* MOBILE FILTER PANEL */}

          {mobileFiltersOpen && (
            <div className="products-mobile-filter-wrapper">
              {filterPanel}
            </div>
          )}

          <div className="products-layout">
            {/* ==================================================
                DESKTOP SIDEBAR
                ================================================== */}

            <aside className="products-sidebar">
              {filterPanel}
            </aside>

            {/* ==================================================
                PRODUCTS AREA
                ================================================== */}

            <div className="products-main">
              {/* ACTIVE FILTERS */}

              {hasFilters && (
                <div className="products-active-filters">
                  <div className="products-active-filters-label">
                    <Filter size={14} />

                    <span>Active Filters</span>
                  </div>

                  <div className="products-filter-chips">
                    {search && (
                      <span className="products-filter-chip products-filter-chip--search">
                        <Search size={13} />

                        <span>
                          "{search}"
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setParam({
                              search:
                                undefined,
                            })
                          }
                          aria-label="Remove search filter"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    )}

                    {category && (
                      <span className="products-filter-chip products-filter-chip--category">
                        <Package size={13} />

                        <span>
                          {selectedCategoryName}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setParam({
                              category:
                                undefined,
                            })
                          }
                          aria-label="Remove category filter"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    )}

                    {sort && (
                      <span className="products-filter-chip products-filter-chip--sort">
                        <SlidersHorizontal
                          size={13}
                        />

                        <span>
                          {sort ===
                          "price_asc"
                            ? "Price: Low → High"
                            : sort ===
                                "price_desc"
                              ? "Price: High → Low"
                              : "Newest First"}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setParam({
                              sort:
                                undefined,
                            })
                          }
                          aria-label="Remove sort filter"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* RESULT HEADER */}

              {!loading && !error && (
                <div className="products-result-header">
                  <div>
                    <p className="products-result-title">
                      <strong>
                        {pagination.totalProducts}
                      </strong>{" "}
                      products available
                    </p>

                    <p className="products-result-subtitle">
                      {products.length > 0
                        ? `Showing ${products.length} products on this page`
                        : "No products to display"}
                    </p>
                  </div>

                  {pagination.totalPages > 1 && (
                    <span className="products-page-indicator">
                      Page {page} of{" "}
                      {pagination.totalPages}
                    </span>
                  )}
                </div>
              )}

              {/* LOADING */}

              {loading && (
                <div className="products-grid">
                  {Array.from({
                    length: 9,
                  }).map((_, index) => (
                    <ProductSkeleton
                      key={index}
                    />
                  ))}
                </div>
              )}

              {/* ERROR */}

              {!loading && error && (
                <div className="products-state">
                  <ErrorMessage
                    message={error}
                    onRetry={loadProducts}
                  />
                </div>
              )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                products.length === 0 && (
                  <div className="products-empty">
                    <div className="products-empty-icon">
                      <Package size={34} />
                    </div>

                    <span className="products-empty-eyebrow">
                      No Results
                    </span>

                    <h2>
                      No products found
                    </h2>

                    <p>
                      We couldn't find any
                      products matching your
                      current search or filters.
                      Try changing your
                      selection.
                    </p>

                    {hasFilters && (
                      <button
                        type="button"
                        className="products-empty-button"
                        onClick={clearFilters}
                      >
                        <X size={16} />

                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}

              {/* PRODUCTS */}

              {!loading &&
                !error &&
                products.length > 0 && (
                  <div className="products-grid">
                    {products.map(
                      (product, index) => (
                        <ProductCard
                          key={
                            product?._id ||
                            product?.id ||
                            index
                          }
                          product={product}
                        />
                      )
                    )}
                  </div>
                )}

              {/* PAGINATION */}

              {!loading &&
                !error &&
                pagination.totalPages > 1 && (
                  <nav
                    className="products-pagination"
                    aria-label="Product pagination"
                  >
                    <button
                      type="button"
                      className="products-pagination-button products-pagination-button--previous"
                      disabled={page <= 1}
                      onClick={() =>
                        changePage(page - 1)
                      }
                    >
                      <ChevronLeft size={17} />

                      <span>Previous</span>
                    </button>

                    <div className="products-pagination-pages">
                      {paginationItems.map(
                        (item, index) => {
                          if (item === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="products-pagination-ellipsis"
                              >
                                …
                              </span>
                            );
                          }

                          return (
                            <button
                              key={item}
                              type="button"
                              className={`products-pagination-page ${
                                item === page
                                  ? "products-pagination-page--active"
                                  : ""
                              }`}
                              onClick={() =>
                                changePage(
                                  item
                                )
                              }
                              aria-current={
                                item === page
                                  ? "page"
                                  : undefined
                              }
                            >
                              {item}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      type="button"
                      className="products-pagination-button products-pagination-button--next"
                      disabled={
                        page >=
                        pagination.totalPages
                      }
                      onClick={() =>
                        changePage(page + 1)
                      }
                    >
                      <span>Next</span>

                      <ChevronRight size={17} />
                    </button>
                  </nav>
                )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductsPage;