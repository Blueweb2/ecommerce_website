"use client";

import Link from "next/link";
import { toast } from "react-hot-toast";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { inter } from "@/lib/fonts";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";

type Props = {
  product: Product;
  imageUrl: string;
  onClose: () => void;
};

export default function ProductQuickShop({
  product,
  imageUrl,
  onClose,
}: Props) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToBag = async () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    await addItem({
      productId: product._id,
      name: product.name,
      image: imageUrl,
      price: product.discountPrice || product.price,
      quantity: product.isFabric ? product.minOrderQty || 1 : 1,
      gstPercentage: product.gstPercentage || 0,
      isFabric: product.isFabric,
      unit: product.unit,
      minOrderQty: product.minOrderQty,
      stepQty: product.stepQty,
    });
    toast.success("Added to shopping bag");
  };

  const handleWishlist = async () => {
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: imageUrl,
    });

    if (user) {
      try {
        await wishlistAPI.toggle(product._id);
      } catch {
        toast.error("Wishlist could not be synced");
        return;
      }
    }

    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className={`mt-5 flex flex-col ${inter.className}`}>
      <p className="mb-5 text-center text-[15px] font-medium">
        {formatCurrency(product.discountPrice || product.price)}
      </p>

      <div className="mb-4 flex h-8 items-center justify-center border border-[#d8d8d8] text-[10px] text-[#666]">
        {isOutOfStock ? "Out of Stock" : "In Stock"}
      </div>

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={isOutOfStock}
        className="h-8 bg-black text-[10px] font-semibold text-white transition-colors hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-[#777]"
      >
        Add To Shopping Bag
      </button>

      <button
        type="button"
        onClick={handleWishlist}
        className="mt-3 h-8 border border-[#222] text-[10px] transition-colors hover:bg-[#f7f7f7]"
      >
        {isWishlisted ? "Remove From Wish List" : "Add To Wish List"}
      </button>

      <Link
        href={`/designer/product/${product.slug}`}
        className="mt-4 text-center text-[10px] underline underline-offset-4"
      >
        View Product Details
      </Link>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-4 text-3xl font-extralight leading-none transition-opacity hover:opacity-60"
        aria-label="Close quick shop"
      >
        &times;
      </button>
    </div>
  );
}
