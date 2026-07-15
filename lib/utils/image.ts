import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/** @deprecated Use PLACEHOLDER_IMAGE — old path was missing from /public */
export const LEGACY_PLACEHOLDER_IMAGE = "/placeholder.png";

export function resolveImageSrc(
  url?: string | null,
  fallback: string = PLACEHOLDER_IMAGE
): string {
  if (!url?.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return optimizeCloudinaryUrl(`https:${trimmed}`) || fallback;
  }

  const optimized = optimizeCloudinaryUrl(trimmed);
  return optimized || fallback;
}
