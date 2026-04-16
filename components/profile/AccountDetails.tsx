"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import type { Address } from "@/types/address";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export default function AccountDetails() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { user, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();

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
    if (authLoading || !user) {
      return;
    }

    void fetchAddresses();
  }, [authLoading, fetchAddresses, user]);

  const handleSubmit = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        setEditingId(null);
        toast.success("Address updated");
      } else {
        await addAddress(form);
        toast.success("Address added");
      }

      setForm(emptyForm);
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to save address"
          : "Failed to save address"
      );
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });

    if (addr._id) {
      setEditingId(addr._id);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-md md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Profile
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="space-y-4 border-b pb-6">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium text-gray-800">
            {user.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium text-gray-800">
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-lg font-medium capitalize text-gray-800">
            {user.role}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">My Addresses</h2>

        <div className="space-y-4">
          {loading && addresses.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              Loading addresses...
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed py-6 text-center text-gray-500">
              No addresses found.
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
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

                <div className="flex flex-col gap-2 text-right text-sm">
                  {!addr.isDefault && (
                    <button
                      onClick={() => {
                        if (addr._id) {
                          void setDefault(addr._id);
                        }
                      }}
                      disabled={loading}
                      className={`text-blue-500 hover:underline ${
                        loading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      Make Default
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(addr)}
                    disabled={loading}
                    className={`text-yellow-600 hover:underline ${
                      loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (addr._id) {
                        void deleteAddress(addr._id);
                      }
                    }}
                    disabled={loading}
                    className={`text-red-500 hover:underline ${
                      loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>

          <div className="grid gap-3">
            {Object.keys(emptyForm).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={(form as Record<string, string>)[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full rounded border p-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`rounded bg-black px-5 py-2 text-white transition ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-800"
              }`}
            >
              {loading
                ? "Processing..."
                : editingId
                  ? "Update Address"
                  : "Add Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
