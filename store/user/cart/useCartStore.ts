import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { cartAPI } from "@/lib/api/cart.api";

/* ================= TYPES ================= */

export type SelectedOption = {
  fieldName: string;
  value: string;
};

export interface CartItem {
  _id?: string; // ✅ REQUIRED for backend operations

  productId: string;
  name: string;
  image?: string;

  price: number;
  quantity: number;
  gstPercentage?: number;
  gstAmount?: number;

  variantId?: string;
  selectedOptions?: SelectedOption[];

  isFabric?: boolean;
  unit?: string;
  minOrderQty?: number;
  stepQty?: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalGstAmount: number;
  appliedPromo: {
    code: string;
    discountAmount: number;
  } | null; // ✅ ADDED

  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  removeItem: (item: CartItem) => Promise<void>;

  syncCart: () => Promise<void>;
  mergeCart: () => Promise<void>;

  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
  clearCartAsync: () => Promise<void>; 

  applyPromo: (code: string, discountAmount: number) => void; // ✅ ADDED
  removePromo: () => void; // ✅ ADDED 
}

/* ================= HELPERS ================= */

const calculateTotals = (items: CartItem[]) =>
  items.reduce(
    (acc, item) => {
      const price = item.price * item.quantity;
      const gstAmount = ((item.price * (item.gstPercentage || 0)) / 100) * item.quantity;
      return {
        totalPrice: acc.totalPrice + price,
        totalGstAmount: acc.totalGstAmount + gstAmount,
      };
    },
    { totalPrice: 0, totalGstAmount: 0 }
  );

const normalizeOptions = (options: SelectedOption[] = []) =>
  [...options].sort((a, b) =>
    a.fieldName.localeCompare(b.fieldName)
  );

const isSameItem = (a: CartItem, b: CartItem) => {
  return (
    a.productId === b.productId &&
    a.variantId === b.variantId &&
    JSON.stringify(normalizeOptions(a.selectedOptions)) ===
      JSON.stringify(normalizeOptions(b.selectedOptions))
  );
};

