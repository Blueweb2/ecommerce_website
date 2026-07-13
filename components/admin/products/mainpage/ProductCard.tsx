import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getPrimaryProductImage,
  getProductImageUrl,
  getSectionLabel,
  type CatalogEntity,
  type CatalogProduct,
} from "@/lib/constants/admin-catalog";

interface ProductCardProps {
  product: CatalogProduct;
  categories: CatalogEntity[];
  onDelete: (id: string) => void;
}

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-IN")}`;

export default function ProductCard({
  product,
  categories,
  onDelete,
}: ProductCardProps) {
  const primaryImage = getPrimaryProductImage(product.images);
  const imageUrl =
    getProductImageUrl(primaryImage) || "/placeholder.png";
  const stock = product.stock ?? 0;
  const categoryName =
    product.category && typeof product.category !== "string"
      ? product.category.name
      : categories.find((category) => category._id === product.category)
          ?.name || "Unassigned";
  const salePrice =
    product.isOnSale && product.discountPrice
      ? product.discountPrice
      : product.price;
  const discountPercent =
    product.isOnSale &&
    product.discountPrice &&
    product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100
        )
      : 0;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f6f1ea]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="flex flex-wrap gap-2">
            {product.isOnSale && (
              <span className="rounded-full bg-[#b84f4f] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                Sale
              </span>
            )}

            {product.sections?.[0] && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7356]">
                {getSectionLabel(product.sections[0])}
              </span>
            )}
          </div>

          {!product.isPublished && (
            <span className="rounded-full bg-[#f1dfb5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6f5524]">
              Draft
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
            {product.brand || "Catalog Product"}
          </p>
          <h3 className="font-brand-display text-[28px] leading-8 text-[#171717]">
            {product.name}
          </h3>
          <p className="text-sm leading-6 text-[#5c5a58]">
            {categoryName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-brand-display text-2xl text-[#171717]">
            {formatPrice(salePrice)}
          </span>

          {discountPercent > 0 && (
            <>
              <span className="text-sm text-[#8f8a83] line-through">
                {formatPrice(product.price)}
              </span>
              <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7356]">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[#5c5a58]">
          <span className="rounded-full bg-[#faf7f2] px-3 py-1">
            {stock === 0
              ? "Out of stock"
              : stock <= 5
                ? `Low stock: ${stock}`
                : `In stock: ${stock}`}
          </span>
          <span className="rounded-full bg-[#faf7f2] px-3 py-1">
            GST {product.gstPercentage || 0}%
          </span>
          {product.sku && (
            <span className="rounded-full bg-[#faf7f2] px-3 py-1">
              SKU {product.sku}
            </span>
          )}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {product.images.slice(0, 4).map((image, index) => (
              <Image
                key={image._id || index}
                src={getProductImageUrl(image) || "/placeholder.png"}
                alt={`${product.name} preview ${index + 1}`}
                width={44}
                height={44}
                className={`h-11 w-11 shrink-0 rounded-2xl object-cover ${
                  image.isPrimary
                    ? "ring-2 ring-black/60 ring-offset-2 ring-offset-white"
                    : ""
                }`}
              />
            ))}
            {product.images.length > 4 && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#faf7f2] text-xs font-semibold text-[#5c5a58]">
                +{product.images.length - 4}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
          >
            <Pencil className="h-4 w-4" />
            Edit Product
          </Link>

          <Link
            href={`/admin/products/${product._id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-[#171717] transition hover:border-black hover:bg-[#faf7f2]"
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => onDelete(product._id)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b84f4f]/20 px-4 py-3 text-sm font-semibold text-[#b84f4f] transition hover:bg-[#fff5f5]"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
