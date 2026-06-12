import { create } from "zustand";
import * as portalApi from "@/lib/api/designer/designer-portal.api";
import type { Designer, DesignerProfilePayload } from "@/types/designer";

// ─── Completion helpers ───────────────────────────────────────────────────────

export type ProfileSection = {
  key: string;
  label: string;
  weight: number;
  isComplete: boolean;
};

function computeSections(designer: Designer | null): ProfileSection[] {
  if (!designer) {
    return [
      { key: "brand", label: "Brand Information", weight: 20, isComplete: false },
      { key: "business", label: "Business Information", weight: 20, isComplete: false },
      { key: "address", label: "Address", weight: 20, isComplete: false },
      { key: "categories", label: "Categories", weight: 20, isComplete: false },
      { key: "images", label: "Images", weight: 20, isComplete: false },
    ];
  }

  return [
    {
      key: "brand",
      label: "Brand Information",
      weight: 20,
      isComplete: !!(designer.brandName?.trim() && designer.description?.trim()),
    },
    {
      key: "business",
      label: "Business Information",
      weight: 20,
      isComplete: !!(designer.businessName?.trim() && designer.phone?.trim() && designer.gstNumber?.trim() && designer.website?.trim()),
    },
    {
      key: "address",
      label: "Address",
      weight: 20,
      isComplete: !!(designer.address?.addressLine1?.trim() && designer.address?.city?.trim() && designer.address?.district?.trim() && designer.address?.state?.trim() && designer.address?.country?.trim() && designer.address?.pincode?.trim()),
    },
    {
      key: "categories",
      label: "Categories",
      weight: 20,
      isComplete: Array.isArray(designer.categories) && designer.categories.length > 0,
    },
    {
      key: "images",
      label: "Images",
      weight: 20,
      isComplete: !!(designer.avatar?.url && designer.brandImage?.url && designer.bannerImage?.url),
    },
  ];
}

function computeCompletion(sections: ProfileSection[]): number {
  const total = sections.reduce((acc, s) => acc + s.weight, 0);
  const completed = sections
    .filter((s) => s.isComplete)
    .reduce((acc, s) => acc + s.weight, 0);
  return Math.round((completed / total) * 100);
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface DesignerProfileState {
  profile: Designer | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  sections: ProfileSection[];
  completionPercentage: number;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: DesignerProfilePayload) => Promise<void>;
  clearError: () => void;
}

export const useDesignerProfileStore = create<DesignerProfileState>((set) => ({
  profile: null,
  loading: false,
  saving: false,
  error: null,
  sections: computeSections(null),
  completionPercentage: 0,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const designer = await portalApi.getMyProfile();
      const sections = computeSections(designer);
      set({
        profile: designer,
        sections,
        completionPercentage: computeCompletion(sections),
      });
    } catch (err: any) {
      set({ error: err?.message || "Failed to load profile" });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ saving: true, error: null });
    try {
      const updated = await portalApi.updateMyProfile(data);
      if (updated) {
        const sections = computeSections(updated);
        set({
          profile: updated,
          sections,
          completionPercentage: computeCompletion(sections),
        });
      }
    } catch (err: any) {
      set({ error: err?.message || "Failed to update profile" });
      throw err;
    } finally {
      set({ saving: false });
    }
  },

  clearError: () => set({ error: null }),
}));
