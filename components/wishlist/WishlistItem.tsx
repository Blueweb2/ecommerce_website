"use client";

import { X } from "lucide-react";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { toast } from "react-hot-toast";

type WishlistItemType = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type Props = {
  item: WishlistItemType;
};

export default function WishlistItem({ item }: Props) {
  const { toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  // ✅ Remove (sync with backend if logged in)
  const handleRemove = async () => {
    toggleWishlist(item);

    if (user) {
      try {
        await wishlistAPI.toggle(item._id);
      } catch (err) {
        console.log("Remove sync failed");
      }
    }

    toast.success("Removed from wishlist");
  };

  // ✅ Add to cart + remove from wishlist
  const handleAddToCart = async () => {
    addToCart({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });

    // remove from wishlist after adding
    toggleWishlist(item);

    if (user) {
      try {
        await wishlistAPI.toggle(item._id);
      } catch (err) {
        console.log("Wishlist sync failed");
      }
    }

    toast.success(`${item.name} added to cart 🛒`);
  };

  return (
    <div className="w-full max-w-sm">
      
      {/* IMAGE */}
      <div className="relative bg-gray-100 group">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-[300px] object-cover"
        />

        {/* REMOVE BUTTON */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-black hover:text-white transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* ADD TO BAG */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-2 mt-4 hover:bg-gray-800 transition"
      >
        Add to Bag
      </button>

      {/* DETAILS */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xs tracking-wide font-semibold uppercase">
          PRODUCT
        </h3>

        <p className="text-sm text-gray-700 line-clamp-2">
          {item.name}
        </p>

        <p className="text-sm mt-2 font-medium">₹{item.price}</p>

        <p className="text-xs text-gray-500 uppercase tracking-wide">
          In Stock
        </p>
      </div>
    </div>
  );
}