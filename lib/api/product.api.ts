import api from "@/lib/api/axios";
import type { Product } from "@/types/product";

type ProductListPayload =
  | Product[]
  | {
      success?: boolean;
      products?: Product[];
      data?:
        | Product[]
        | {
            products?: Product[];
          };
    };

function normalizeProducts(payload: ProductListPayload): Product[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.products)) {
    return payload.products;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.products)) {
    return payload.data.products;
  }

  return [];
}

function getStatusCode(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}

export const productAPI = {
  // PRODUCT DETAILS
  getBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  // VARIANTS
  getVariants: (id: string) =>
    api.get(`/products/${id}/variants`),

  // MAIN PRODUCT LIST (WITH FILTERS)
  getAll: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) =>
    api.get("/products", { params }),

  // SALE PRODUCTS (VERY IMPORTANT FOR YOUR PAGE)
  getSale: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }) =>
    api.get("/products/sale", { params }),

  // NEW PRODUCTS
  getNew: () =>
    api.get("/products/new"),

  // FEATURED / HOME SECTIONS
  getFeatured: () =>
    api.get("/products/featured"),

  getTopRated: () =>
    api.get("/products?sections=top-rated"),

  getBestSellers: () =>
    api.get("/products?sections=best-seller"),

  // SEARCH
  search: (query: string) =>
    api.get("/products/search", {
      params: { q: query },
    }),

  searchCatalog: async (query: string): Promise<Product[]> => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    try {
      const response = await api.get<ProductListPayload>("/products/search", {
        params: { q: trimmedQuery },
      });

      return normalizeProducts(response.data);
    } catch (error) {
      if (getStatusCode(error) && getStatusCode(error) !== 404) {
        throw error;
      }
    }

    const fallbackResponse = await api.get<ProductListPayload>("/products", {
      params: { search: trimmedQuery, limit: 24 },
    });

    return normalizeProducts(fallbackResponse.data);
  },
};
