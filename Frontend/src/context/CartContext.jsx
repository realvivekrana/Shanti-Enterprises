import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const CartContext = createContext();

export const useCart = () =>
  useContext(CartContext);

// ======================================================
// WHOLESALE UNIT PRICE
// ======================================================

const getWholesaleUnitPrice = (
  product,
  quantity
) => {
  const basePrice = Number(
    product.price || 0
  );

  const tiers = [
    ...(product.wholesalePricing || []),
  ].sort(
    (a, b) =>
      Number(a.minQuantity) -
      Number(b.minQuantity)
  );

  let unitPrice = basePrice;

  for (const tier of tiers) {
    const minQuantity =
      Number(tier.minQuantity);

    const maxQuantity =
      tier.maxQuantity === null ||
      tier.maxQuantity === undefined ||
      tier.maxQuantity === ''
        ? null
        : Number(tier.maxQuantity);

    const matches =
      quantity >= minQuantity &&
      (
        maxQuantity === null ||
        quantity <= maxQuantity
      );

    if (matches) {
      unitPrice =
        Number(tier.price);

      break;
    }
  }

  return unitPrice;
};


// ======================================================
// CART PROVIDER
// ======================================================

export const CartProvider = ({
  children,
}) => {

  // ====================================================
  // CART STATE
  // ====================================================

  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            'cartItems'
          );

        return saved
          ? JSON.parse(saved)
          : [];

      } catch (error) {

        console.error(
          'Cart loading error:',
          error
        );

        return [];
      }
    });


  // ====================================================
  // CART ERROR
  // ====================================================

  const [cartError, setCartError] =
    useState('');


  // ====================================================
  // SHIPPING
  // ====================================================

  const SHIPPING_PRICE = 2000;


  // ====================================================
  // SAVE CART
  // ====================================================

  useEffect(() => {

    localStorage.setItem(
      'cartItems',
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  // ====================================================
  // ADD TO CART
  // ====================================================

  const addToCart = (
    product,
    quantity
  ) => {

    const requestedQuantity =
      Number(quantity);

    const moq =
      Number(
        product.moq || 1
      );

    const stock =
      Number(
        product.stock || 0
      );


    // -----------------------------------------------
    // WHOLE NUMBER
    // -----------------------------------------------

    if (
      !Number.isInteger(
        requestedQuantity
      )
    ) {

      setCartError(
        'Quantity must be a whole number.'
      );

      return false;
    }


    // -----------------------------------------------
    // MOQ
    // -----------------------------------------------

    if (
      requestedQuantity < moq
    ) {

      setCartError(
        `Minimum order quantity for ${product.name} is ${moq} pieces.`
      );

      return false;
    }


    // -----------------------------------------------
    // STOCK
    // -----------------------------------------------

    if (
      requestedQuantity > stock
    ) {

      setCartError(
        `Only ${stock} pieces of ${product.name} are available.`
      );

      return false;
    }


    setCartError('');


    // -----------------------------------------------
    // UPDATE CART
    // -----------------------------------------------

    setCartItems((prev) => {

      const existing =
        prev.find(
          (item) =>
            item._id ===
            product._id
        );


      // =============================================
      // PRODUCT ALREADY IN CART
      // =============================================

      if (existing) {

        const newQuantity =
          Number(
            existing.quantity
          ) +
          requestedQuantity;


        if (
          newQuantity < moq
        ) {

          setCartError(
            `Minimum order quantity for ${product.name} is ${moq} pieces.`
          );

          return prev;
        }


        if (
          newQuantity > stock
        ) {

          setCartError(
            `Only ${stock} pieces of ${product.name} are available.`
          );

          return prev;
        }


        return prev.map(
          (item) =>
            item._id ===
            product._id
              ? {

                  ...item,

                  quantity:
                    newQuantity,

                  price:
                    Number(
                      product.price ||
                      item.price ||
                      0
                    ),

                  moq:
                    Number(
                      product.moq ||
                      item.moq ||
                      1
                    ),

                  stock:
                    Number(
                      product.stock ??
                      item.stock ??
                      0
                    ),

                  gst:
                    Number(
                      product.gst ||
                      0
                    ),

                  wholesalePricing:
                    product.wholesalePricing ||
                    [],
                }

              : item
        );
      }


      // =============================================
      // NEW PRODUCT
      // =============================================

      return [

        ...prev,

        {

          _id:
            product._id,

          name:
            product.name,

          price:
            Number(
              product.price || 0
            ),

          image:
            product.images?.[0] ||
            product.image ||
            '',

          images:
            product.images ||
            [],

          quantity:
            requestedQuantity,

          moq:
            Number(
              product.moq || 1
            ),

          stock:
            Number(
              product.stock || 0
            ),

          gst:
            Number(
              product.gst || 0
            ),

          wholesalePricing:
            product.wholesalePricing ||
            [],
        },
      ];
    });


    return true;
  };


  // ====================================================
  // ADD REORDER ITEMS
  // ====================================================
  //
  // Backend se aaye reorderItems ko cart me add karta hai.
  //
  // Agar product already cart me hai:
  // current cart quantity + reorder quantity
  //
  // Agar product cart me nahi hai:
  // new cart item
  //
  // ====================================================

  const addReorderItems = (
    reorderItems
  ) => {

    if (
      !Array.isArray(
        reorderItems
      ) ||
      reorderItems.length === 0
    ) {

      setCartError(
        'No products available for reorder.'
      );

      return {
        success: false,
        addedItems: [],
        skippedItems: [],
      };
    }


    const addedItems = [];

    const skippedItems = [];


    setCartItems((previousCart) => {

      const updatedCart =
        [...previousCart];


      // =============================================
      // PROCESS EVERY REORDER ITEM
      // =============================================

      for (
        const reorderItem
        of reorderItems
      ) {

        const productId =
          reorderItem.product ||
          reorderItem._id;


        const quantity =
          Number(
            reorderItem.quantity
          );


        const stock =
          Number(
            reorderItem.stock || 0
          );


        const moq =
          Number(
            reorderItem.moq || 1
          );


        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (!productId) {

          skippedItems.push({

            item:
              reorderItem,

            reason:
              'Product ID missing',
          });

          continue;
        }


        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {

          skippedItems.push({

            item:
              reorderItem,

            reason:
              'Invalid quantity',
          });

          continue;
        }


        if (
          quantity < moq
        ) {

          skippedItems.push({

            item:
              reorderItem,

            reason:
              `Minimum order quantity is ${moq}`,
          });

          continue;
        }


        if (
          stock < quantity
        ) {

          skippedItems.push({

            item:
              reorderItem,

            reason:
              `Only ${stock} pieces available`,
          });

          continue;
        }


        // =========================================
        // FIND EXISTING CART ITEM
        // =========================================

        const existingIndex =
          updatedCart.findIndex(
            (item) =>
              item._id ===
              productId
          );


        // =========================================
        // EXISTING PRODUCT
        // =========================================

        if (
          existingIndex !== -1
        ) {

          const existingItem =
            updatedCart[
              existingIndex
            ];


          const existingQuantity =
            Number(
              existingItem.quantity || 0
            );


          const newQuantity =
            existingQuantity +
            quantity;


          // ---------------------------------------
          // CHECK NEW QUANTITY
          // ---------------------------------------

          if (
            newQuantity < moq
          ) {

            skippedItems.push({

              item:
                reorderItem,

              reason:
                `Minimum order quantity is ${moq}`,
            });

            continue;
          }


          if (
            newQuantity > stock
          ) {

            skippedItems.push({

              item:
                reorderItem,

              reason:
                `Cart quantity would exceed available stock (${stock})`,
            });

            continue;
          }


          // ---------------------------------------
          // UPDATE EXISTING ITEM
          // ---------------------------------------

          updatedCart[
            existingIndex
          ] = {

            ...existingItem,

            quantity:
              newQuantity,

            price:
              Number(
                reorderItem.price ??
                existingItem.price ??
                0
              ),

            stock,

            moq,

            gst:
              Number(
                reorderItem.gst ??
                existingItem.gst ??
                0
              ),

            wholesalePricing:
              reorderItem.wholesalePricing ||
              existingItem.wholesalePricing ||
              [],
          };


          addedItems.push({

            productId,

            quantity:
              quantity,

            totalQuantity:
              newQuantity,

            action:
              'updated',
          });


          continue;
        }


        // =========================================
        // NEW PRODUCT
        // =========================================

        updatedCart.push({

          _id:
            productId,

          name:
            reorderItem.name ||
            '',

          price:
            Number(
              reorderItem.price || 0
            ),

          image:
            reorderItem.images?.[0] ||
            reorderItem.image ||
            '',

          images:
            reorderItem.images ||
            [],

          quantity,

          moq,

          stock,

          gst:
            Number(
              reorderItem.gst || 0
            ),

          wholesalePricing:
            reorderItem.wholesalePricing ||
            [],

        });


        addedItems.push({

          productId,

          quantity,

          totalQuantity:
            quantity,

          action:
            'added',
        });
      }


      return updatedCart;
    });


    // =============================================
    // CLEAR ERROR IF SOMETHING WAS ADDED
    // =============================================

    if (
      addedItems.length > 0
    ) {

      setCartError('');

    } else {

      setCartError(
        'No reorder products could be added to cart.'
      );
    }


    return {

      success:
        addedItems.length > 0,

      addedItems,

      skippedItems,
    };
  };


  // ====================================================
  // REMOVE FROM CART
  // ====================================================

  const removeFromCart = (
    productId
  ) => {

    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item._id !==
          productId
      )
    );

    setCartError('');
  };


  // ====================================================
  // UPDATE QUANTITY
  // ====================================================

  const updateQuantity = (
    productId,
    quantity
  ) => {

    const requestedQuantity =
      Number(quantity);


    const item =
      cartItems.find(
        (cartItem) =>
          cartItem._id ===
          productId
      );


    if (!item) {
      return false;
    }


    const moq =
      Number(
        item.moq || 1
      );


    const stock =
      Number(
        item.stock || 0
      );


    // -----------------------------------------------
    // WHOLE NUMBER
    // -----------------------------------------------

    if (
      !Number.isInteger(
        requestedQuantity
      )
    ) {

      setCartError(
        'Quantity must be a whole number.'
      );

      return false;
    }


    // -----------------------------------------------
    // MOQ
    // -----------------------------------------------

    if (
      requestedQuantity < moq
    ) {

      setCartError(
        `Minimum order quantity for ${item.name} is ${moq} pieces.`
      );

      return false;
    }


    // -----------------------------------------------
    // STOCK
    // -----------------------------------------------

    if (
      requestedQuantity > stock
    ) {

      setCartError(
        `Only ${stock} pieces of ${item.name} are available.`
      );

      return false;
    }


    setCartError('');


    setCartItems((prev) =>
      prev.map(
        (cartItem) =>
          cartItem._id ===
          productId
            ? {

                ...cartItem,

                quantity:
                  requestedQuantity,

              }

            : cartItem
      )
    );


    return true;
  };


  // ====================================================
  // CLEAR CART
  // ====================================================

  const clearCart = () => {

    setCartItems([]);

    setCartError('');
  };


  // ====================================================
  // CART COUNT
  // ====================================================

  const cartCount =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ),

      0
    );


  // ====================================================
  // ITEM PRICING
  // ====================================================

  const getItemPricing = (
    item
  ) => {

    const quantity =
      Number(
        item.quantity || 0
      );


    const baseUnitPrice =
      Number(
        item.price || 0
      );


    const wholesaleUnitPrice =
      getWholesaleUnitPrice(
        item,
        quantity
      );


    const baseSubtotal =
      baseUnitPrice *
      quantity;


    const subtotal =
      wholesaleUnitPrice *
      quantity;


    const bulkDiscount =
      Math.max(
        0,

        baseSubtotal -
        subtotal
      );


    const gstRate =
      Number(
        item.gst || 0
      );


    const gstAmount =
      (
        subtotal *
        gstRate
      ) /
      100;


    return {

      quantity,

      baseUnitPrice,

      wholesaleUnitPrice,

      baseSubtotal,

      subtotal,

      bulkDiscount,

      gstRate,

      gstAmount,

      totalBeforeShipping:
        subtotal +
        gstAmount,
    };
  };


  // ====================================================
  // CART SUMMARY
  // ====================================================

  const cartSummary =
    cartItems.reduce(
      (
        summary,
        item
      ) => {

        const pricing =
          getItemPricing(
            item
          );


        summary.baseSubtotal +=
          pricing.baseSubtotal;


        summary.subtotal +=
          pricing.subtotal;


        summary.bulkDiscount +=
          pricing.bulkDiscount;


        summary.gst +=
          pricing.gstAmount;


        return summary;
      },

      {

        baseSubtotal:
          0,

        subtotal:
          0,

        bulkDiscount:
          0,

        gst:
          0,
      }
    );


  // ====================================================
  // SHIPPING PRICE
  // ====================================================

  const shippingPrice =
    cartItems.length > 0
      ? SHIPPING_PRICE
      : 0;


  // ====================================================
  // CART TOTAL
  // ====================================================

  const cartTotal =
    cartSummary.subtotal +
    cartSummary.gst +
    shippingPrice;


  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <CartContext.Provider
      value={{

        // ---------------------------------------------
        // CART
        // ---------------------------------------------

        cartItems,

        cartCount,

        cartTotal,

        cartError,

        shippingPrice,


        // ---------------------------------------------
        // CART ACTIONS
        // ---------------------------------------------

        addToCart,

        addReorderItems,

        removeFromCart,

        updateQuantity,

        clearCart,


        // ---------------------------------------------
        // PRICING
        // ---------------------------------------------

        getItemPricing,

        cartSummary,


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        setCartError,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};