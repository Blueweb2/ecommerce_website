"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAddressStore } from "@/store/user/address/useAddressStore";

export default function CheckoutAddress() {
  const { addresses, loading, fetchAddresses } = useAddressStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ⭐ Auto-select default address
  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.isDefault);
    if (defaultAddr) setSelectedId(defaultAddr._id!);
    else if (addresses.length > 0 && !selectedId) setSelectedId(addresses[0]._id!);
  }, [addresses]);

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>

      {loading && addresses.length === 0 ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setSelectedId(addr._id!)}
              className={`border p-4 rounded-lg cursor-pointer transition 
                ${selectedId === addr._id ? "border-black bg-gray-50 ring-1 ring-black" : "hover:border-gray-400"}
              `}
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
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedId === addr._id ? 'border-black' : 'border-gray-300'}`}>
                  {selectedId === addr._id && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {addresses.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-3">No addresses found.</p>
              <Link href="/profile" className="text-sm font-medium underline">
                Add an address in your profile
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}