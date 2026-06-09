import { create } from "zustand";
import * as designerApi from "@/lib/api/admin/designer.api";
import type {
  AdminCreateDesignerPayload,
  AdminStorefrontPayload,
  Designer,
  DesignerPayload,
} from "@/types/designer";

interface DesignerState {
  designers: Designer[];
  currentDesigner: Designer | null;
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;

  fetchDesigners: (params?: {
    search?: string;
    isActive?: boolean;
    isVerified?: boolean;
    verificationStatus?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  fetchDesignerById: (id: string) => Promise<Designer | null>;

  createDesigner: (data: AdminCreateDesignerPayload) => Promise<Designer | null>;
  updateDesigner: (id: string, data: DesignerPayload) => Promise<Designer | null>;
  updateStorefront: (id: string, data: AdminStorefrontPayload) => Promise<Designer | null>;
  approveDesigner: (id: string) => Promise<Designer | null>;
  rejectDesigner: (id: string, reason?: string) => Promise<Designer | null>;
  resetPassword: (id: string) => Promise<void>;
  deleteDesigner: (id: string) => Promise<void>;

  getDesigner: (id: string) => Designer | undefined;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  designers: [],
  currentDesigner: null,
  loading: false,
  total: 0,
  page: 1,
  totalPages: 1,

  // ─── Fetch list ────────────────────────────────────────────────────────────

  fetchDesigners: async (params) => {
    set({ loading: true });
    try {
      const result = await designerApi.getDesigners(params);
      set({
        designers: result.designers,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error("Fetch designers error:", error);
      set({ designers: [] });
    } finally {
      set({ loading: false });
    }
  },

  // ─── Fetch single ──────────────────────────────────────────────────────────

  fetchDesignerById: async (id) => {
    set({ loading: true });
    try {
      const designer = await designerApi.getDesignerById(id);
      set({ currentDesigner: designer });
      return designer;
    } catch (error) {
      console.error("Fetch designer error:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // ─── Create ────────────────────────────────────────────────────────────────

  createDesigner: async (data) => {
    const created = await designerApi.createDesigner(data);
    if (created) {
      set((state) => ({ designers: [created, ...state.designers] }));
    }
    return created;
  },

  // ─── Full update ───────────────────────────────────────────────────────────

  updateDesigner: async (id, data) => {
    const updated = await designerApi.updateDesigner(id, data);
    if (updated) {
      set((state) => ({
        designers: state.designers.map((d) => (d._id === id ? updated : d)),
        currentDesigner:
          state.currentDesigner?._id === id ? updated : state.currentDesigner,
      }));
    }
    return updated;
  },

  // ─── Storefront controls ───────────────────────────────────────────────────

  updateStorefront: async (id, data) => {
    const updated = await designerApi.updateDesignerStorefront(id, data);
    if (updated) {
      set((state) => ({
        designers: state.designers.map((d) => (d._id === id ? updated : d)),
        currentDesigner:
          state.currentDesigner?._id === id ? updated : state.currentDesigner,
      }));
    }
    return updated;
  },

  // ─── Approve ──────────────────────────────────────────────────────────────

  approveDesigner: async (id) => {
    const updated = await designerApi.approveDesigner(id);
    if (updated) {
      set((state) => ({
        designers: state.designers.map((d) => (d._id === id ? updated : d)),
        currentDesigner:
          state.currentDesigner?._id === id ? updated : state.currentDesigner,
      }));
    }
    return updated;
  },

  // ─── Reject ───────────────────────────────────────────────────────────────

  rejectDesigner: async (id, reason) => {
    const updated = await designerApi.rejectDesigner(id, reason);
    if (updated) {
      set((state) => ({
        designers: state.designers.map((d) => (d._id === id ? updated : d)),
        currentDesigner:
          state.currentDesigner?._id === id ? updated : state.currentDesigner,
      }));
    }
    return updated;
  },

  // ─── Reset password ────────────────────────────────────────────────────────

  resetPassword: async (id) => {
    await designerApi.adminResetPassword(id);
  },

  // ─── Delete ───────────────────────────────────────────────────────────────

  deleteDesigner: async (id) => {
    await designerApi.deleteDesigner(id);
    set((state) => ({
      designers: state.designers.filter((d) => d._id !== id),
      currentDesigner:
        state.currentDesigner?._id === id ? null : state.currentDesigner,
    }));
  },

  // ─── Local lookup ──────────────────────────────────────────────────────────

  getDesigner: (id) => get().designers.find((d) => d._id === id),
}));
