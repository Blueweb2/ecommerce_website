import { create } from "zustand";
import { orderAPI } from "@/lib/api/order.api";
import toast from "react-hot-toast";
import { Order } from "@/types/order";

interface MyOrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };

  fetchMyOrders: (page?: number, limit?: number) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
}

export const useMyOrderStore = create<MyOrderStore>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },

  fetchMyOrders: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await orderAPI.getMyOrders(page, limit);
      // Ensure we extract the nested `data` based on standard sendResponse wrapping
      const data = res.data?.data || res.data;
      set({ 
        orders: data.orders || [], 
        pagination: data.pagination || { total: 0, page: 1, limit: 10, pages: 1 } 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch your orders" });
      toast.error(err.response?.data?.message || "Failed to fetch your orders");
    } finally {
      set({ loading: false });
    }
  },

  cancelOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await orderAPI.cancelOrder(id);
      const updatedOrder = res.data?.data || res.data;
      
      // Update the local list
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? updatedOrder : o)),
      }));
      
      toast.success("Order cancelled successfully");
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to cancel order" });
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      set({ loading: false });
    }
  }
}));
