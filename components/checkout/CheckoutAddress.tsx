"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import type { Address } from "@/types/address";
import { bodoni, inter } from "@/lib/fonts";
import {
  formatPhoneInput,
  getPhoneValidationError,
  normalizePhoneNumber,
} from "@/lib/utils/phone";

interface CheckoutAddressProps {
  onSelect: (address: Address) => void;
}

const emptyForm = {
  firstName: "",
  lastName: "",
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
  const closeForm = () => {
  setShowForm(false);
  setForm(emptyForm);
};

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

    const phoneError = getPhoneValidationError(form.phone);

    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    try {
      console.log("[CheckoutAddress] Raw form data before addAddress:", form);
      const newAddress = await addAddress({
        ...form,
        phone: normalizePhoneNumber(form.phone),
      });
      console.log("[CheckoutAddress] Resulting newAddress from addAddress:", newAddress);

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
      <h2 className={`${bodoni.className} text-neutral-600 mb-4 text-[24px] font-normal`}>
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
                  href="/account/addresses"
                  className="text-sm font-medium underline text-gray-500"
                >
                  Add an address in your account
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
                  className={`cursor-pointer border p-4 transition ${selectedAddress?._id === addr._id
                      ? "border-[#8D8B9D] bg-gray-50 ring-1 ring-[#52515c]"
                      : "border-[#8D8B9D] hover:border-[#494852]"
                    }`}
                >
                  <div className="flex items-start justify-between text-neutral-600">
                    <div>
                      <p className="font-medium">
                        {addr.firstName} {addr.lastName}
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
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedAddress?._id === addr._id
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
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
    <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto bg-white p-10 shadow-2xl">
      
      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between border-b border-[#e5e5e5] pb-5">
        <h2
          className={`${bodoni.className} text-[34px] font-normal text-black`}
        >
          Add Address
        </h2>

        <button
          type="button"
          onClick={closeForm}
          className="text-[28px] leading-none text-[#777] transition hover:text-black"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* FORM */}
      <div className={`${inter.className} space-y-7`}>
        
        {/* NAME */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              First Name
            </label>

            <input
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>
          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              Last Name (Optional)
            </label>

            <input
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
            Phone Number
          </label>

          <input
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                phone: formatPhoneInput(event.target.value),
              }))
            }
            maxLength={10}
            inputMode="numeric"
            className="
              h-[54px]
              w-full
              border
              border-[#d7d7d7]
              bg-white
              px-4
              text-[15px]
              outline-none
              transition
              focus:border-black
            "
          />
        </div>

        {/* STREET */}
        <div>
          <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
            Street Address
          </label>

          <input
            value={form.street}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                street: event.target.value,
              }))
            }
            className="
              h-[54px]
              w-full
              border
              border-[#d7d7d7]
              bg-white
              px-4
              text-[15px]
              outline-none
              transition
              focus:border-black
            "
          />
        </div>

        {/* CITY + STATE */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              City
            </label>

            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  city: event.target.value,
                }))
              }
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              State
            </label>

            <input
              value={form.state}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  state: event.target.value,
                }))
              }
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>
        </div>

        {/* POSTAL + COUNTRY */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              Postal Code
            </label>

            <input
              value={form.postalCode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  postalCode: event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                }))
              }
              maxLength={6}
              inputMode="numeric"
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] uppercase tracking-[0.15em] text-[#666]">
              Country
            </label>

            <input
              value={form.country}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  country: event.target.value,
                }))
              }
              className="
                h-[54px]
                w-full
                border
                border-[#d7d7d7]
                bg-white
                px-4
                text-[15px]
                outline-none
                transition
                focus:border-black
              "
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex items-center justify-end gap-4 border-t border-[#e5e5e5] pt-6">
        <button
          type="button"
          onClick={closeForm}
          className="
            text-[13px]
            uppercase
            tracking-[0.15em]
            text-[#666]
            transition
            hover:text-black
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => void handleSave()}
          className="
            h-[54px]
            min-w-[220px]
            bg-black
            px-8
            text-[13px]
            uppercase
            tracking-[0.18em]
            text-white
            transition
            hover:bg-[#222]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          Save Address
        </button>
      </div>
    </div>
  </div>
)}
        </>
      )}
    </div>
  );
}
