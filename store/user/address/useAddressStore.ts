import { create } from "zustand";
import { addressAPI } from "@/lib/api/address.api";
import { Address } from "@/types/address";

interface AddressState {
  addresses: Address[];
  loading: boolean;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: Address) => Promise<Address>;
  updateAddress: (id: string, data: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  resetAddresses: () => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,

  fetchAddresses: async () => {
    if (get().loading) {
      return;
    }

    try {
      set({ loading: true });
      const res = await addressAPI.getAll();
      set({ addresses: res.data.data, loading: false });
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
    }));

    return newAddress; // ✅ IMPORTANT
  } catch (error) {
    set({ loading: false });
    throw error;
  }
},

  updateAddress: async (id, data) => {
    try {
      set({ loading: true });
      const res = await addressAPI.update(id, data);

      set((state) => ({
        addresses: state.addresses.map((a) =>
          a._id === id ? res.data.data : a
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to update address:", error);
      set({ loading: false });
    }
  },

  deleteAddress: async (id) => {
    try {
      set({ loading: true });
      await addressAPI.delete(id);
      set((state) => ({
        addresses: state.addresses.filter((a) => a._id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to delete address:", error);
      set({ loading: false });
    }
  },

  setDefault: async (id) => {
    try {
      set({ loading: true });
      await addressAPI.setDefault(id);

      // ⭐ update local state
      set((state) => ({
        addresses: state.addresses.map((a) => ({
          ...a,
          isDefault: a._id === id,
        })),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to set default address:", error);
      set({ loading: false });
    }
  },

  resetAddresses: () => {
    set({
      addresses: [],
      loading: false,
    });
  },
}));
