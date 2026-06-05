import { create } from "zustand";
import { DesignerCouponTypes } from "../../types/designer";

interface DesignerCouponState extends DesignerCouponTypes {
  setCoupons: (coupons: any[]) => void;
  setCurrentCoupon: (coupon: any | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDesignerCouponStore = create<DesignerCouponState>((set) => ({
  coupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
  setCoupons: (coupons) => set({ coupons, error: null }),
  setCurrentCoupon: (currentCoupon) => set({ currentCoupon, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
