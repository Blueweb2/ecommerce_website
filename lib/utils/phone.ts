const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const normalizePhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
};

export const isValidIndianMobile = (value: string): boolean =>
  INDIAN_MOBILE_REGEX.test(normalizePhoneNumber(value));

export const getPhoneValidationError = (value: string): string | null => {
  const normalized = normalizePhoneNumber(value);

  if (!normalized) {
    return "Phone number is required.";
  }

  if (normalized.length !== 10) {
    return "Phone number must be exactly 10 digits.";
  }

  if (!INDIAN_MOBILE_REGEX.test(normalized)) {
    return "Enter a valid 10-digit Indian mobile number (starts with 6–9).";
  }

  return null;
};

export const formatPhoneInput = (value: string): string =>
  value.replace(/\D/g, "").slice(0, 10);
