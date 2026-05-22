"use client";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { inter } from "@/lib/fonts";

export default function AccountDetails() {
  const { user, loading: authLoading } = useAuthStore();

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
          <p>{user.name}</p>
        </div>

        <div className="border-t border-black/20 mt-4 pt-2">
          <button className="text-[13px] text-black">
            Edit
          </button>
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