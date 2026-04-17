import api from "@/lib/api/axios";
import { Order } from "@/types/order"; 

export const adminOrderAPI = {
  getAllOrders: (page: number = 1, limit: number = 10) =>
    api.get(`/orders?page=${page}&limit=${limit}`),

  getOrderById: (id: string) => api.get(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
  approveRefund: (id: string) =>
  api.put(`/orders/${id}/refund/approve`),

rejectRefund: (id: string) =>
  api.put(`/orders/${id}/refund/reject`),
};
