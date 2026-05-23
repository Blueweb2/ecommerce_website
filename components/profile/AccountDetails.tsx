"use client";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { inter } from "@/lib/fonts";
import { useState } from "react";

export default function AccountDetails() {
  const { user, loading: authLoading } = useAuthStore();

  const [editingName, setEditingName] = useState(false);
const [editingEmail, setEditingEmail] = useState(false);
const [editingPassword, setEditingPassword] = useState(false);

const [name, setName] = useState(user?.name || "");
const [email, setEmail] = useState(user?.email || "");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");

const [saving, setSaving] = useState(false);

// const handleUpdateProfile = async () => {
//   try {
//     setSaving(true);

//     const res = await api.patch("/users/profile", {
//       name,
//       email,
//     });

//     updateUser(res.data.user);

//     toast.success("Profile updated");

//     setEditingName(false);
//     setEditingEmail(false);
//   } catch (error) {
//     toast.error("Failed to update profile");
//   } finally {
//     setSaving(false);
//   }
// };

  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading account...
      </div>
    );
  };

  return (
    <div className={`${inter.className} min-h-screen px-3 py-4 lg:px-6`}>
      
      {/* CARD 1 */}
      <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
        <h2 className="not-[]: text-[20px] font-normal text-black  mb-3">
          Personal information
        </h2>

        <div className="text-[13px] text-black">
{editingName ? (
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="
      h-[48px]
      w-full
      border
      border-black/20
      px-4
      text-[14px]
      outline-none
      focus:border-black
    "
  />
) : (
  <p>{user.name}</p>
)}        </div>

        <div className="border-t border-black/20 mt-4 pt-2">
       {editingName ? (
  <div className="flex gap-4">
    <button
      
      disabled={saving}
      className="text-[13px] text-black"
    >
      Save
    </button>

    <button
      onClick={() => setEditingName(false)}
      className="text-[13px] text-gray-500"
    >
      Cancel
    </button>
  </div>
) : (
  <button
    onClick={() => setEditingName(true)}
    className="text-[13px] text-black"
  >
    Edit
  </button>
)}
        </div>
      </div>

      {/* CARD 2 */}
      <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
        <h2 className="text-[20px] font-normal text-black mb-3">
          Email address
        </h2>

        <p className="text-[13px] text-black">
          {user.email}
        </p>

        <div className="border-t border-black/20 mt-4 pt-2">
          <button className="text-[13px] text-black">
            Edit
          </button>
        </div>
      </div>

      {/* CARD 3 */}
      <div className="border border-black/20 bg-transparent px-6 py-5">
        <h2 className="text-[20px] font-normal text-black mb-3">
          Password
        </h2>

        <p className="text-[20px] tracking-[3px] font-semibold">
          ••••••••••••
        </p>

        <div className="border-t border-black/20 mt-4 pt-2">
          <button className="text-[13px] text-black">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};