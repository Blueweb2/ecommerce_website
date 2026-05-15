import { create } from "zustand";
import * as designerApi from "@/lib/api/admin/designer.api";
import type { Designer, DesignerPayload } from "@/types/designer";

interface DesignerState {
  designers: Designer[];
  loading: boolean;
  fetchDesigners: () => Promise<void>;
  createDesigner: (data: DesignerPayload) => Promise<Designer | null>;
  updateDesigner: (id: string, data: DesignerPayload) => Promise<Designer | null>;
  deleteDesigner: (id: string) => Promise<void>;
  getDesigner: (id: string) => Designer | undefined;
}

export const useDesignerStore = create<DesignerState>((set, get) => ({
  designers: [],
  loading: false,

  fetchDesigners: async () => {
    set({ loading: true });

    try {
      const designers = await designerApi.getDesigners();
      set({ designers });
    } catch (error) {
      console.error("Fetch designers error:", error);
      set({ designers: [] });
    } finally {
      set({ loading: false });
    }
  },

  createDesigner: async (data) => {
    const created = await designerApi.createDesigner(data);

    if (created) {
      set((state) => ({
        designers: [created, ...state.designers],
      }));
    }

    return created;
  },

  updateDesigner: async (id, data) => {
    const updated = await designerApi.updateDesigner(id, data);

    if (updated) {
      set((state) => ({
        designers: state.designers.map((designer) =>
          designer._id === id ? updated : designer
        ),
      }));
    }

    return updated;
  },

  deleteDesigner: async (id) => {
    await designerApi.deleteDesigner(id);

    set((state) => ({
      designers: state.designers.filter((designer) => designer._id !== id),
    }));
  },

  getDesigner: (id) => get().designers.find((designer) => designer._id === id),
}));
