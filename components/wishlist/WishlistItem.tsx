// components/wishlist/WishlistItem.tsx

"use client";

import { X } from "lucide-react";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import toast from "react-hot-toast";

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
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const addToCart = useCartStore((state) => state.addItem);
  const handleAddToCart = () => {
  addToCart({
    productId: item._id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: 1,
  });

  toast.success("Added to cart !");
};

  return (
    <div className="w-full max-w-sm">
      
      {/* IMAGE */}
      <div className="relative bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-[300px] object-cover"
        />

        {/* REMOVE BUTTON */}
        <button
          onClick={() => removeFromWishlist(item._id)}
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow"
        >
          <X size={16} />
        </button>
      </div>

      {/* ADD TO BAG */}
      <button
  onClick={handleAddToCart}
  className="w-full bg-black text-white py-2 mt-4 hover:bg-gray-800"
>
  Add to Bag
</button>

      {/* DETAILS */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xs tracking-wide font-semibold uppercase">
          BRAND NAME
        </h3>

        <p className="text-sm text-gray-700">
          {item.name}
        </p>

        <p className="text-sm mt-2">₹{item.price}</p>

        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Low Stock
        </p>
      </div>
    </div>
  );
}