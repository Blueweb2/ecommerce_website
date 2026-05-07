"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import type { Address } from "@/types/address";
import { bodoni, inter } from "@/lib/fonts";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const fieldLabels: Record<string, string> = {
  fullName: "Full Name",
  phone: "Phone Number",
  street: "Street Address",
  city: "City",
  state: "State",
  postalCode: "Postal Code",
  country: "Country",
};

const AddressBook = () => {

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { user, loading: authLoading } = useAuthStore();

  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useAddressStore();

  useEffect(() => {
    if (!authLoading && user) {
      fetchAddresses();
    }
  }, [authLoading, user]);

  const handleSubmit = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter valid phone number");
      return;
    }

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success("Address updated");
        setEditingId(null);
      } else {
        await addAddress(form);
        toast.success("Address added");
      }

      setForm(emptyForm);
    } catch (error: unknown) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Something went wrong"
      );
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({ ...addr });
    setEditingId(addr._id || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddress(id);
    toast.success("Deleted");
  };

  if (authLoading || !user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className={`${bodoni.className} text-xl font-semibold mb-4 text-neutral-600`}>My Addresses</h2>

      {/* LIST */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-gray-500 text-center border p-6 rounded">
            No addresses found
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`${inter.className} text-[#8D8B9D] border border-[#8D8B9D] p-4 flex justify-between`}
            >
              <div>
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-sm">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-sm">{addr.phone}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <button onClick={() => handleEdit(addr)} className="hover:text-black">Edit</button>
                <button onClick={() => handleDelete(addr._id!)} className="hover:text-black">
                  Delete
                </button>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr._id!)} className="hover:text-black">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORM */}
      <div className="mt-6 space-y-3">
        <h2 className={`${bodoni.className} text-xl font-semibold mb-4 text-neutral-600`}>
          {editingId ? "Edit Address" : "Add Address"}
        </h2>

        {Object.keys(emptyForm).map((key) => (
          <input
            key={key}
            placeholder={fieldLabels[key]}
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            className="w-full border p-2 outline-none border-[#8D8B9D] text-[#8D8B9D]"
          />
        ))}

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AddressBook;