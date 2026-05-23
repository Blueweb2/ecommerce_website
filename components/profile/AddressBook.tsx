"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import type { Address, AddressInput } from "@/types/address";
import { inter } from "@/lib/fonts";
import {
  formatPhoneInput,
  getPhoneValidationError,
  normalizePhoneNumber,
} from "@/lib/utils/phone";

const emptyForm: AddressInput = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const toFormData = (address: Address): AddressInput => ({
  fullName: address.fullName,
  phone: address.phone,
  street: address.street,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
  isDefault: address.isDefault ?? false,
});

const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong";
  }

  const data = error.response?.data as
    | { message?: string; errors?: { message?: string }[] }
    | undefined;

  if (data?.errors?.length) {
    return data.errors.map((entry) => entry.message).filter(Boolean).join(", ");
  }

  return data?.message || "Something went wrong";
};

export default function AddressBook() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuthStore();

  const {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddressStore();

  useEffect(() => {
    if (!authLoading && user) {
      void fetchAddresses();
    }
  }, [authLoading, fetchAddresses, user]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (address: Address) => {
    setEditingId(address._id || null);
    setForm(toFormData(address));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof AddressInput)[] = [
      "fullName",
      "phone",
      "street",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    if (requiredFields.some((field) => !String(form[field] || "").trim())) {
      toast.error("Please fill in all address fields");
      return;
    }

    const phoneError = getPhoneValidationError(form.phone);

    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      toast.error("Postal code must be 6 digits");
      return;
    }

    const payload: AddressInput = {
      ...form,
      fullName: form.fullName.trim(),
      phone: normalizePhoneNumber(form.phone),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await updateAddress(editingId, payload);
        toast.success("Address updated");
      } else {
        await addAddress(payload);
        toast.success("Address added");
      }

      closeForm();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) {
      return;
    }

    try {
      await deleteAddress(id);
      toast.success("Address deleted");

      if (editingId === id) {
        closeForm();
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id);
      toast.success("Default address updated");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="py-10 text-center text-gray-500">Loading...</div>
    );
  }

  return (
    <div className={`${inter.className} px-4`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <button
          type="button"
          onClick={openCreateForm}
          className="group flex min-h-[210px] cursor-pointer items-center justify-center border border-black/10 bg-white transition hover:border-black/30"
        >
          <span className="flex items-center gap-3 text-black">
            <span className="-mt-1 text-[35px] font-light">+</span>
            <span className="text-[14px] font-normal group-hover:opacity-70">
              Add an address
            </span>
          </span>
        </button>

        {loading && addresses.length === 0 ? (
          <div className="flex min-h-[210px] items-center justify-center border border-black/10 bg-white text-gray-500">
            Loading addresses...
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="flex min-h-[210px] flex-col justify-between border border-black/10 bg-white px-5 pt-7"
            >
              <div className="space-y-1 text-[15px] text-black">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{address.fullName}</p>
                  {address.isDefault && (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] uppercase tracking-wide text-emerald-700">
                      Default
                    </span>
                  )}
                </div>
                <p>{address.phone}</p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6 border-t border-black/15 py-3">
                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  className="cursor-pointer text-[15px] hover:opacity-65"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(address._id!)}
                  className="cursor-pointer text-[15px] hover:opacity-65"
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => void handleSetDefault(address._id!)}
                    className="cursor-pointer text-[15px] hover:opacity-65"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">
                {editingId ? "Edit address" : "Add address"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-2xl leading-none text-gray-500 hover:text-black"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                  Full name
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                  Phone
                </span>
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
                  className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                  Street address
                </span>
                <input
                  value={form.street}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, street: event.target.value }))
                  }
                  className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                    City
                  </span>
                  <input
                    value={form.city}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, city: event.target.value }))
                    }
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                    State
                  </span>
                  <input
                    value={form.state}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, state: event.target.value }))
                    }
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                    Postal code
                  </span>
                  <input
                    value={form.postalCode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        postalCode: event.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">
                    Country
                  </span>
                  <input
                    value={form.country}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, country: event.target.value }))
                    }
                    className="w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 pt-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.isDefault)}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isDefault: event.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="bg-black px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update address"
                    : "Save address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
