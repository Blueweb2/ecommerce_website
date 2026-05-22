// lib/api/order.api.ts

import api from "@/lib/api/axios";

export const orderAPI = {
  // ✅ Create order (MATCHES YOUR BACKEND)
  createOrder: (data: {
    shippingAddress: {
      fullName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: "cod" | "razorpay";
    shippingCharge: number; // ✅ ADD THIS
    promoCode?: string;     // ✅ ADD THIS
    notes?: string;
  }) => api.post("/orders", data),

  // ✅ Get my orders (MATCHES BACKEND)
  getMyOrders: (page: number = 1, limit: number = 10) =>
    api.get(`/orders/my-orders?page=${page}&limit=${limit}`),

  // ✅ Get single order
  getOrderById: (id: string) => api.get(`/orders/${id}`),

  // ✅ Cancel order
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
  verifyPayment: (data: {
  razorpayOrderId: string;
  paymentId: string;
  signature: string;
  orderId: string;
}) => api.post("/orders/verify-payment", data),

retryPayment: (orderId: string) =>
  api.post(`/orders/${orderId}/retry-payment`),

requestRefund: (orderId: string) =>
  api.post(`/orders/${orderId}/refund`),

requestReturn: (orderId: string, reason: string) =>
  api.post(`/orders/${orderId}/return`, { reason }),

};