"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAddressStore } from "@/store/user/address/useAddressStore";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function AddressSection() {

  const [editingId, setEditingId] = useState<string | null>(null);
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

  const emptyForm = {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await updateAddress(editingId, form);
      setEditingId(null);
    } else {
      await addAddress(form);
    }

    setForm(emptyForm);
  };

  const handleEdit = (addr: any) => {
    setForm(addr);
    setEditingId(addr._id);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10">
          
        
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          My Profile
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>

      
      <div className="space-y-4">
        
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
          <p className="text-lg font-medium text-gray-800 capitalize">
            {user.role}
          </p>
        </div>

      </div>
      


      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

        {/* ADDRESS LIST */}
        <div className="space-y-4">
          {loading && addresses.length === 0 ? (
            <p className="text-gray-500">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="border p-4 rounded-lg flex justify-between"
              >
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

                <div className="flex flex-col gap-2 text-sm">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefault(addr._id!)}
                      disabled={loading}
                      className={`text-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Make Default
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(addr)}
                    disabled={loading}
                    className={`text-yellow-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAddress(addr._id!)}
                    disabled={loading}
                    className={`text-red-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FORM */}
        <div className="mt-6 space-y-3">
          <h3 className="font-medium">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>

          {Object.keys(emptyForm).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-black text-white px-4 py-2 rounded transition-opacity ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : editingId ? "Update Address" : "Add Address"}
          </button>
        </div>
      </div>

    </div>
  )

  // return (
  //   <div className="mt-10">
  //     <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

  //     {/* ADDRESS LIST */}
  //     <div className="space-y-4">
  //       {loading && addresses.length === 0 ? (
  //         <p className="text-gray-500">Loading addresses...</p>
  //       ) : addresses.length === 0 ? (
  //         <p className="text-gray-500">No addresses found.</p>
  //       ) : (
  //         addresses.map((addr) => (
  //           <div
  //             key={addr._id}
  //             className="border p-4 rounded-lg flex justify-between"
  //           >
  //             <div>
  //               <p className="font-medium">
  //                 {addr.fullName}
  //                 {addr.isDefault && (
  //                   <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
  //                     Default
  //                   </span>
  //                 )}
  //               </p>

  //               <p className="text-sm text-gray-600">
  //                 {addr.street}, {addr.city}, {addr.state}
  //               </p>
  //               <p className="text-sm text-gray-600">
  //                 {addr.postalCode}, {addr.country}
  //               </p>
  //               <p className="text-sm text-gray-600">
  //                 📞 {addr.phone}
  //               </p>
  //             </div>

  //             <div className="flex flex-col gap-2 text-sm">
  //               {!addr.isDefault && (
  //                 <button
  //                   onClick={() => setDefault(addr._id!)}
  //                   disabled={loading}
  //                   className={`text-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  //                 >
  //                   Make Default
  //                 </button>
  //               )}

  //               <button
  //                 onClick={() => handleEdit(addr)}
  //                 disabled={loading}
  //                 className={`text-yellow-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  //               >
  //                 Edit
  //               </button>

  //               <button
  //                 onClick={() => deleteAddress(addr._id!)}
  //                 disabled={loading}
  //                 className={`text-red-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
  //               >
  //                 Delete
  //               </button>
  //             </div>
  //           </div>
  //         ))
  //       )}
  //     </div>

  //     {/* FORM */}
  //     <div className="mt-6 space-y-3">
  //       <h3 className="font-medium">
  //         {editingId ? "Edit Address" : "Add Address"}
  //       </h3>

  //       {Object.keys(emptyForm).map((key) => (
  //         <input
  //           key={key}
  //           placeholder={key}
  //           value={(form as any)[key]}
  //           onChange={(e) =>
  //             setForm({ ...form, [key]: e.target.value })
  //           }
  //           className="w-full border p-2 rounded"
  //         />
  //       ))}

  //       <button
  //         onClick={handleSubmit}
  //         disabled={loading}
  //         className={`bg-black text-white px-4 py-2 rounded transition-opacity ${
  //           loading ? "opacity-50 cursor-not-allowed" : ""
  //         }`}
  //       >
  //         {loading ? "Processing..." : editingId ? "Update Address" : "Add Address"}
  //       </button>
  //     </div>
  //   </div>
  // );
}