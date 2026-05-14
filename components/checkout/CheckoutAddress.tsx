"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import type { Address } from "@/types/address";
import { bodoni, inter } from "@/lib/fonts";

interface CheckoutAddressProps {
  onSelect: (address: Address) => void;
}

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function CheckoutAddress({
  onSelect,
}: CheckoutAddressProps) {

  const { addresses, loading, fetchAddresses, addAddress } = useAddressStore();
  const { user, loading: authLoading } = useAuthStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const selectedAddress =
    addresses.find((addr) => addr._id === selectedId) ||
    addresses.find((addr) => addr.isDefault) ||
    addresses[0] ||
    null;

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    void fetchAddresses();
  }, [authLoading, fetchAddresses, user]);

  useEffect(() => {
    if (selectedAddress) {
      onSelect(selectedAddress);
    }
  }, [onSelect, selectedAddress]);

  const handleSave = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      const newAddress = await addAddress(form);

      setShowForm(false);
      setForm(emptyForm);
      toast.success("Address added");

      if (newAddress?._id) {
        setSelectedId(newAddress._id);
      }
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to save address"
          : "Failed to save address"
      );
    }
  };

  return (
    <div className="mt-6 w-full">
      <h2 className={`${bodoni.className} text-neutral-600 mb-4 text-[clamp(25px,2.5vw,32px)] font-normal`}>
        Select Delivery Address
      </h2>

      {loading && addresses.length === 0 ? (
        <div className="flex justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#8D8B9D]" />
        </div>
      ) : (
        <>
          <div className={`${inter.className} space-y-4`}>
            {addresses.length === 0 ? (
              <div className="border-2 border-dashed border-[#8D8B9D] py-6 text-center">
                <p className="mb-3 text-gray-500">
                  No addresses found.
                </p>

                <Link
                  href="/profile"
                  className="text-sm font-medium underline text-gray-500"
                >
                  Add an address in your profile
                </Link>
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => {
                    if (addr._id) {
                      setSelectedId(addr._id);
                    }
                  }}
                  className={`cursor-pointer border p-4 transition ${
                    selectedAddress?._id === addr._id
                      ? "border-[#8D8B9D] bg-gray-50 ring-1 ring-[#52515c]"
                      : "border-[#8D8B9D] hover:border-[#494852]"
                  }`}
                >
                  <div className="flex items-start justify-between text-neutral-600">
                    <div>
                      <p className="font-medium">
                        {addr.fullName}
                        {addr.isDefault && (
                          <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-600">
                            Default
                          </span>
                        )}
                      </p>

                      <p className="text-sm text-gray-600">
                        {addr.street}, {addr.city}, {addr.state}
                      </p>

                      <p className="text-sm text-gray-600">
                        {addr.postalCode}, {addr.country}
                      </p>

                      <p className="text-sm text-gray-600">
                        {addr.phone}
                      </p>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selectedAddress?._id === addr._id
                          ? "border-[#8D8B9D] hover:border-[#494852]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAddress?._id === addr._id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-medium underline text-neutral-600"
            >
              + Add New Address
            </button>
          </div>

          {showForm && (
            <div className={`${inter.className} mt-4 space-y-3 border border-[#8D8B9D] bg-gray-50 p-4`}>
              <h3 className={`${bodoni.className} text-neutral-600 text-[clamp(25px,2.5vw,32px)] font-normal`}>Add New Address</h3>

              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full border border-[#8D8B9D] text-[#8D8B9D] outline-none p-2"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border border-[#8D8B9D] text-[#8D8B9D] outline-none p-2"
              />

              <input
                placeholder="Street"
                value={form.street}
                onChange={(e) =>
                  setForm({ ...form, street: e.target.value })
                }
                className="w-full border-[#8D8B9D] text-[#8D8B9D] outline-none border p-2"
              />

              <div className="flex gap-2">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  className="w-full border-[#8D8B9D] text-[#8D8B9D] outline-none border p-2"
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  className="w-full border-[#8D8B9D] text-[#8D8B9D] outline-none border p-2"
                />
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  className="w-full border-[#8D8B9D] text-[#8D8B9D] outline-none border p-2"
                />
                <input
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="w-full border-[#8D8B9D] text-[#8D8B9D] outline-none border p-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-black px-4 py-2 text-white"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
