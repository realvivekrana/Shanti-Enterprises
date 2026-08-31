// ============================================================
// SHANTI ENTERPRISES
// Cart Context
// Frontend Phase 2 - Shopping
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "shanti_enterprises_cart";

// ============================================================
// CART PROVIDER
// ============================================================

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Unable to load cart:", error);

      return [];
    }
  });

  // ==========================================================
  // SAVE CART
  // ==========================================================

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const addToCart = (product, quantity = 1) => {
    if (!product) {
      return;
    }

    const productId = product._id || product.id;

    if (!productId) {
      return;
    }

    const moq =
      Number(
        product.moq ??
          product.minimumOrderQuantity ??
          product.minOrderQuantity ??
          1
      ) || 1;

    const rawStock = Number(
      product.stock ??
        product.quantity ??
        product.inventory ??
        NaN
    );

    const hasStockLimit = Number.isFinite(rawStock);

    const requestedQuantity = Math.max(
      moq,
      Number(quantity) || moq
    );

    const price = Number(
      product.price ??
        product.sellingPrice ??
        product.salePrice ??
        0
    );

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productId
      );

      // ======================================================
      // EXISTING PRODUCT
      // ======================================================

      if (existingItem) {
        const nextQuantity =
          existingItem.quantity + requestedQuantity;

        const cappedQuantity = hasStockLimit
          ? Math.min(nextQuantity, rawStock)
          : nextQuantity;

        return currentItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(
                  moq,
                  cappedQuantity
                ),
              }
            : item
        );
      }

      // ======================================================
      // NEW PRODUCT
      // ======================================================

      return [
        ...currentItems,
        {
          productId,

          name:
            product.name ||
            product.title ||
            "Product",

          price,

          quantity: hasStockLimit
            ? Math.min(
                requestedQuantity,
                rawStock
              )
            : requestedQuantity,

          stock: hasStockLimit
            ? rawStock
            : null,

          image:
            product.images?.[0] ||
            product.image ||
            "",

          moq,
        },
      ];
    });
  };

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.productId === productId
    );

    const moq =
      Number(item?.moq || 1) || 1;

    const stock = Number(item?.stock);

    const hasStockLimit =
      Number.isFinite(stock) &&
      stock >= 0;

    const requested = Math.max(
      moq,
      Number(quantity) || moq
    );

    const newQuantity = hasStockLimit
      ? Math.min(requested, stock)
      : requested;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================================
  // TOTAL ITEMS
  // ==========================================================

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // ==========================================================
  // SUBTOTAL
  // ==========================================================

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    cartItems,
    totalItems,
    subtotal,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================================
// USE CART
// ============================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}