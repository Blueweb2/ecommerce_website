"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";

import { Product } from "@/types/product";
import { resolveImageSrc } from "@/lib/utils/image";
import { inter } from "@/lib/fonts";

import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";

type ProductCardProps = {
  product: Product;
  index?: number;
  isAnimating?: boolean;
  isEntering?: boolean;
  direction?: number;
  useBrandAsTitle?: boolean;
  showFullDetails?: boolean;
};

export default function ProductCard({
  product,
  index = 0,
  isAnimating = false,
  isEntering = false,
  direction = 0,
  useBrandAsTitle = false,
  showFullDetails = false,
}: ProductCardProps) {

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const primaryImg =
    product.images?.find(
      (image) => "isPrimary" in image && image.isPrimary
    ) || product.images?.[0];

  const secondImg = product.images?.[1];

  const imageUrl = resolveImageSrc(primaryImg?.url);
  const hoverImageUrl = resolveImageSrc(secondImg?.url);

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {

    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl,
    });

    if (user) {
      try {
        await wishlistAPI.toggle(product._id);
      } catch {
        console.log("Wishlist sync failed");
      }
    }

    toast.success(
      isWishlisted
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col gap-3"
      style={{
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transitionDelay: `${index * 100}ms`,
        transform: isAnimating
          ? direction === 1
            ? "translateX(-50px)"
            : "translateX(50px)"
          : isEntering
          ? direction === 1
            ? "translateX(50px)"
            : "translateX(-50px)"
          : "translateX(0)",
        opacity: isAnimating ? 0 : isEntering ? 0 : 1,
      }}
    >

      {/* IMAGE */}
      <div className="relative aspect-[4/5] 2xl:aspect-[4/6] w-full overflow-hidden bg-neutral-100">

        {/* PRIMARY IMAGE */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="
            object-cover
            transition-all duration-700
            group-hover:opacity-0
            group-hover:scale-[1.03]
          "
        />

        {/* SECOND IMAGE */}
        {secondImg && (
          <Image
            src={hoverImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, 22vw"
            className="
              object-cover
              opacity-0
              transition-all duration-700
              group-hover:opacity-100
              group-hover:scale-[1.03]
            "
          />
        )}

        {/* BADGES */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">

          {product.stock === 0 && (
            <span className="rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500 shadow-sm backdrop-blur-sm">
              SOLD OUT
            </span>
          )}

          {product.sections?.includes("new-arrival") && (
            <span className="rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* HEART */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={`Save ${product.name}`}
          className="
            absolute right-4 top-4 z-40
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white/90 text-black
            shadow-sm backdrop-blur-sm
            transition duration-300
            hover:scale-105
          "
        >
          <Heart
            className="h-4 w-4 transition"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* OVERLAY */}
        <div className="absolute inset-0 z-10 bg-transparent transition duration-500 group-hover:bg-white/10" />
      </div>

      {/* CONTENT */}
      <div className="space-y-1 px-1 pt-1">

        {showFullDetails && product.brand && (
          <p
            className={`${inter.className} text-[13px] font-semibold uppercase tracking-[0.03em] text-neutral-600`}
          >
            {product.brand}
          </p>
        )}

        <h3
          className={`${inter.className} line-clamp-1 pt-0.5 text-[13px] leading-6 text-[#5C5A58] transition-colors group-hover:text-neutral-800 text-center`}
        >
          {useBrandAsTitle
            ? (product.brand || product.name)
            : product.name}
        </h3>

        {showFullDetails && (
          <div className="flex items-center gap-2 pt-1">

            <span className={`${inter.className} text-[15px]`}>
              ₹{displayPrice}
            </span>

            {hasDiscount && (
              <span
                className={`${inter.className} text-xs text-neutral-400 line-through`}
              >
                ₹{product.price}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}