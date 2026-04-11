// store/user/wishlist/useWishlistStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

// store/user/wishlist/useWishlistStore.ts

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (product: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const exists = get().items.find((i) => i._id === product._id);
        if (exists) return;
        set({ items: [...get().items, product] });
      },

      removeFromWishlist: (id) => {
        set({
          items: get().items.filter((item) => item._id !== id),
        });
      },

      toggleWishlist: (product) => {
        const exists = get().items.find((i) => i._id === product._id);

        if (exists) {
          set({
            items: get().items.filter((i) => i._id !== product._id),
          });
        } else {
          set({
            items: [...get().items, product],
          });
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item._id === id);
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);