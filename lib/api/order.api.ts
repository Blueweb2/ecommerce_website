// lib/api/order.api.ts

import api from "@/lib/api/axios";

export const orderAPI = {
  // ✅ Create order (MATCHES YOUR BACKEND)
  createOrder: (data: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: "card" | "paypal" | "stripe";
    notes?: string;
  }) => api.post("/orders", data),

  // ✅ Get my orders
  getMyOrders: () => api.get("/orders/my"),

  // ✅ Get single order
  getOrderById: (id: string) => api.get(`/orders/${id}`),
};