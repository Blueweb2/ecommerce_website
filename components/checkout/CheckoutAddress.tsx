"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import type { Address } from "@/types/address";

interface CheckoutAddressProps {
  onSelect: (address: Address) => void;
}

export default function CheckoutAddress({ onSelect }: CheckoutAddressProps) {
  const { addresses, loading, fetchAddresses, addAddress } =
    useAddressStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // ✅ fetch addresses
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ✅ select default / current
  useEffect(() => {
    if (!addresses.length) return;

    const defaultAddr = addresses.find((a) => a.isDefault);

    const selected =
      addresses.find((a: Address) => a._id === selectedId) ||
      defaultAddr ||
      addresses[0];

    if (selected?._id && selected._id !== selectedId) {
      setSelectedId(selected._id);
    }

    if (selected) {
      onSelect(selected);
    }
  }, [addresses, selectedId, onSelect]);

  // ✅ save new address
  const handleSave = async () => {
    const newAddress = await addAddress(form);

    setShowForm(false);

    if (newAddress?._id) {
      setSelectedId(newAddress._id);
    }

    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Select Delivery Address
      </h2>

      {loading && addresses.length === 0 ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          {/* 🔹 ADDRESS LIST */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed rounded-lg">
                <p className="text-gray-500 mb-3">
                  No addresses found.
                </p>

                <Link
                  href="/profile"
                  className="text-sm font-medium underline"
                >
                  Add an address in your profile
                </Link>
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => {
                    if (addr._id) setSelectedId(addr._id);
                  }}
                  className={`border p-4 rounded-lg cursor-pointer transition 
                  ${selectedId === addr._id
                      ? "border-black bg-gray-50 ring-1 ring-black"
                      : "hover:border-gray-400"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {addr.fullName}
                        {addr.isDefault && (
                          <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
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
                        📞 {addr.phone}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedId === addr._id
                          ? "border-black"
                          : "border-gray-300"
                        }`}
                    >
                      {selectedId === addr._id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 🔹 ADD NEW ADDRESS BUTTON */}
          <div className="mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-medium underline"
            >
              + Add New Address
            </button>
          </div>

          {/* 🔹 FORM */}
          {showForm && (
            <div className="border p-4 rounded-lg mt-4 space-y-3 bg-gray-50">
              <h3 className="font-semibold">Add New Address</h3>

              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                placeholder="Street"
                value={form.street}
                onChange={(e) =>
                  setForm({ ...form, street: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-2">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="w-full border p-2 rounded"
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
                  className="bg-black text-white px-4 py-2 rounded"
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