/* ================= STORE ================= */

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      totalGstAmount: 0,
      appliedPromo: null, // ✅ ADDED

      /* ================= SYNC CART ================= */
      syncCart: async () => {
        try {
          const res = await cartAPI.getCart();
          const data = res.data.data;

          const mappedItems: CartItem[] = data.items.map((i: any) => ({
            _id: i._id,
            productId: i.product._id,
            name: i.product.name,
            image: i.product.image,
            price: i.price,
            quantity: i.quantity,
            variantId: i.variantId,
            selectedOptions: i.selectedOptions || [],
            gstPercentage: i.gstPercentage || 0,
            gstAmount: i.gstAmount || 0,
            isFabric: i.product.isFabric,
            unit: i.product.unit,
            minOrderQty: i.product.minOrderQty,
            stepQty: i.product.stepQty,
          }));

          set({
            items: mappedItems,
            totalPrice: data.totalPrice,
            totalGstAmount: data.totalGstAmount,
          });
        } catch (err) {
          console.error("Sync cart failed", err);
        }
      },

      /* ================= MERGE CART ================= */
      mergeCart: async () => {
        try {
          const items = get().items;

          if (!items.length) {
            await get().syncCart();
            return;
          }

          await cartAPI.mergeCart({
            items: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              variantId: i.variantId,
              selectedOptions: i.selectedOptions,
            })),
          });

          // ✅ clear guest cart after merge
          set({ items: [], totalPrice: 0, totalGstAmount: 0 });

          await get().syncCart();
        } catch (err) {
          console.error("Merge cart failed", err);
        }
      },

      /* ================= ADD ITEM ================= */
      addItem: async (item) => {
        const isLoggedIn = useAuthStore.getState().isAuthenticated;

        // 🔐 LOGGED-IN → backend
        if (isLoggedIn) {
          try {
            await cartAPI.addToCart({
              productId: item.productId,
              quantity: item.quantity,
              variantId: item.variantId,
              selectedOptions: item.selectedOptions,
            });

            await get().syncCart();
          } catch (err) {
            console.error("Add to cart failed", err);
          }
          return;
        }

        // 🟢 GUEST → local
        set((state) => {
          const normalizedItem = {
            ...item,
            selectedOptions: normalizeOptions(item.selectedOptions || []),
          };

          const existingIndex = state.items.findIndex((i) =>
            isSameItem(i, normalizedItem)
          );

          let newItems;

          if (existingIndex > -1) {
            newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity:
                newItems[existingIndex].quantity + item.quantity,
            };
          } else {
            newItems = [...state.items, normalizedItem];
          }

          const { totalPrice, totalGstAmount } = calculateTotals(newItems);
          return {
            items: newItems,
            totalPrice,
            totalGstAmount,
          };
        });
      },

      /* ================= UPDATE QUANTITY ================= */
      updateQuantity: async (item, quantity) => {
        const isLoggedIn = useAuthStore.getState().isAuthenticated;

        // 🟢 LOCAL UPDATE (Optimistic)
        const previousItems = get().items;
        const previousTotal = get().totalPrice;
        const previousGst = get().totalGstAmount;

        if (quantity <= 0) {
          const newItems = get().items.filter((i) => !isSameItem(i, item));
          const { totalPrice, totalGstAmount } = calculateTotals(newItems);
          set({ items: newItems, totalPrice, totalGstAmount });
        } else {
          const newItems = get().items.map((i) =>
            isSameItem(i, item) ? { ...i, quantity } : i
          );
          const { totalPrice, totalGstAmount } = calculateTotals(newItems);
          set({ items: newItems, totalPrice, totalGstAmount });
        }

        // 🔐 LOGGED-IN SYNC
        if (isLoggedIn) {
          try {
            if (!item._id) {
              await get().syncCart(); // recover if _id missing
              return;
            }

            if (quantity <= 0) {
              await cartAPI.removeItem(item._id);
            } else {
              await cartAPI.updateQuantity(item._id, quantity);
            }

            await get().syncCart(); // get final truth from server
          } catch (err) {
            console.error("Update quantity failed, rolling back", err);
            set({ items: previousItems, totalPrice: previousTotal, totalGstAmount: previousGst });
          }
        }
      },

      /* ================= REMOVE ITEM ================= */
      removeItem: async (item) => {
        const isLoggedIn = useAuthStore.getState().isAuthenticated;

        // 🟢 LOCAL UPDATE (Optimistic)
        const previousItems = get().items;
        const previousTotal = get().totalPrice;
        const previousGst = get().totalGstAmount;

        const newItems = get().items.filter((i) => !isSameItem(i, item));
        const { totalPrice, totalGstAmount } = calculateTotals(newItems);
        set({ items: newItems, totalPrice, totalGstAmount });

        // 🔐 LOGGED-IN SYNC
        if (isLoggedIn) {
          try {
            if (!item._id) {
              await get().syncCart();
              return;
            }

            await cartAPI.removeItem(item._id);
            await get().syncCart();
          } catch (err) {
            console.error("Remove item failed, rolling back", err);
            set({ items: previousItems, totalPrice: previousTotal, totalGstAmount: previousGst });
          }
        }
      },

      clearCartAsync: async () => {
        const isLoggedIn = useAuthStore.getState().isAuthenticated;

        try {
          if (isLoggedIn) {
            await cartAPI.clearCart(); // 🔐 backend clear
          }

          set({ items: [], totalPrice: 0, totalGstAmount: 0 }); // 🟢 local clear
        } catch (err) {
          console.error("Clear cart failed", err);
        }
      },

      /* ================= SET CART ================= */
      setCart: (items) => {
        const { totalPrice, totalGstAmount } = calculateTotals(items);
        set({
          items,
          totalPrice,
          totalGstAmount,
        });
      },

      /* ================= CLEAR ================= */
      clearCart: () => set({ items: [], totalPrice: 0, totalGstAmount: 0, appliedPromo: null }),

      /* ================= PROMO ================= */
      applyPromo: (code, discountAmount) => set({ appliedPromo: { code, discountAmount } }),
      removePromo: () => set({ appliedPromo: null }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);