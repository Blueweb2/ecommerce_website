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

  fetchOrders: (page?: number, limit?: number, customerType?: string) => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  /*  ADD THESE */
  approveRefund: (id: string) => Promise<void>;
  rejectRefund: (id: string) => Promise<void>;
  approveReturn: (id: string) => Promise<void>;
  rejectReturn: (id: string) => Promise<void>;
  markReturnReceived: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 20, pages: 1 },

  fetchOrders: async (page = 1, limit = 20, customerType?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await adminOrderAPI.getAllOrders(page, limit, customerType);
      const data = res.data?.data || res.data;

      set({
        orders: data.orders || [],
        pagination:
          data.pagination || { total: 0, page: 1, limit: 10, pages: 1 },
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to fetch orders",
      });
      toast.error("Failed to fetch orders");
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

      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === id ? updatedOrder : o
        ),
        currentOrder:
          state.currentOrder?._id === id
            ? updatedOrder
            : state.currentOrder,
      }));

      toast.success("Order updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id: string) => {
    set({ loading: true });
    try {
      await adminOrderAPI.deleteOrder(id);

      set((state) => ({
        orders: state.orders.filter((o) => o._id !== id),
      }));

      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      set({ loading: false });
    }
  },

  /*  REFUND ACTIONS */
  approveRefund: async (id: string) => {
    try {
      await adminOrderAPI.approveRefund(id);
      toast.success("Refund approved");
      get().fetchOrders();
    } catch {
      toast.error("Failed to approve refund");
    }
  },

  rejectRefund: async (id: string) => {
    try {
      await adminOrderAPI.rejectRefund(id);
      toast.success("Refund rejected");
      get().fetchOrders();
    } catch {
      toast.error("Failed to reject refund");
    }
  },

  /*  RETURN ACTIONS */
  approveReturn: async (id: string) => {
    try {
      await adminOrderAPI.approveReturn(id);
      toast.success("Return approved");
      get().fetchOrders();
    } catch {
      toast.error("Failed to approve return");
    }
  },

  rejectReturn: async (id: string) => {
    try {
      await adminOrderAPI.rejectReturn(id);
      toast.success("Return rejected");
      get().fetchOrders();
    } catch {
      toast.error("Failed to reject return");
    }
  },

  markReturnReceived: async (id: string) => {
    try {
      await adminOrderAPI.markReturnReceived(id);
      toast.success("Return marked as received");
      get().fetchOrders();
    } catch {
      toast.error("Failed to mark return as received");
    }
  },
}));