// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { useAddressStore } from "@/store/user/address/useAddressStore";
// import { useAuthStore } from "@/store/auth/useAuthStore";
// import type { Address } from "@/types/address";

// const emptyForm = {
//   fullName: "",
//   phone: "",
//   street: "",
//   city: "",
//   state: "",
//   postalCode: "",
//   country: "",
// };

// const fieldLabels: Record<string, string> = {
//   fullName: "Full Name",
//   phone: "Phone Number",
//   street: "Street Address",
//   city: "City",
//   state: "State",
//   postalCode: "Postal Code",
//   country: "Country",
// };

// export default function AccountDetails() {
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [form, setForm] = useState(emptyForm);

//   const { user, logout, loading: authLoading } = useAuthStore();
//   const router = useRouter();

//   const {
//     addresses,
//     loading,
//     fetchAddresses,
//     addAddress,
//     updateAddress,
//     deleteAddress,
//     setDefault,
//   } = useAddressStore();

//   // ✅ FIXED useEffect (no unnecessary dependency)
//   useEffect(() => {
//     if (!authLoading && user) {
//       fetchAddresses();
//     }
//   }, [authLoading, user]);

//   // ✅ FORM VALIDATION
//   const handleSubmit = async () => {
//     if (Object.values(form).some((value) => !value.trim())) {
//       toast.error("Please fill in all address fields");
//       return;
//     }

//     // ✅ Phone validation (India basic)
//     if (!/^\d{10}$/.test(form.phone)) {
//       toast.error("Enter valid 10-digit phone number");
//       return;
//     }

//     try {
//       if (editingId) {
//         await updateAddress(editingId, form);
//         setEditingId(null);
//         toast.success("Address updated");
//       } else {
//         await addAddress(form);
//         toast.success("Address added");
//       }

//       setForm(emptyForm);
//     } catch (error: unknown) {
//       toast.error(
//         axios.isAxiosError(error)
//           ? error.response?.data?.message || "Failed to save address"
//           : "Failed to save address"
//       );
//     }
//   };

//   // ✅ EDIT
//   const handleEdit = (addr: Address) => {
//     setForm({
//       fullName: addr.fullName,
//       phone: addr.phone,
//       street: addr.street,
//       city: addr.city,
//       state: addr.state,
//       postalCode: addr.postalCode,
//       country: addr.country,
//     });

//     if (addr._id) setEditingId(addr._id);
//   };

//   // ✅ DELETE with confirmation
//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm(
//       "Are you sure you want to delete this address?"
//     );
//     if (!confirmDelete) return;

//     await deleteAddress(id);
//     toast.success("Address deleted");
//   };

//   // ✅ LOGOUT improved UX
//   const handleLogout = async () => {
//     await logout();
//     toast.success("Logged out successfully");
//     router.replace("/login");
//   };

//   if (authLoading || !user) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center text-gray-500">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           My Profile
//         </h1>

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* USER INFO */}
//       <div className="space-y-4 border-b pb-6">
//         <div>
//           <p className="text-sm text-gray-500">Name</p>
//           <p className="text-lg font-medium text-gray-800">
//             {user.name}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Email</p>
//           <p className="text-lg font-medium text-gray-800">
//             {user.email}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">Role</p>
//           <p className="text-lg font-medium text-gray-800 capitalize">
//             {user.role}
//           </p>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

//         <div className="space-y-4">
//           {loading && addresses.length === 0 ? (
//             <div className="text-center py-6 text-gray-500">
//               Loading addresses...
//             </div>
//           ) : addresses.length === 0 ? (
//             <div className="text-center py-6 border-2 border-dashed rounded-lg text-gray-500">
//               No addresses found.
//               <div className="mt-3">
//                 <button
//                   onClick={() => setForm(emptyForm)}
//                   className="text-blue-500 underline"
//                 >
//                   Add New Address
//                 </button>
//               </div>
//             </div>
//           ) : (
//             addresses.map((addr) => (
//               <div
//                 key={addr._id}
//                 className="border p-4 rounded-lg flex justify-between items-start"
//               >
//                 <div>
//                   <p className="font-medium">
//                     {addr.fullName}
//                     {addr.isDefault && (
//                       <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
//                         Default
//                       </span>
//                     )}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     {addr.street}, {addr.city}, {addr.state}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     {addr.postalCode}, {addr.country}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     📞 {addr.phone}
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 text-sm text-right">
//                   {!addr.isDefault && (
//                     <button
//                       onClick={() => addr._id && setDefault(addr._id)}
//                       disabled={loading}
//                       className={`text-blue-500 hover:underline ${
//                         loading ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       Make Default
//                     </button>
//                   )}

//                   <button
//                     onClick={() => handleEdit(addr)}
//                     disabled={loading}
//                     className={`text-yellow-600 hover:underline ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => addr._id && handleDelete(addr._id)}
//                     disabled={loading}
//                     className={`text-red-500 hover:underline ${
//                       loading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* FORM */}
//         <div className="mt-8 space-y-4 border-t pt-6">
//           <h3 className="font-semibold text-lg">
//             {editingId ? "Edit Address" : "Add Address"}
//           </h3>

//           <div className="grid gap-3">
//             {Object.keys(emptyForm).map((key) => (
//               <input
//                 key={key}
//                 type={key === "phone" ? "tel" : "text"}
//                 placeholder={fieldLabels[key]}
//                 value={(form as Record<string, string>)[key]}
//                 onChange={(e) =>
//                   setForm({ ...form, [key]: e.target.value })
//                 }
//                 className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
//               />
//             ))}
//           </div>

//           <div className="flex justify-end">
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`bg-black text-white px-5 py-2 rounded transition ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
//               }`}
//             >
//               {loading
//                 ? "Processing..."
//                 : editingId
//                 ? "Update Address"
//                 : "Add Address"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function AccountDetails() {
  const { user, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
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

      {/* USER INFO */}
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
    </div>
  );
}