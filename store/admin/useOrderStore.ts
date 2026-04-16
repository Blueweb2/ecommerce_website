import { create } from "zustand";
import { adminOrderAPI } from "@/lib/api/admin/order.api";
import toast from "react-hot-toast";

import { Order } from "@/types/order";

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };

  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10, pages: 1 },

  fetchOrders: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await adminOrderAPI.getAllOrders(page, limit);
      // Ensure we extract the nested `data` based on standard sendResponse wrapping
      const data = res.data?.data || res.data;
      set({ 
        orders: data.orders || [], 
        pagination: data.pagination || { total: 0, page: 1, limit: 10, pages: 1 } 
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch orders" });
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderDetails: async (id: string) => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const res = await adminOrderAPI.getOrderById(id);
      const data = res.data?.data || res.data;
      set({ currentOrder: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch order details" });
      toast.error("Failed to load order details");
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const res = await adminOrderAPI.updateOrderStatus(id, status);
      const updatedOrder = res.data?.data || res.data;
      
      // Update the local list
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? updatedOrder : o)),
        currentOrder: state.currentOrder?._id === id ? updatedOrder : state.currentOrder,
      }));
      
      toast.success("Order status updated successfully");
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update status" });
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id: string) => {
     set({ loading: true, error: null });
    try {
      await adminOrderAPI.deleteOrder(id);
      
      // Remove from local list
      set((state) => ({
        orders: state.orders.filter((o) => o._id !== id),
      }));
      
      toast.success("Order deleted successfully");
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete order" });
      toast.error(err.response?.data?.message || "Failed to delete order");
    } finally {
      set({ loading: false });
    }
  }
}));
