import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { optimizeCloudinaryUrl } from '@/lib/constants/admin-catalog';
import { inter } from '@/lib/fonts';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product, index, isAnimating, direction }: any) {

  const imageUrl = optimizeCloudinaryUrl(product.images?.[0]?.url) || '/placeholder.png';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex flex-col gap-3 relative"
      style={{
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transitionDelay: `${index * 100}ms`,
        transform: isAnimating
          ? direction === 1
            ? "translateX(-50px)"
            : "translateX(50px)"
          : "translateX(0)",
        opacity: isAnimating ? 0 : 1,
      }}
    >
      <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 45vw, 22vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.sections?.includes("new-arrival") && (
            <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-black/5">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h3 className={`${inter.className} line-clamp-1 text-[13px] font-semibold text-neutral-600 transition-colors group-hover:text-neutral-800 uppercase`}>
          {product.name}
        </h3>
      </div>

      <div className='absolute inset-0 hover:bg-white/20'></div>
    </Link>
  );
};