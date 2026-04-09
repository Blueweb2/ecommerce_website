// lib/api/order.api.ts

import api from "@/lib/api/axios";

export const orderAPI = {
  // ✅ Create order
  createOrder: (data: {
    items: {
      productId: string;
      quantity: number;
      variant?: Record<string, string>;
      customData?: {
        fieldName: string;
        value: string | number;
      }[];
    }[];
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      city: string;
      pincode: string;
    };
    paymentMethod: "cod" | "online";
  }) =>
    api.post("/orders", data),

  // ✅ Get my orders
  getMyOrders: () =>
    api.get("/orders/my"),

  // ✅ Get single order
  getOrderById: (id: string) =>
    api.get(`/orders/${id}`),
};