import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { optimizeCloudinaryUrl } from '@/lib/constants/admin-catalog';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = optimizeCloudinaryUrl(product.images?.[0]?.url) || '/placeholder.png';
  const hasSale = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative rounded-2xl">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 45vw, 22vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasSale && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
            </span>
          )}
          {product.sections?.includes("new-arrival") && (
            <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-black/5">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h3 className="font-brand-sans line-clamp-1 text-[15px] font-semibold text-neutral-800 transition-colors group-hover:text-emerald-600">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          {hasSale ? (
            <>
              <p className="text-[14px] font-bold text-neutral-900">₹{product.discountPrice}</p>
              <p className="text-[12px] text-neutral-400 line-through">₹{product.price}</p>
            </>
          ) : (
            <p className="text-[14px] font-bold text-neutral-900">₹{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
