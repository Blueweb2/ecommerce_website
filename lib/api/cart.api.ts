import api from "@/lib/api/axios";

type SelectedOption = {
  fieldName: string;
  value: string;
};

type CartItemPayload = {
  productId: string;
  quantity: number;
  variantId?: string;
  selectedOptions?: SelectedOption[];
};

export const cartAPI = {
  getCart: () => api.get("/cart"),

  addToCart: (data: CartItemPayload) => api.post("/cart", data),

  updateQuantity: (itemId: string, quantity: number) =>
    api.patch(`/cart/item/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/cart/item/${itemId}`),

  mergeCart: (data: { items: CartItemPayload[] }) =>
    api.post("/cart/merge", data),

  clearCart: () => api.delete("/cart"),
};
