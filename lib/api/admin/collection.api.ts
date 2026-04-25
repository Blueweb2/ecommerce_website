import api from "@/lib/api/axios";
import {
  getCollectionBasePaths,
  getCollectionIdPaths,
} from "@/lib/api/collection-endpoints";
import {
  Collection,
  CollectionDetailResponse,
  CollectionListResponse,
  CollectionPayload,
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

function normalizeCollection(payload: CollectionDetailResponse): Collection | null {
  if (!payload) {
    return null;
  }

  if ("slug" in payload) {
    return payload;
  }

  if (payload.collection) {
    return payload.collection;
  }

  if (payload.data && !Array.isArray(payload.data) && "slug" in payload.data) {
    return payload.data;
  }

  if (payload.data && !Array.isArray(payload.data) && payload.data.collection) {
    return payload.data.collection;
  }

  return null;
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

async function requestWithFallback<T>(
  method: "get" | "post" | "put" | "delete",
  endpoints: string[],
  data?: unknown
) {
  for (const endpoint of endpoints) {
    try {
      const response = await api.request<T>({
        method,
        url: endpoint,
        data,
      });

      return response;
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

export const getCollections = async () => {
  const response = await requestWithFallback<CollectionListResponse>(
    "get",
    getCollectionBasePaths()
  );
  return normalizeCollections(response.data);
};

export const getCollectionById = async (id: string) => {
  const response = await requestWithFallback<CollectionDetailResponse>(
    "get",
    getCollectionIdPaths(id)
  );

  return normalizeCollection(response.data);
};

export const createCollection = async (data: CollectionPayload) => {
  const response = await requestWithFallback<CollectionDetailResponse>(
    "post",
    getCollectionBasePaths(),
    data
  );
  return normalizeCollection(response.data);
};

export const updateCollection = async (id: string, data: CollectionPayload) => {
  const response = await requestWithFallback<CollectionDetailResponse>(
    "put",
    getCollectionIdPaths(id),
    data
  );

  return normalizeCollection(response.data);
};

export const deleteCollection = async (id: string) => {
  await requestWithFallback("delete", getCollectionIdPaths(id));
};
