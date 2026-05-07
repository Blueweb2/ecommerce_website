"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";

export default function WishlistGrid() {
  const { items, syncWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  // Sync from backend when logged in
  useEffect(() => {
    if (user) {
      syncWishlist();
    }
  }, [user]);

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 text-sm">
        <span className="font-medium text-neutral-600">Filter</span>
        <span className="text-gray-500">
          {items.length} item{items.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {items.map((item) => (
          <WishlistItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}