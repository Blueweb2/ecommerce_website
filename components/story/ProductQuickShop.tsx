"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { inter } from "@/lib/fonts";

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
  return (
    <div className={`mt-4 flex flex-col ${inter.className}`}>

      {/* Price */}
      <p className="text-center text-[15px] font-medium mb-5">
        {formatCurrency(product.discountPrice || product.price)}
      </p>

      {/* Size */}
  <div className="border border-[#d8d8d8] h-11 flex items-center justify-center text-[13px] text-[#666] mb-4">
  {product.stock > 0 ? "In Stock" : "Out of Stock"}
</div>

      {/* Add to Bag */}
      <button className="h-11 bg-black text-white text-[13px] font-semibold hover:bg-[#222] transition-colors">
        Add To Shopping Bag
      </button>

      {/* Wishlist */}
      <button className="h-11 border border-[#222] text-[13px] mt-3 hover:bg-[#f7f7f7] transition-colors">
        Add To Wish List
      </button>

      {/* Details */}
      <Link
        href={`/designer/product/${product.slug}`}
        className="mt-4 text-center text-[13px] underline underline-offset-4"
      >
        View Product Details
      </Link>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-8 text-3xl font-extralight"
        aria-label="Close quick shop"
      >
        ×
      </button>
    </div>
  );
}