function normalizePath(value: string) {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export function getCollectionBasePath() {
  const configuredBase = process.env.NEXT_PUBLIC_COLLECTIONS_ENDPOINT;

  return normalizePath(configuredBase || "/collections");
}

export function getCollectionBasePaths() {
  return [getCollectionBasePath()];
}

export function getCollectionIdPaths(id: string) {
  const base = getCollectionBasePath();

  return [`${base}/admin/${id}`, `${base}/${id}`];
}

export function getCollectionSlugPaths(slug: string) {
  const base = getCollectionBasePath();

  return [`${base}/${slug}`];
}

export function getCollectionByCategoryPath(categoryId: string) {
  const base = getCollectionBasePath();

  return `${base}/category/${categoryId}`;
}
