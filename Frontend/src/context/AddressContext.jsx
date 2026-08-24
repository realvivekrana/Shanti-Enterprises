import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AddressContext =
  createContext(null);

const STORAGE_KEY =
  "shanti_enterprises_addresses";

export function AddressProvider({
  children,
}) {
  const [
    addresses,
    setAddresses,
  ] = useState(() => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      return stored
        ? JSON.parse(stored)
        : [];
    } catch (error) {
      console.error(
        "Unable to load addresses:",
        error
      );

      return [];
    }
  });

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(() => {
    return localStorage.getItem(
      "shanti_selected_address"
    ) || "";
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(addresses)
    );
  }, [addresses]);

  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem(
        "shanti_selected_address",
        selectedAddressId
      );
    } else {
      localStorage.removeItem(
        "shanti_selected_address"
      );
    }
  }, [selectedAddressId]);

  const addAddress = (address) => {
    const newAddress = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
      ...address,
    };

    setAddresses((current) => [
      ...current,
      newAddress,
    ]);

    setSelectedAddressId(
      newAddress.id
    );

    return newAddress;
  };

  const updateAddress = (
    addressId,
    address
  ) => {
    setAddresses((current) =>
      current.map((item) =>
        item.id === addressId
          ? {
              ...item,
              ...address,
            }
          : item
      )
    );
  };

  const deleteAddress = (
    addressId
  ) => {
    setAddresses((current) =>
      current.filter(
        (item) =>
          item.id !== addressId
      )
    );

    if (
      selectedAddressId ===
      addressId
    ) {
      setSelectedAddressId("");
    }
  };

  const selectAddress = (
    addressId
  ) => {
    setSelectedAddressId(
      addressId
    );
  };

  const selectedAddress =
    addresses.find(
      (item) =>
        item.id ===
        selectedAddressId
    ) || null;

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        selectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context =
    useContext(AddressContext);

  if (!context) {
    throw new Error(
      "useAddress must be used inside AddressProvider"
    );
  }

  return context;
}