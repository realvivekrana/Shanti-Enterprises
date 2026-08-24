// ============================================================
// SHANTI ENTERPRISES
// Products Page
// Frontend Phase 2 - Shopping
// ============================================================

import {
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

  const search =
    searchParams.get("search") || "";

  const category =
    searchParams.get("category") || "";

  const sort =
    searchParams.get("sort") || "";

  const page = Number(
    searchParams.get("page") || 1
  );

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
      };

      if (search.trim()) {
        params.search =
          search.trim();
      }

      if (category.trim()) {
        params.category =
          category.trim();
      }

      if (sort.trim()) {
        params.sort =
          sort.trim();
      }

      const data =
        await getProducts(params);

      let productData = [];

      if (Array.isArray(data)) {
        productData = data;
      } else if (
        Array.isArray(data?.products)
      ) {
        productData =
          data.products;
      } else if (
        Array.isArray(data?.data)
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

      setProducts(productData);

      if (data?.pagination) {
        setPagination({
          page:
            data.pagination.page ||
            page,

          limit:
            data.pagination.limit ||
            12,

          totalProducts:
            data.pagination.totalProducts ||
            0,

          totalPages:
            data.pagination.totalPages ||
            0,
        });
      }
    } catch (err) {
      console.error(
        "Products fetch error:",
        err
      );

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD WHEN FILTERS CHANGE
  // ==========================================================

  useEffect(() => {
    loadProducts();
  }, [
    search,
    category,
    sort,
    page,
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
      params.search = value;
    }

    if (category) {
      params.category =
        category;
    }

    if (sort) {
      params.sort = sort;
    }

    params.page = "1";

    setSearchParams(params);
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
      params.sort = value;
    }

    params.page = "1";

    setSearchParams(params);
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
      nextPage < 1 ||
      (
        pagination.totalPages > 0 &&
        nextPage >
          pagination.totalPages
      )
    ) {
      return;
    }

    const params = {};

    if (search) {
      params.search = search;
    }

    if (category) {
      params.category =
        category;
    }

    if (sort) {
      params.sort = sort;
    }

    params.page =
      String(nextPage);

    setSearchParams(params);
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading products..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadProducts}
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section>

      <h1>
        Products
      </h1>

      <p>
        Browse and search available
        products.
      </p>

      {/* ==================================================
          SEARCH
          ================================================== */}

      <form
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search products..."
        />

        <button
          type="submit"
        >
          Search
        </button>
      </form>

      {/* ==================================================
          CATEGORY
          ================================================== */}

      {category && (
        <p>
          Category: {category}
        </p>
      )}

      {/* ==================================================
          SORT
          ================================================== */}

      <label>
        Sort:

        <select
          value={sort}
          onChange={handleSort}
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

      {/* ==================================================
          CLEAR
          ================================================== */}

      {(search ||
        category ||
        sort) && (
        <button
          type="button"
          onClick={
            clearFilters
          }
        >
          Clear Filters
        </button>
      )}

      {/* ==================================================
          RESULT COUNT
          ================================================== */}

      <p>
        Total Products:{" "}
        {pagination.totalProducts}
      </p>

      {/* ==================================================
          PRODUCTS
          ================================================== */}

      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try a different search or filter."
        />
      ) : (
        <div>
          {products.map(
            (product) => (
              <ProductCard
                key={
                  product._id ||
                  product.id
                }
                product={product}
              />
            )
          )}
        </div>
      )}

      {/* ==================================================
          PAGINATION
          ================================================== */}

      {pagination.totalPages > 1 && (
        <div>

          <button
            type="button"
            disabled={
              page <= 1
            }
            onClick={() =>
              changePage(
                page - 1
              )
            }
          >
            Previous
          </button>

          <span>
            {" "}
            Page {page} of{" "}
            {
              pagination.totalPages
            }{" "}
          </span>

          <button
            type="button"
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
            Next
          </button>

        </div>
      )}

    </section>
  );
}

export default ProductsPage;