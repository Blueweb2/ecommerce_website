import api from "@/lib/api/axios";
import type {
  Designer,
  DesignerDetailResponse,
  DesignerListResponse,
  DesignerWithProductsResponse,
} from "@/types/designer";
import type { Product } from "@/types/product";

type DesignerQuery = {
  isFavorite?: boolean;
  isActive?: boolean;
  search?: string;
};

function isDesigner(value: unknown): value is Designer {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "name" in value &&
    "brandName" in value
  );
}

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "name" in value &&
    "slug" in value &&
    "price" in value
  );
}

export function normalizeDesigners(payload: DesignerListResponse): Designer[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.designers)) {
    return payload.designers;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.designers)) {
    return payload.data.designers;
  }

  return [];
}

export function normalizeDesigner(
  payload: DesignerDetailResponse | DesignerWithProductsResponse
): Designer | null {
  if (!payload) {
    return null;
  }

  if (isDesigner(payload)) {
    return payload;
  }

  if ("designer" in payload && payload.designer) {
    return payload.designer;
  }

  if ("data" in payload && isDesigner(payload.data)) {
    return payload.data;
  }

  if (
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    "designer" in payload.data &&
    payload.data.designer
  ) {
    return payload.data.designer;
  }

  return null;
}

export function normalizeDesignerProducts(
  payload: DesignerWithProductsResponse
): Product[] {
  if (!payload || isDesigner(payload)) {
    return [];
  }

  if ("products" in payload && Array.isArray(payload.products)) {
    return payload.products.filter(isProduct);
  }

  if (
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    "products" in payload.data &&
    Array.isArray(payload.data.products)
  ) {
    return payload.data.products.filter(isProduct);
  }

  return [];
}

function getStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return undefined;
}

async function getWithFallback<T>(endpoints: string[]) {
  for (const endpoint of endpoints) {
    try {
      return await api.get<T>(endpoint);
    } catch (error) {
      if (getStatusCode(error) !== 404) {
        throw error;
      }
    }
  }

  throw new Error(`Designer API route not found. Tried: ${endpoints.join(", ")}`);
}

function buildDesignerQuery(query?: DesignerQuery) {
  if (!query) {
    return "/designers";
  }

  const searchParams = new URLSearchParams();

  if (typeof query.isFavorite === "boolean") {
    searchParams.set("isFavorite", String(query.isFavorite));
  }

  if (typeof query.isActive === "boolean") {
    searchParams.set("isActive", String(query.isActive));
  }

  if (query.search?.trim()) {
    searchParams.set("search", query.search.trim());
  }

  const queryString = searchParams.toString();
  return queryString ? `/designers?${queryString}` : "/designers";
}

export const getPublicDesigners = async (query?: DesignerQuery) => {
  const primaryPath = buildDesignerQuery(query);
  const response = await getWithFallback<DesignerListResponse>([
    primaryPath,
    "/designers/public",
  ]);

  return normalizeDesigners(response.data).filter(
    (designer) => designer.isActive !== false
  );
};

export const getDesigners = async (query?: DesignerQuery) => {
  return getPublicDesigners(query);
};

export const getFavoriteDesigners = async () => {
  const response = await getWithFallback<DesignerListResponse>([
    "/designers/favorites",
    "/designers?isFavorite=true&isActive=true",
    "/designers?favorite=true",
  ]);

  const designers = normalizeDesigners(response.data);

  if (designers.some((designer) => typeof designer.isFavorite === "boolean")) {
    return designers.filter(
      (designer) => designer.isFavorite && designer.isActive !== false
    );
  }

  return designers.filter((designer) => designer.isActive !== false);
};

export const getDesignerBySlug = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const response = await getWithFallback<DesignerWithProductsResponse>([
    `/designers/slug/${encodedSlug}`,
    `/designers/${encodedSlug}`,
  ]);

  const designer = normalizeDesigner(response.data);

  if (!designer || designer.isActive === false) {
    throw new Error("Designer not found");
  }

  return designer;
};

export const getDesignerDetail = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const response = await getWithFallback<DesignerWithProductsResponse>([
    `/designers/slug/${encodedSlug}`,
    `/designers/${encodedSlug}`,
  ]);

  const designer = normalizeDesigner(response.data);

  if (!designer || designer.isActive === false) {
    throw new Error("Designer not found");
  }

  return {
    designer,
    products: normalizeDesignerProducts(response.data),
  };
};
