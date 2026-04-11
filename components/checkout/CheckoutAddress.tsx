"use client";

import { useEffect, useState } from "react";
import { useAddressStore } from "@/store/user/address/useAddressStore";

export default function CheckoutAddress() {
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ⭐ Auto-select default address
  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.isDefault);
    if (defaultAddr) setSelectedId(defaultAddr._id!);
  }, [addresses]);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            onClick={() => setSelectedId(addr._id!)}
            className={`border p-4 rounded-lg cursor-pointer transition 
              ${selectedId === addr._id ? "border-black bg-gray-50" : ""}
            `}
          >
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
        ))}
      </div>

      {/* EMPTY STATE */}
      {addresses.length === 0 && (
        <p className="text-gray-500 mt-4">
          No addresses found. Please add one in your profile.
        </p>
      )}
    </div>
  );
}