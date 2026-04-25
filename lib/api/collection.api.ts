import api from "@/lib/api/axios";
import {
  getCollectionBasePaths,
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

async function requestWithFallback<T>(endpoints: string[]) {
  for (const endpoint of endpoints) {
    try {
      return await api.get<T>(endpoint);
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
  getAll: async () => {
    const response = await requestWithFallback<CollectionListResponse>(
      getCollectionBasePaths()
    );

    return normalizeCollections(response.data);
  },

  getBySlug: async (slug: string) => {
    const encodedSlug = encodeURIComponent(slug);
    const response = await requestWithFallback<CollectionResponse>(
      getCollectionSlugPaths(encodedSlug)
    );

    return response.data;
  },
};
