"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Handbag } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api/axios";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";
import { bodoni, inter } from "@/lib/fonts";
import { getPrimaryProductImage } from "@/lib/constants/admin-catalog";
import { useCartStore } from "@/store/user/cart/useCartStore";

type ImageType = {
  url: string;
  altText?: string;
  public_id?: string;
  isPrimary?: boolean;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  gstPercentage?: number;
  images?: ImageType[];
  description: string;
  slug: string;
};

type Props = {
  product?: {
    _id?: string;
  };
};

export default function RelatedProducts({ product }: Props) {

  const [activeTab, setActiveTab] = useState<"like" | "recent">("like");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const productId = product?._id;

        if (activeTab === "like" && !productId) {
          if (isMounted) setProducts([]);
          return;
        }

        setLoading(true);

        const res =
          activeTab === "like"
            ? await api.get(`/products/${productId}/related`)
            : await api.get("/products/new");

        if (isMounted) {
          const nextProducts = Array.isArray(res.data?.data)
            ? res.data.data
            : res.data?.data?.products || [];

          setProducts(nextProducts);
        }
      } catch (error) {
        console.error("Failed to load related products:", error);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [activeTab, product?._id]);

  const handleAddToCart = (product:any) => {
    const primaryImageUrl = getPrimaryProductImage(product.images)?.url || "/placeholder.png";

    let selectedVariant ;

    if(product?.variants?.length > 0){
      selectedVariant = product.variants.find((variant: any) => variant.stock > 0);
    }
    
    addItem({
      productId: product._id,
      name: product.name,
      image: primaryImageUrl,
      price: product.price,
      quantity: 1,
      gstPercentage: product.gstPercentage || 0,
      variantId: selectedVariant?.sku,
      isFabric: product.isFabric,
      unit: product.unit,
      minOrderQty: product.minOrderQty,
      stepQty: product.stepQty,
    });

    toast.success("Added to cart");
  };

  return (
    <section className="max-w-7xl pb-10 pl-5 lg:mx-auto lg:pl-0">
      <div className="mt-10 mb-8 flex justify-center gap-8 text-sm tracking-wide">
        <button
          onClick={() => setActiveTab("like")}
          className={`border-b pb-2 ${
            activeTab === "like"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          YOU MAY ALSO LIKE
        </button>

        <button
          onClick={() => setActiveTab("recent")}
          className={`border-b pb-2 ${
            activeTab === "recent"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          RECENTLY VIEWED
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {products.map((item) => {
          const primaryImage =
            item.images?.find((image) => image.isPrimary) || item.images?.[0];

          return (
            <Link
              href={`/product/${item.slug}`}
              key={item._id}
              className="group w-[150px] flex-shrink-0 cursor-pointer lg:w-[290px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={optimizeCloudinaryUrl(primaryImage?.url) || "/placeholder.png"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAddToCart(item)
                }}
                className="absolute right-4 bottom-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/80 text-black opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Handbag size={18} />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className={`${bodoni.className} text-xs font-normal uppercase tracking-widest text-neutral-600`}>
                  {item.name}
                </h3>
                <p className={`${inter.className} line-clamp-1 text-[10px] font-medium text-gray-400`}>
                  {item.description}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <p className={`${inter.className} text-sm text-[13px] font-black text-[#8D8B9D]`}>

                    ₹
                    {Math.round(
                      item.price * (1 + (item.gstPercentage || 0) / 100)
                    )}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                  
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && products.length === 0 && (
        <p className="mt-10 text-center text-gray-400">No products found</p>
      )}
    </section>
  );
}
