import { create } from "zustand";
import { addressAPI } from "@/lib/api/address.api";
import { Address } from "@/types/address";

interface AddressState {
  addresses: Address[];
  loading: boolean;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: Address) => Promise<void>;
  updateAddress: (id: string, data: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  loading: false,

  fetchAddresses: async () => {
    const res = await addressAPI.getAll();
    set({ addresses: res.data.data });
  },

  addAddress: async (data) => {
    const res = await addressAPI.create(data);
    set((state) => ({
      addresses: [...state.addresses, res.data.data],
    }));
  },

  updateAddress: async (id, data) => {
    const res = await addressAPI.update(id, data);

    set((state) => ({
      addresses: state.addresses.map((a) =>
        a._id === id ? res.data.data : a
      ),
    }));
  },

  deleteAddress: async (id) => {
    await addressAPI.delete(id);
    set((state) => ({
      addresses: state.addresses.filter((a) => a._id !== id),
    }));
  },

  setDefault: async (id) => {
    await addressAPI.setDefault(id);

    // ⭐ update local state
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a._id === id,
      })),
    }));
  },
}));