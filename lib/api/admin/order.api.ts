import api from "@/lib/api/axios";

export const adminOrderAPI = {
  getAllOrders: (page: number = 1, limit: number = 10, customerType?: string) =>
    api.get(`/orders?page=${page}&limit=${limit}${customerType ? `&customerType=${customerType}` : ''}`),

  getOrderById: (id: string) => api.get(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
  approveRefund: (id: string) =>
  api.put(`/orders/${id}/refund/approve`),

  rejectRefund: (id: string) =>
    api.put(`/orders/${id}/refund/reject`),
    
  approveReturn: (id: string) =>
    api.put(`/orders/${id}/return/approve`),

  rejectReturn: (id: string) =>
    api.put(`/orders/${id}/return/reject`),

  markReturnReceived: (id: string) =>
    api.put(`/orders/${id}/return/receive`),
};
