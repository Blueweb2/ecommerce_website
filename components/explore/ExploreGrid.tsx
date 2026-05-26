"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";

import { Product } from "@/types/product";
import { bodoni, inter } from "@/lib/fonts";
import { resolveImageSrc } from "@/lib/utils/image";

import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";
import { wishlistAPI } from "@/lib/api/wishlist.api";
import { useAuthStore } from "@/store/auth/useAuthStore";

type ExploreGridProps = {
  products: Product[];
  fallbackImage: string;
  categoryTitle: string;
};

export default function ExploreGrid({
  products,
  fallbackImage,
  categoryTitle,
}: ExploreGridProps) {

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-black/15 bg-gray-50 px-6 py-16 text-center">
        <h2
          className={`${bodoni.className} text-xl font-semibold text-neutral-600`}
        >
          No products found
        </h2>

        <p className="mt-2 text-sm text-black/55">
          Try changing or clearing the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">

      {products.map((product) => {

        const primaryImg =
          product.images?.find((img: any) => img.isPrimary) ||
          product.images?.[0];

        const secondImg = product.images?.[1];

        const productImage = resolveImageSrc(
          primaryImg?.url,
          fallbackImage
        );

        const hoverImage = resolveImageSrc(
          secondImg?.url,
          fallbackImage
        );

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
            image: productImage,
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

        return (
          <article key={product._id}>

            <Link
              href={`/product/${product.slug}`}
              className="group block"
            >

              <div className="relative aspect-[4/5] 2xl:aspect-[4/6] overflow-hidden bg-[#f8f8f8]">

                {/* PRIMARY IMAGE */}
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 48vw, (max-width: 1536px) 30vw, 22vw"
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
                    src={hoverImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 48vw, (max-width: 1536px) 30vw, 22vw"
                    className="
                      object-cover
                      opacity-0
                      transition-all duration-700
                      group-hover:opacity-100
                      group-hover:scale-[1.03]
                    "
                  />
                )}

                {/* HEART BUTTON */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label={`Save ${product.name}`}
                  className="
                    absolute right-4 top-4 z-20
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
              </div>
            </Link>

            {/* CONTENT */}
            <div className="pt-4">

              <p
                className={`${inter.className} text-[13px] font-semibold uppercase tracking-[0.03em] text-neutral-600`}
              >
                {product.brand || categoryTitle}
              </p>

              <Link
                href={`/product/${product.slug}`}
                className={`${inter.className} mt-2 line-clamp-2 block text-[13px] leading-6 text-[#5C5A58]`}
              >
                {product.name}
              </Link>

              <div className="mt-3 flex items-center gap-2 text-[15px]">

                {product.discountPrice &&
                product.discountPrice < product.price ? (
                  <>
                    <span className={`${inter.className}`}>
                      ₹{product.discountPrice}
                    </span>

                    <span
                      className={`${inter.className} text-[#d82d2d] line-through`}
                    >
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className={`${inter.className}`}>
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}