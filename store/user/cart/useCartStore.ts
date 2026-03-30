import { create } from "zustand";

export interface Product {
  _id: string;
  name: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;

  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.product._id === item.product._id);

      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.product._id === item.product._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      return { items: newItems, totalPrice: calculateTotal(newItems) };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.product._id !== productId);
        return { items: newItems, totalPrice: calculateTotal(newItems) };
      }
      const newItems = state.items.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      );
      return { items: newItems, totalPrice: calculateTotal(newItems) };
    }),

  removeItem: (productId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.product._id !== productId);
      return { items: newItems, totalPrice: calculateTotal(newItems) };
    }),

  setCart: (items) => set({ items, totalPrice: calculateTotal(items) }),

  clearCart: () => set({ items: [], totalPrice: 0 }),
}));