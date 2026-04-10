import { create } from "zustand";

/* ================= TYPES ================= */

export type SelectedOption = {
  fieldName: string;
  value: string;
};

export interface CartItem {
  productId: string;

  name: string;
  image?: string;

  price: number;
  quantity: number;

  variantId?: string; // ✅ backend aligned
  selectedOptions?: SelectedOption[]; // ✅ backend aligned
}

interface CartState {
  items: CartItem[];
  totalPrice: number;

  addItem: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  removeItem: (item: CartItem) => void;

  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

/* ================= HELPERS ================= */

const calculateTotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

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

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,

  /* 🔹 ADD ITEM */
  addItem: (item) =>
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
          quantity: newItems[existingIndex].quantity + item.quantity,
        };
      } else {
        newItems = [...state.items, normalizedItem];
      }

      return {
        items: newItems,
        totalPrice: calculateTotal(newItems),
      };
    }),

  /* 🔹 UPDATE QUANTITY */
  updateQuantity: (item, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => !isSameItem(i, item));
        return { items: newItems, totalPrice: calculateTotal(newItems) };
      }

      const newItems = state.items.map((i) =>
        isSameItem(i, item) ? { ...i, quantity } : i
      );

      return {
        items: newItems,
        totalPrice: calculateTotal(newItems),
      };
    }),

  /* 🔹 REMOVE ITEM */
  removeItem: (item) =>
    set((state) => {
      const newItems = state.items.filter((i) => !isSameItem(i, item));

      return {
        items: newItems,
        totalPrice: calculateTotal(newItems),
      };
    }),

  /* 🔹 SET CART (from backend) */
  setCart: (items) =>
    set({
      items,
      totalPrice: calculateTotal(items),
    }),

  /* 🔹 CLEAR CART */
  clearCart: () => set({ items: [], totalPrice: 0 }),
}));