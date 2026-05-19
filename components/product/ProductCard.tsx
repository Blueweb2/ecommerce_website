import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";
import { inter } from "@/lib/fonts";

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
  const primaryImg =
    product.images?.find((image) => "isPrimary" in image && image.isPrimary) ||
    product.images?.[0];

  const imageUrl = optimizeCloudinaryUrl(primaryImg?.url) || "/placeholder.png";
  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

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

      <div className="relative w-full overflow-hidden bg-neutral-100  aspect-[4/5] 2xl:aspect-[4/6]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover h-40 md:h-90 transition-transform duration-500"
          sizes="(max-width: 768px) 45vw, 22vw"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock === 0 && (
            <span className="rounded-full border border-black/5 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-red-500 shadow-sm uppercase tracking-wider">
              SOLD OUT
            </span>
          )}
          {product.sections?.includes("new-arrival") && (
            <span className="rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 px-1">
        {showFullDetails && product.brand && (
          <p className={`${inter.className} text-[11px] uppercase tracking-[0.18em] text-[#8D8B9D]`}>
            {product.brand}
          </p>
        )}

        <h3
          className={`${inter.className} line-clamp-1 text-[13px] font-semibold uppercase text-[#5C5A58] transition-colors group-hover:text-neutral-800 text-center`}
        >
          {useBrandAsTitle ? (product.brand || product.name) : product.name}
        </h3>

        {showFullDetails && (
          <>
            <p className={`${inter.className} line-clamp-2 text-xs leading-5 text-[#7A7672]`}>
              {product.description || "No description available."}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className={`${inter.className} text-sm font-semibold text-[#5C5A58]`}>
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className={`${inter.className} text-xs text-neutral-400 line-through`}>
                  ₹{product.price}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-0 hover:bg-white/20"></div>
    </Link>
  );
}
