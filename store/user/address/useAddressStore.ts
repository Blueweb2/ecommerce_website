import { create } from "zustand";
import { addressAPI } from "@/lib/api/address.api";
import type { Address, AddressInput } from "@/types/address";

interface AddressState {
  addresses: Address[];
  loading: boolean;
  loaded: boolean;
  fetchAddresses: (force?: boolean) => Promise<void>;
  addAddress: (data: AddressInput) => Promise<Address>;
  updateAddress: (id: string, data: Partial<AddressInput>) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  resetAddresses: () => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  loaded: false,

  fetchAddresses: async (force = false) => {
    if (get().loading || (get().loaded && !force)) {
      return;
    }

    try {
      set({ loading: true });
      const res = await addressAPI.getAll();
      set({
        addresses: res.data.data,
        loading: false,
        loaded: true,
      });
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      set({ loading: false });
    }
  },

  addAddress: async (data) => {
    try {
      set({ loading: true });
      const res = await addressAPI.create(data);
      const newAddress = res.data.data;

      set((state) => ({
        addresses: [...state.addresses, newAddress],
        loading: false,
        loaded: true,
      }));

      return newAddress;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateAddress: async (id, data) => {
    try {
      set({ loading: true });
      const res = await addressAPI.update(id, data);
      const updatedAddress = res.data.data as Address;

      set((state) => ({
        addresses: state.addresses.map((a) =>
          a._id === id ? updatedAddress : a
        ),
        loading: false,
        loaded: true,
      }));

      return updatedAddress;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteAddress: async (id) => {
    try {
      set({ loading: true });
      await addressAPI.delete(id);
      set((state) => ({
        addresses: state.addresses.filter((a) => a._id !== id),
        loading: false,
        loaded: true,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  setDefault: async (id) => {
    try {
      set({ loading: true });
      const res = await addressAPI.setDefault(id);
      const defaultAddress = res.data.data as Address;

      set((state) => ({
        addresses: state.addresses.map((a) => ({
          ...a,
          isDefault: a._id === defaultAddress._id,
        })),
        loading: false,
        loaded: true,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  resetAddresses: () => {
    set({
      addresses: [],
      loading: false,
      loaded: false,
    });
  },
}));
