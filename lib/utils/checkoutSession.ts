import type { Address } from "@/types/address";

export type PackagingOption = "standard" | "gift";

const CHECKOUT_ADDRESS_KEY = "checkout-address";
const CHECKOUT_PACKAGING_KEY = "checkout-packaging";

const canUseStorage = () => typeof window !== "undefined";

export const getStoredCheckoutAddress = (): Address | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(CHECKOUT_ADDRESS_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Address;
  } catch {
    return null;
  }
};

export const setStoredCheckoutAddress = (address: Address) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    CHECKOUT_ADDRESS_KEY,
    JSON.stringify(address)
  );
};

export const getStoredPackagingOption = (): PackagingOption => {
  if (!canUseStorage()) {
    return "standard";
  }

  const value = window.localStorage.getItem(CHECKOUT_PACKAGING_KEY);

  return value === "gift" ? "gift" : "standard";
};

export const setStoredPackagingOption = (option: PackagingOption) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_PACKAGING_KEY, option);
};

export const clearCheckoutSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CHECKOUT_ADDRESS_KEY);
  window.localStorage.removeItem(CHECKOUT_PACKAGING_KEY);
};
