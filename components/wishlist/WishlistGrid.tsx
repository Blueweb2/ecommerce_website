// components/wishlist/WishlistGrid.tsx

"use client";

import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import WishlistItem from "./WishlistItem";
import EmptyWishlist from "./EmptyWishlist";

export default function WishlistGrid() {
  const items = useWishlistStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
      <EmptyWishlist/>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistItem key={item._id} item={item} />
      ))}
    </div>
  );
}