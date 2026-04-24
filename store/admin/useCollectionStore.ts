import { create } from "zustand";
import * as collectionApi from "@/lib/api/admin/collection.api";
import { Collection, CollectionPayload } from "@/types/collection";

interface CollectionState {
  collections: Collection[];
  loading: boolean;
  fetchCollections: () => Promise<void>;
  createCollection: (data: CollectionPayload) => Promise<Collection | null>;
  updateCollection: (
    id: string,
    data: CollectionPayload
  ) => Promise<Collection | null>;
  deleteCollection: (id: string) => Promise<void>;
  getCollection: (id: string) => Collection | undefined;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  loading: false,

  fetchCollections: async () => {
    set({ loading: true });

    try {
      const collections = await collectionApi.getCollections();
      set({ collections });
    } catch (error) {
      console.error("Fetch collections error:", error);
      set({ collections: [] });
    } finally {
      set({ loading: false });
    }
  },

  createCollection: async (data) => {
    const created = await collectionApi.createCollection(data);

    if (created) {
      set((state) => ({
        collections: [created, ...state.collections],
      }));
    }

    return created;
  },

  updateCollection: async (id, data) => {
    const updated = await collectionApi.updateCollection(id, data);

    if (updated) {
      set((state) => ({
        collections: state.collections.map((collection) =>
          collection._id === id ? updated : collection
        ),
      }));
    }

    return updated;
  },

  deleteCollection: async (id) => {
    await collectionApi.deleteCollection(id);

    set((state) => ({
      collections: state.collections.filter((collection) => collection._id !== id),
    }));
  },

  getCollection: (id) =>
    get().collections.find((collection) => collection._id === id),
}));
