// lib/api/admin/dashboard.api.ts

import api from "@/lib/api/axios";

export const dashboardAPI = {
  getStats: () => api.get("/orders/admin/stats"),
};