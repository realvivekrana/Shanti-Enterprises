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

const CART_STORAGE_KEY =
  "shanti_enterprises_cart";

// ============================================================
// CART PROVIDER
// ============================================================

export function CartProvider({ children }) {
  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const storedCart =
          localStorage.getItem(
            CART_STORAGE_KEY
          );

        return storedCart
          ? JSON.parse(storedCart)
          : [];
      } catch (error) {
        console.error(
          "Unable to load cart:",
          error
        );

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

  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product) {
      return;
    }

    const productId =
      product._id || product.id;

    if (!productId) {
      return;
    }

    const requestedQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      );

    const price = Number(
      product.price ??
        product.sellingPrice ??
        product.salePrice ??
        0
    );

    setCartItems(
      (currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.productId ===
              productId
          );

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.productId ===
              productId
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      requestedQuantity,
                  }
                : item
          );
        }

        return [
          ...currentItems,
          {
            productId,
            name:
              product.name ||
              product.title ||
              "Product",
            price,
            quantity:
              requestedQuantity,
            image:
              product.images?.[0] ||
              product.image ||
              "",
            moq:
              Number(
                product.moq ??
                  product.minimumOrderQuantity ??
                  product.minOrderQuantity ??
                  1
              ) || 1,
          },
        ];
      }
    );
  };

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const updateQuantity = (
    productId,
    quantity
  ) => {
    const newQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      );

    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                }
              : item
        )
    );
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeFromCart = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.productId !==
            productId
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
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================================
// USE CART
// ============================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}