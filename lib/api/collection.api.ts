import api from "@/lib/api/axios";
import {
  getCollectionBasePaths,
  getCollectionByCategoryPath,
  getCollectionSlugPaths,
} from "@/lib/api/collection-endpoints";
import {
  Collection,
  CollectionListResponse,
  CollectionResponse,
} from "@/types/collection";

function normalizeCollections(payload: CollectionListResponse): Collection[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.collections)) {
    return payload.collections;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.collections)) {
    return payload.data.collections;
  }

  return [];
}

function getStatusCode(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}

async function requestWithFallback<T>(endpoints: string[]): Promise<T> {
  for (const endpoint of endpoints) {
    try {
      const response = await api.get<T>(endpoint);
      return response.data;
    } catch (error: unknown) {
      if (getStatusCode(error) !== 404) {
        throw error;
      }
    }
  }

  throw new Error(
    `Collection API route not found. Tried: ${endpoints.join(", ")}`
  );
}

export const collectionAPI = {
  getAll: async (): Promise<Collection[]> => {
    const data = await requestWithFallback<CollectionListResponse>(
      getCollectionBasePaths()
    );

    return normalizeCollections(data);
  },

  getBySlug: async (slug: string): Promise<CollectionResponse> => {
    const encodedSlug = encodeURIComponent(slug);

    const response = await requestWithFallback<any>(
      getCollectionSlugPaths(encodedSlug)
    );

    //  extract from .data wrapper
    return {
      success: response.success,
      collection: response.data?.collection,
      products: response.data?.products || [],
    };
  },

  getByCategory: async (categoryId: string): Promise<Collection[]> => {
    const response = await api.get<Collection[]>(
      getCollectionByCategoryPath(categoryId)
    );

    return response.data;
  },
};
