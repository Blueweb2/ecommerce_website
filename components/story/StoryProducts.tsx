import { Product } from "@/types/product";
import EditorialProductCard from "./EditorialProductCard";

export default function StoryProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-8 mb-16">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-visible">
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0">
            <EditorialProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
