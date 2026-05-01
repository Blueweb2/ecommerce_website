import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const inter = Inter({
  subsets: ['latin'],
});

export default function ProductCard({ product }: ProductCardProps) {

  const imageUrl = product.images?.[0]?.url || '/home/categorysection/category-one.png';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 45vw, 22vw"
        />
      </div>

      <div className="text-center">
        <h3 className={`${inter.className}font-medium text-[#8D8B9D] group-hover:text-neutral-600 transition-colors`}>
          SHOP EARRINGS
        </h3>
      </div>
    </Link>
  );
};