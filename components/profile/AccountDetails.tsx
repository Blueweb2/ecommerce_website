"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { bodoni, inter } from "@/lib/fonts";

export default function AccountDetails() {
  const { user, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/account/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading account...
      </div>
    );
  };

  return (
    <div className="min-h-screen px-3 py-4 lg:px-6">
      
      {/* CARD 1 */}
      <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
        <h2 className="text-[20px] font-serif font-normal text-black  mb-3">
          Personal information
        </h2>

        <div className="text-[13px] text-black">
          <p>{user.name}</p>
          <p>Born on 3 Mar 2005</p>
        </div>

        <div className="border-t border-black/20 mt-4 pt-2">
          <button className="text-[13px] text-black">
            Edit
          </button>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
        <h2 className="text-[20px] font-serif font-normal text-black mb-3">
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
        <h2 className="text-[20px] font-serif font-normal text-black mb-3">
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