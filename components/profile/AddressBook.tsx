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

  // const handleSubmit = async () => {
  //   if (Object.values(form).some((value) => !value.trim())) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }

  //   if (!/^\d{10}$/.test(form.phone)) {
  //     toast.error("Enter valid phone number");
  //     return;
  //   }

  //   try {
  //     if (editingId) {
  //       await updateAddress(editingId, form);
  //       toast.success("Address updated");
  //       setEditingId(null);
  //     } else {
  //       await addAddress(form);
  //       toast.success("Address added");
  //     }

  //     setForm(emptyForm);
  //   } catch (error: unknown) {
  //     toast.error(
  //       axios.isAxiosError(error)
  //         ? error.response?.data?.message
  //         : "Something went wrong"
  //     );
  //   }
  // };

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
    <div className={`${inter.className} px-4`}>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ADD ADDRESS CARD */}
        <div className="border cursor-pointer group border-black/10 bg-white min-h-[210px] flex items-center justify-center">
          <button className="flex items-center gap-3 text-[28px] text-black transition">
            <span className="text-[35px] font-light -mt-1">+</span>

            <span className="text-[14px] font-normal group-hover:opacity-70">
              Add an address
            </span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-gray-500 text-center border p-6">
            No addresses found
          </div>
        ) : (
          addresses.map((addr) => (
            <div className="border border-black/10 bg-white px-5 pt-7 flex flex-col justify-between">
              
              {/* ADDRESS DETAILS */}
              <div className="space-y-1 text-[15px] text-black">
                <p>{addr.fullName}</p>
                <p>{addr.phone}</p>
                <p>{addr.street}, {addr.city}</p>
              </div>

              {/* ACTIONS */}
              <div className="border-t border-black/15 py-3 flex items-center gap-8">
                <button onClick={() => handleEdit(addr)} className="text-[15px] hover:opacity-65 cursor-pointer">
                  Edit
                </button>

                <button onClick={() => handleDelete(addr._id!)} className="text-[15px] hover:opacity-65 cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressBook;