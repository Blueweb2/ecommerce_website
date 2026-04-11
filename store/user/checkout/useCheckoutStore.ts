import { create } from "zustand";

interface CheckoutState {
  selectedAddressId: string | null;
  setAddress: (id: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedAddressId: null,

  setAddress: (id) => set({ selectedAddressId: id }),
}));