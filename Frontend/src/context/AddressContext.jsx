// ============================================================
// SHANTI ENTERPRISES
// Address Context
// Frontend - Customer Saved Addresses
// MongoDB Backend Connected
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../api/addressApi";

// ============================================================
// CONTEXT
// ============================================================

const AddressContext =
  createContext(null);

// ============================================================
// STORAGE KEY
// ============================================================

const SELECTED_ADDRESS_KEY =
  "shanti_selected_address";

// ============================================================
// ADDRESS PROVIDER
// ============================================================

export function AddressProvider({
  children,
}) {
  // ==========================================================
  // ADDRESSES
  // ==========================================================

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  // ==========================================================
  // LOADING
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==========================================================
  // ERROR
  // ==========================================================

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // SELECTED ADDRESS
  // ==========================================================

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(() => {
    return (
      localStorage.getItem(
        SELECTED_ADDRESS_KEY
      ) || ""
    );
  });

  // ==========================================================
  // LOAD ADDRESSES
  // ==========================================================

  const loadAddresses =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyAddresses();

        const receivedAddresses =
          response?.addresses ||
          response?.data?.addresses ||
          response?.data ||
          [];

        const addressList =
          Array.isArray(
            receivedAddresses
          )
            ? receivedAddresses
            : [];

        setAddresses(
          addressList
        );

        // ------------------------------------------------------
        // CHECK EXISTING SELECTED ADDRESS
        // ------------------------------------------------------

        const storedSelectedId =
          localStorage.getItem(
            SELECTED_ADDRESS_KEY
          );

        const storedAddressExists =
          addressList.some(
            (address) =>
              String(
                address?._id ||
                  address?.id
              ) ===
              String(
                storedSelectedId
              )
          );

        if (
          storedSelectedId &&
          storedAddressExists
        ) {
          setSelectedAddressId(
            storedSelectedId
          );

          return;
        }

        // ------------------------------------------------------
        // FIND DEFAULT ADDRESS
        // ------------------------------------------------------

        const defaultAddress =
          addressList.find(
            (address) =>
              address?.isDefault ===
              true
          );

        if (defaultAddress) {
          const defaultId =
            defaultAddress?._id ||
            defaultAddress?.id ||
            "";

          setSelectedAddressId(
            String(defaultId)
          );

          return;
        }

        // ------------------------------------------------------
        // NO SELECTED ADDRESS
        // ------------------------------------------------------

        setSelectedAddressId("");
      } catch (err) {
        console.error(
          "Load addresses error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to load saved addresses."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadAddresses();
  }, []);

  // ==========================================================
  // STORE SELECTED ADDRESS
  // ==========================================================

  useEffect(() => {
    if (
      selectedAddressId
    ) {
      localStorage.setItem(
        SELECTED_ADDRESS_KEY,
        selectedAddressId
      );
    } else {
      localStorage.removeItem(
        SELECTED_ADDRESS_KEY
      );
    }
  }, [
    selectedAddressId,
  ]);

  // ==========================================================
  // ADD ADDRESS
  // ==========================================================

  const addAddress =
    async (
      address
    ) => {
      try {
        setError("");

        const response =
          await createAddress(
            address
          );

        const newAddress =
          response?.address ||
          response?.data?.address ||
          response?.data ||
          null;

        if (!newAddress) {
          throw new Error(
            "Address was created but no address data was returned."
          );
        }

        setAddresses(
          (current) => [
            ...current,
            newAddress,
          ]
        );

        const newAddressId =
          newAddress?._id ||
          newAddress?.id;

        if (newAddressId) {
          setSelectedAddressId(
            String(
              newAddressId
            )
          );
        }

        return newAddress;
      } catch (err) {
        console.error(
          "Add address error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to add address.";

        setError(message);

        throw err;
      }
    };

  // ==========================================================
  // UPDATE ADDRESS
  // ==========================================================

  const updateAddress =
    async (
      addressId,
      address
    ) => {
      try {
        setError("");

        if (!addressId) {
          throw new Error(
            "Address ID is missing."
          );
        }

        const response =
          await updateAddressApi(
            addressId,
            address
          );

        const updatedAddress =
          response?.address ||
          response?.data?.address ||
          response?.data ||
          null;

        if (
          !updatedAddress
        ) {
          throw new Error(
            "Address was updated but no address data was returned."
          );
        }

        setAddresses(
          (current) =>
            current.map(
              (item) => {
                const itemId =
                  item?._id ||
                  item?.id;

                return String(
                  itemId
                ) ===
                  String(
                    addressId
                  )
                  ? {
                      ...item,
                      ...updatedAddress,
                    }
                  : item;
              }
            )
        );

        return updatedAddress;
      } catch (err) {
        console.error(
          "Update address error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to update address.";

        setError(message);

        throw err;
      }
    };

  // ==========================================================
  // DELETE ADDRESS
  // ==========================================================

  const removeAddress =
    async (
      addressId
    ) => {
      try {
        setError("");

        if (!addressId) {
          throw new Error(
            "Address ID is missing."
          );
        }

        await deleteAddress(
          addressId
        );

        setAddresses(
          (current) =>
            current.filter(
              (item) => {
                const itemId =
                  item?._id ||
                  item?.id;

                return (
                  String(
                    itemId
                  ) !==
                  String(
                    addressId
                  )
                );
              }
            )
        );

        if (
          String(
            selectedAddressId
          ) ===
          String(addressId)
        ) {
          setSelectedAddressId("");

          // ----------------------------------------------------
          // SELECT NEXT AVAILABLE ADDRESS
          // ----------------------------------------------------

          setAddresses(
            (current) => {
              const nextAddress =
                current.find(
                  (item) => {
                    const itemId =
                      item?._id ||
                      item?.id;

                    return (
                      String(
                        itemId
                      ) !==
                      String(
                        addressId
                      )
                    );
                  }
                );

              if (nextAddress) {
                const nextId =
                  nextAddress?._id ||
                  nextAddress?.id;

                if (nextId) {
                  setSelectedAddressId(
                    String(
                      nextId
                    )
                  );
                }
              }

              return current;
            }
          );
        }
      } catch (err) {
        console.error(
          "Delete address error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to delete address.";

        setError(message);

        throw err;
      }
    };

  // ==========================================================
  // SET DEFAULT ADDRESS
  // ==========================================================

  const selectAddress =
    async (
      addressId
    ) => {
      try {
        setError("");

        if (!addressId) {
          throw new Error(
            "Address ID is missing."
          );
        }

        const response =
          await setDefaultAddress(
            addressId
          );

        const updatedAddress =
          response?.address ||
          response?.data?.address ||
          response?.data ||
          null;

        setAddresses(
          (current) =>
            current.map(
              (item) => {
                const itemId =
                  item?._id ||
                  item?.id;

                return {
                  ...item,
                  isDefault:
                    String(
                      itemId
                    ) ===
                    String(
                      addressId
                    ),
                };
              }
            )
        );

        setSelectedAddressId(
          String(addressId)
        );

        return updatedAddress;
      } catch (err) {
        console.error(
          "Select address error:",
          err
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to select address.";

        setError(message);

        throw err;
      }
    };

  // ==========================================================
  // SELECTED ADDRESS
  // ==========================================================

  const selectedAddress =
    addresses.find(
      (item) => {
        const itemId =
          item?._id ||
          item?.id;

        return (
          String(
            itemId
          ) ===
          String(
            selectedAddressId
          )
        );
      }
    ) || null;

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError =
    () => {
      setError("");
    };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  return (
    <AddressContext.Provider
      value={{
        addresses,

        selectedAddress,

        selectedAddressId,

        loading,

        error,

        addAddress,

        updateAddress,

        deleteAddress:
          removeAddress,

        selectAddress,

        loadAddresses,

        clearError,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

// ============================================================
// USE ADDRESS
// ============================================================

export function useAddress() {
  const context =
    useContext(
      AddressContext
    );

  if (!context) {
    throw new Error(
      "useAddress must be used inside AddressProvider"
    );
  }

  return context;
}