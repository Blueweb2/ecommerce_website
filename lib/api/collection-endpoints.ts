function normalizePath(value: string) {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export function getCollectionBasePaths() {
  const configuredBase = process.env.NEXT_PUBLIC_COLLECTIONS_ENDPOINT;

  if (configuredBase) {
    return [normalizePath(configuredBase)];
  }

  return ["/collections", "/collection"];
}

export function getCollectionIdPaths(id: string) {
  return getCollectionBasePaths().map((basePath) => `${basePath}/${id}`);
}

export function getCollectionSlugPaths(slug: string) {
  return getCollectionBasePaths().flatMap((basePath) => [
    `${basePath}/slug/${slug}`,
    `${basePath}/${slug}`,
  ]);
}
