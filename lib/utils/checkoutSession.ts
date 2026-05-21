import type { Address } from "@/types/address";

export type PackagingOption = "standard" | "gift";
export type ShippingOption = "standard" | "express";
export type CheckoutMode = "guest" | "account";

const CHECKOUT_ADDRESS_KEY = "checkout-address";
const CHECKOUT_SHIPPING_KEY = "checkout-shipping";
const CHECKOUT_PACKAGING_KEY = "checkout-packaging";
const CHECKOUT_MODE_KEY = "checkout-mode";

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

export const getStoredCheckoutMode = (): CheckoutMode | null => {
  if (!canUseStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(CHECKOUT_MODE_KEY);

  return value === "guest" || value === "account" ? value : null;
};

export const setStoredCheckoutMode = (mode: CheckoutMode) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_MODE_KEY, mode);
};

export const getStoredShippingOption = (): ShippingOption => {
  if (!canUseStorage()) {
    return "standard";
  }

  const value = window.localStorage.getItem(CHECKOUT_SHIPPING_KEY);

  return value === "express" ? "express" : "standard";
};

export const setStoredShippingOption = (option: ShippingOption) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_SHIPPING_KEY, option);
};

export const getShippingCharge = (option: ShippingOption) =>
  option === "express" ? 50 : 0;

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
  window.localStorage.removeItem(CHECKOUT_SHIPPING_KEY);
  window.localStorage.removeItem(CHECKOUT_PACKAGING_KEY);
  window.localStorage.removeItem(CHECKOUT_MODE_KEY);
};
