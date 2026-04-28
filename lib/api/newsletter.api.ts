import api from "@/lib/api/axios";

export const newsletterAPI = {
  subscribe: (email: string) =>
    api.post("/newsletter/subscribe", { email }),
  getStats: () =>
    api.get("/newsletter/stats"),
  getSubscribers: (params: { page?: number; limit?: number; search?: string }) =>
    api.get("/newsletter/subscribers", { params }),
  sendOffer: (data: { subject: string; content: string }) =>
    api.post("/newsletter/send-offer", data),
};
