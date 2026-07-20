/**
 * Format a number as currency.
 *
 * @param value - The amount to format.
 * @param currency - Currency code (default: INR).
 * @param locale - Locale (default: en-IN).
 */
export function formatCurrency(
  value?: number | null,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  if (value == null || Number.isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}