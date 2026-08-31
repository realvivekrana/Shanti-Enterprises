// ============================================================
// SHANTI ENTERPRISES
// Products Page
// Frontend Phase 6 - Complete UI/UX
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  getProducts,
} from "../../api/productApi";

import ProductCard from "../../components/customer/ProductCard";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// PRODUCTS PAGE
// ============================================================

function ProductsPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 0,
  });

  // ==========================================================
  // URL FILTERS
  // ==========================================================

  const search =
    searchParams.get(
      "search"
    ) || "";

  const category =
    searchParams.get(
      "category"
    ) || "";

  const sort =
    searchParams.get(
      "sort"
    ) || "";

  const rawPage = Number(
    searchParams.get(
      "page"
    ) || 1
  );

  const page =
    Number.isFinite(
      rawPage
    ) &&
    rawPage >= 1
      ? Math.floor(
          rawPage
        )
      : 1;

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const params = {
            page,
            limit: 12,
          };

          if (
            search.trim()
          ) {
            params.search =
              search.trim();
          }

          if (
            category.trim()
          ) {
            params.category =
              category.trim();
          }

          if (
            sort.trim()
          ) {
            params.sort =
              sort.trim();
          }

          const data =
            await getProducts(
              params
            );

          // ----------------------------------------------------
          // EXTRACT PRODUCTS
          // ----------------------------------------------------

          let productData = [];

          if (
            Array.isArray(
              data
            )
          ) {
            productData =
              data;
          } else if (
            Array.isArray(
              data?.products
            )
          ) {
            productData =
              data.products;
          } else if (
            Array.isArray(
              data?.data
            )
          ) {
            productData =
              data.data;
          } else if (
            Array.isArray(
              data?.data?.products
            )
          ) {
            productData =
              data.data.products;
          }

          setProducts(
            productData
          );

          // ----------------------------------------------------
          // PAGINATION
          // ----------------------------------------------------

          const backendPagination =
            data?.pagination ||
            data?.data
              ?.pagination;

          if (
            backendPagination
          ) {
            const currentPage =
              Number(
                backendPagination.page
              ) || page;

            const limit =
              Number(
                backendPagination.limit
              ) || 12;

            const totalProducts =
              Number(
                backendPagination.totalProducts ??
                  backendPagination.total ??
                  backendPagination.count
              );

            const totalPages =
              Number(
                backendPagination.totalPages
              );

            setPagination({
              page:
                currentPage,

              limit,

              totalProducts:
                Number.isFinite(
                  totalProducts
                )
                  ? totalProducts
                  : productData.length,

              totalPages:
                Number.isFinite(
                  totalPages
                ) &&
                totalPages >= 0
                  ? totalPages
                  : productData.length >
                    0
                    ? 1
                    : 0,
            });
          } else {
            // --------------------------------------------------
            // FALLBACK PAGINATION
            // --------------------------------------------------

            setPagination({
              page,
              limit: 12,
              totalProducts:
                productData.length,
              totalPages:
                productData.length >
                0
                  ? 1
                  : 0,
            });
          }
        } catch (
          err
        ) {
          console.error(
            "Products fetch error:",
            err
          );

          setProducts([]);

          setPagination({
            page,
            limit: 12,
            totalProducts: 0,
            totalPages: 0,
          });

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Unable to load products."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        search,
        category,
        sort,
        page,
      ]
    );

  // ==========================================================
  // LOAD WHEN FILTERS CHANGE
  // ==========================================================

  useEffect(() => {
    loadProducts();
  }, [
    loadProducts,
  ]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget
      );

    const value =
      formData
        .get("search")
        ?.toString()
        .trim() || "";

    const params = {};

    if (value) {
      params.search =
        value;
    }

    if (category) {
      params.category =
        category;
    }

    if (sort) {
      params.sort =
        sort;
    }

    params.page =
      "1";

    setSearchParams(
      params
    );
  };

  // ==========================================================
  // SORT
  // ==========================================================

  const handleSort = (
    event
  ) => {
    const value =
      event.target.value;

    const params = {};

    if (search) {
      params.search =
        search;
    }

    if (category) {
      params.category =
        category;
    }

    if (value) {
      params.sort =
        value;
    }

    params.page =
      "1";

    setSearchParams(
      params
    );
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearchParams({});
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const changePage = (
    nextPage
  ) => {
    if (
      !Number.isFinite(
        nextPage
      )
    ) {
      return;
    }

    const safePage =
      Math.floor(
        nextPage
      );

    if (
      safePage < 1
    ) {
      return;
    }

    if (
      pagination.totalPages >
        0 &&
      safePage >
        pagination.totalPages
    ) {
      return;
    }

    const params = {};

    if (search) {
      params.search =
        search;
    }

    if (category) {
      params.category =
        category;
    }

    if (sort) {
      params.sort =
        sort;
    }

    params.page =
      String(
        safePage
      );

    setSearchParams(
      params
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="products-page">

        <div className="products-container">

          <Loading
            message="Loading products..."
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="products-page">

        <div className="products-container">

          <ErrorMessage
            message={
              error
            }
            onRetry={
              loadProducts
            }
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="products-page">

      <div className="products-container">

        {/* ==================================================
            PAGE HEADER
            ================================================== */}

        <div className="products-page-header">

          <div>

            <span className="products-eyebrow">
              SHOP COLLECTION
            </span>

            <h1>
              Products
            </h1>

            <p>
              Browse our products and
              find what your business needs.
            </p>

          </div>

          <div className="products-count-box">

            <strong>
              {
                pagination.totalProducts
              }
            </strong>

            <span>
              Products
            </span>

          </div>

        </div>

        {/* ==================================================
            FILTER BAR
            ================================================== */}

        <div className="products-filter-card">

          <form
            className="products-search-form"
            onSubmit={
              handleSearch
            }
          >

            <div className="products-search-input-wrapper">

              <span className="products-search-icon">
                🔍
              </span>

              <input
                type="text"
                name="search"
                defaultValue={
                  search
                }
                placeholder="Search products..."
                aria-label="Search products"
                autoComplete="off"
              />

            </div>

            <button
              type="submit"
              className="products-search-button"
            >
              Search
            </button>

          </form>

          <div className="products-filter-actions">

            <label className="products-sort-wrapper">

              <span>
                Sort by
              </span>

              <select
                value={
                  sort
                }
                onChange={
                  handleSort
                }
                aria-label="Sort products"
              >

                <option value="">
                  Default
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

                <option value="newest">
                  Newest
                </option>

              </select>

            </label>

            {(search ||
              category ||
              sort) && (
              <button
                type="button"
                className="products-clear-button"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

        {/* ==================================================
            ACTIVE FILTERS
            ================================================== */}

        {(search ||
          category) && (
          <div className="products-active-filters">

            <span>
              Active filters:
            </span>

            {search && (
              <span className="products-filter-tag">
                Search: {search}
              </span>
            )}

            {category && (
              <span className="products-filter-tag">
                Category: {category}
              </span>
            )}

          </div>
        )}

        {/* ==================================================
            RESULT INFO
            ================================================== */}

        <div className="products-result-header">

          <p>
            Showing{" "}
            <strong>
              {
                products.length
              }
            </strong>{" "}
            products
          </p>

          {pagination.totalPages >
            1 && (
            <p>
              Page{" "}
              <strong>
                {page}
              </strong>{" "}
              of{" "}
              <strong>
                {
                  pagination.totalPages
                }
              </strong>
            </p>
          )}

        </div>

        {/* ==================================================
            PRODUCTS
            ================================================== */}

        {products.length ===
        0 ? (
          <div className="products-empty">

            <EmptyState
              title="No products found"
              message="Try a different search or filter."
            />

            {(search ||
              category ||
              sort) && (
              <button
                type="button"
                className="products-empty-button"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            )}

          </div>
        ) : (
          <div className="products-grid">

            {products.map(
              (
                product,
                index
              ) => {

                const productId =
                  product?._id ||
                  product?.id;

                return (
                  <div
                    className="product-grid-item"
                    key={
                      productId ||
                      `product-${index}`
                    }
                  >

                    <ProductCard
                      product={
                        product
                      }
                    />

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* ==================================================
            PAGINATION
            ================================================== */}

        {pagination.totalPages >
          1 && (
          <div className="products-pagination">

            <button
              type="button"
              className="products-page-button"
              disabled={
                page <= 1
              }
              onClick={() =>
                changePage(
                  page - 1
                )
              }
            >
              ← Previous
            </button>

            <div className="products-page-number">

              Page{" "}

              <strong>
                {page}
              </strong>{" "}

              of{" "}

              <strong>
                {
                  pagination.totalPages
                }
              </strong>

            </div>

            <button
              type="button"
              className="products-page-button"
              disabled={
                page >=
                pagination.totalPages
              }
              onClick={() =>
                changePage(
                  page + 1
                )
              }
            >
              Next →

            </button>

          </div>
        )}

      </div>

    </section>
  );
}

export default ProductsPage;