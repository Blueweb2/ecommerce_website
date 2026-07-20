import { Product } from "@/types/product";
import EditorialProductCard from "./EditorialProductCard";

export default function StoryProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-8 mb-16">
      <div
        className="
    grid
    grid-cols-2
    gap-x-8
    gap-y-16
    justify-items-center
    max-w-[650px]
    mx-auto
  "
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-full max-w-[250px]"
          >
            <EditorialProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
