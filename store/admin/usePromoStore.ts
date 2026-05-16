import { create } from "zustand";
import api from "@/lib/api/axios";

export interface PromoCode {
  _id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoPayload {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  isActive: boolean;
}

interface PromoState {
  promos: PromoCode[];
  loading: boolean;
  fetchPromos: () => Promise<void>;
  createPromo: (data: PromoPayload) => Promise<void>;
  updatePromo: (id: string, data: Partial<PromoPayload>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
  sendPromoMail: (id: string) => Promise<void>;

}

export const usePromoStore = create<PromoState>((set, get) => ({
  promos: [],
  loading: false,

  fetchPromos: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/promo");
      set({ promos: res.data.data });
    } catch (err) {
      console.error("Fetch promos failed", err);
    } finally {
      set({ loading: false });
    }
  },

  createPromo: async (data) => {
    try {
      await api.post("/promo", data);
      await get().fetchPromos();
    } catch (err) {
      console.error("Create promo failed", err);
      throw err;
    }
  },

  updatePromo: async (id, data) => {
    try {
      await api.patch(`/promo/${id}`, data);
      await get().fetchPromos();
    } catch (err) {
      console.error("Update promo failed", err);
      throw err;
    }
  },

  deletePromo: async (id) => {
    try {
      await api.delete(`/promo/${id}`);
      set({ promos: get().promos.filter((p) => p._id !== id) });
    } catch (err) {
      console.error("Delete promo failed", err);
      throw err;
    }
  },


  sendPromoMail: async (id) => {
    try {
      await api.post(`/promo/${id}/send-mail`);
    } catch (err) {
      console.error("Send promo mail failed", err);
      throw err;
    }
  },
}));
