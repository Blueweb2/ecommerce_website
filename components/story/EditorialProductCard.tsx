import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { inter } from "@/lib/fonts";

export default function EditorialProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url || "/placeholder.jpg";

  return (
    <Link
      href={`/designer/product/${product.slug}`}
      className="group flex flex-col min-w-[200px] max-w-[250px] w-full"
    >
      <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-[#f4f2ee]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-col text-center ${inter.className}`}>
        {product.designer?.name && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111] mb-1">
            {product.designer.name}
          </span>
        )}
        <h3 className="text-[12px] text-[#444] leading-snug mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[12px] font-semibold text-[#111]">
          {formatCurrency(product.discountPrice || product.price)}
        </p>
      </div>
    </Link>
  );
}
