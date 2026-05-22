import type { Address } from "@/types/address";

export type PackagingOption = "standard" | "gift";
export type ShippingOption = "standard" | "express";
export type CheckoutMode = "guest" | "account";

const CHECKOUT_ADDRESS_KEY = "checkout-address";
const CHECKOUT_SHIPPING_KEY = "checkout-shipping";
const CHECKOUT_PACKAGING_KEY = "checkout-packaging";
const CHECKOUT_MODE_KEY = "checkout-mode";
const CHECKOUT_GIFT_MESSAGE_KEY = "checkout-gift-message";

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

export const getStoredShippingOption = (): ShippingOption | null => {
  if (!canUseStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(CHECKOUT_SHIPPING_KEY);

  if (value === "express") {
    return "express";
  }

  if (value === "standard") {
    return "standard";
  }

  return null;
};

export const setStoredShippingOption = (option: ShippingOption) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_SHIPPING_KEY, option);
};

export const getShippingCharge = (option: ShippingOption) =>
  option === "express" ? 50 : 0;

export const getStoredPackagingOption = (): PackagingOption | null => {
  if (!canUseStorage()) {
    return null;
  }

  const value = window.localStorage.getItem(CHECKOUT_PACKAGING_KEY);

  if (value === "gift") {
    return "gift";
  }

  if (value === "standard") {
    return "standard";
  }

  return null;
};

export const setStoredPackagingOption = (option: PackagingOption) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(CHECKOUT_PACKAGING_KEY, option);
};

export const getStoredGiftMessage = (): string => {
  if (!canUseStorage()) {
    return "";
  }

  return window.localStorage.getItem(CHECKOUT_GIFT_MESSAGE_KEY) || "";
};

export const setStoredGiftMessage = (message: string) => {
  if (!canUseStorage()) {
    return;
  }

  const trimmed = message.trim();

  if (!trimmed) {
    window.localStorage.removeItem(CHECKOUT_GIFT_MESSAGE_KEY);
    return;
  }

  window.localStorage.setItem(CHECKOUT_GIFT_MESSAGE_KEY, trimmed);
};

export const buildCheckoutOrderNotes = (
  packaging: PackagingOption,
  giftMessage?: string | null
) => {
  const parts = [
    packaging === "gift"
      ? "Gift packaging selected"
      : "Standard packaging selected",
  ];

  if (packaging === "gift" && giftMessage?.trim()) {
    parts.push(`Gift message: ${giftMessage.trim()}`);
  }

  return parts.join(" | ");
};

export const clearCheckoutSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CHECKOUT_ADDRESS_KEY);
  window.localStorage.removeItem(CHECKOUT_SHIPPING_KEY);
  window.localStorage.removeItem(CHECKOUT_PACKAGING_KEY);
  window.localStorage.removeItem(CHECKOUT_MODE_KEY);
  window.localStorage.removeItem(CHECKOUT_GIFT_MESSAGE_KEY);
};
