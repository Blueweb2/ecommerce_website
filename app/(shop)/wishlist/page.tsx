"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  const username = user?.name
    ? `${user.name.split(" ")[0]}'s`
    : "My";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {username} Wishlist
      </h1>

      <WishlistGrid />
    </div>
  );
}