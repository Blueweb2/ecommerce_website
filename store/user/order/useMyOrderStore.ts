import { create } from "zustand";
import toast from "react-hot-toast";
import { orderAPI } from "@/lib/api/order.api";
import { Order } from "@/types/order";

interface MyOrderStore {
  orders: Order[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  fetchMyOrders: (page?: number, limit?: number, force?: boolean) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  requestReturn: (id: string, reason: string) => Promise<void>;
}

const emptyPagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
};

export const useMyOrderStore = create<MyOrderStore>((set, get) => ({
  orders: [],
  loading: false,
  loaded: false,
  error: null,
  pagination: emptyPagination,

  fetchMyOrders: async (page = 1, limit = 10, force = false) => {
    if (get().loading || (get().loaded && !force)) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await orderAPI.getMyOrders(page, limit);
      const data = res.data?.data || res.data;

      set({
        orders: data.orders || [],
        pagination: data.pagination || emptyPagination,
        loaded: true,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message || "Failed to fetch your orders"
          : "Failed to fetch your orders";

      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  cancelOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await orderAPI.cancelOrder(id);
      const updatedOrder = res.data?.data || res.data;

      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? updatedOrder : o)),
      }));

      toast.success("Order cancelled successfully");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message || "Failed to cancel order"
          : "Failed to cancel order";

      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  requestReturn: async (id: string, reason: string) => {
    set({ loading: true, error: null });
    try {
      const res = await orderAPI.requestReturn(id, reason);
      const updatedOrder = res.data?.data || res.data;

      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? updatedOrder : o)),
      }));

      toast.success("Return requested successfully");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message || "Failed to request return"
          : "Failed to request return";

      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));
