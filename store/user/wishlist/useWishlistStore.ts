// // store/user/wishlist/useWishlistStore.ts

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // store/user/wishlist/useWishlistStore.ts

// interface WishlistItem {
//   _id: string;
//   name: string;
//   price: number;
//   image: string;
// }

// interface WishlistStore {
//   items: WishlistItem[];
//   addToWishlist: (product: WishlistItem) => void;
//   removeFromWishlist: (id: string) => void;
//   toggleWishlist: (product: WishlistItem) => void;
//   isInWishlist: (id: string) => boolean;
// }

// export const useWishlistStore = create<WishlistStore>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       addToWishlist: (product) => {
//         const exists = get().items.find((i) => i._id === product._id);
//         if (exists) return;
//         set({ items: [...get().items, product] });
//       },

//       removeFromWishlist: (id) => {
//         set({
//           items: get().items.filter((item) => item._id !== id),
//         });
//       },

//       toggleWishlist: (product) => {
//         const exists = get().items.find((i) => i._id === product._id);

//         if (exists) {
//           set({
//             items: get().items.filter((i) => i._id !== product._id),
//           });
//         } else {
//           set({
//             items: [...get().items, product],
//           });
//         }
//       },

//       isInWishlist: (id) => {
//         return get().items.some((item) => item._id === id);
//       },
//     }),
//     {
//       name: "wishlist-storage",
//     }
//   )
// );
// store/user/wishlist/useWishlistStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistAPI } from "@/lib/api/wishlist.api";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];

  setItems: (items: WishlistItem[]) => void;
  clearWishlist: () => void;

  toggleWishlist: (product: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;

  syncWishlist: () => Promise<void>;
  mergeWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (items) => set({ items }),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (id) =>
        get().items.some((item) => item._id === id),

      toggleWishlist: (product) => {
        const exists = get().items.find(
          (i) => i._id === product._id
        );

        if (exists) {
          set({
            items: get().items.filter(
              (i) => i._id !== product._id
            ),
          });
        } else {
          set({
            items: [...get().items, product],
          });
        }
      },

      // 🔄 Fetch from backend
      syncWishlist: async () => {
        try {
          const res = await wishlistAPI.get();

          const backendItems = res.data.data.items.map((i: any) => ({
            _id: i.product._id,
            name: i.product.name,
            price: i.product.price,
            image: (i.product.images?.find((img: any) => img.isPrimary) || i.product.images?.[0])?.url,
          }));

          set({ items: backendItems });
        } catch (err) {
          console.log("Wishlist sync failed");
        }
      },

      // 🔄 Merge guest → backend
      mergeWishlist: async () => {
        try {
          const items = get().items.map((i) => ({
            productId: i._id,
          }));

          if (items.length === 0) return;

          await wishlistAPI.merge(items);

          set({ items: [] }); // clear guest
        } catch (err) {
          console.log("Merge failed");
        }
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);