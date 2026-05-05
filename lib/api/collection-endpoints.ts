function normalizePath(value: string) {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

// 🔥 BASE PATH
export function getCollectionBasePath() {
  const configuredBase = process.env.NEXT_PUBLIC_COLLECTIONS_ENDPOINT;

  return normalizePath(configuredBase || "/collections");
}

// 🔹 ALL collections
export function getCollectionBasePaths() {
  return [getCollectionBasePath()];
}

// 🔹 BY ID
export function getCollectionIdPaths(id: string) {
  const base = getCollectionBasePath();
  return [`${base}/admin/${id}`]; // ✅ matches your backend
}

// 🔹 BY SLUG
export function getCollectionSlugPaths(slug: string) {
  const base = getCollectionBasePath();
  return [`${base}/${slug}`]; // ✅ clean & correct
}

// 🔥 NEW: BY CATEGORY (IMPORTANT)
export function getCollectionByCategoryPath(categoryId: string) {
  const base = getCollectionBasePath();
  return `${base}/category/${categoryId}`;
}