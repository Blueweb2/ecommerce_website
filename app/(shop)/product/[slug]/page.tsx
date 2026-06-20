"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/user/product/useProductStore";

import Loading from "@/app/loading";

const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"), {
  loading: () => <Loading />
});
const RelatedProducts = dynamic(() => import("@/components/details/RelatedProducts"), {
  loading: () => <Loading />
});

export default function Page() {

  const { product, loading, error, zooming, fetchProductBySlug } = useProductStore();
  const [isReady, setIsReady] = useState(false);

  const params = useParams();
  const slug = params?.slug as string;

  // Fetch product using Zustand
  useEffect(() => {
    if (!slug) return;
    setIsReady(true);
    fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  // Update recently viewed products
  useEffect(() => {
    if (product) {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        let recent = stored ? JSON.parse(stored) : [];
        recent = recent.filter((p: any) => p._id !== product._id);
        recent.unshift({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          gstPercentage: product.gstPercentage,
          variants: product.variants,
          isFabric: product.isFabric,
          unit: product.unit,
          minOrderQty: product.minOrderQty,
          stepQty: product.stepQty
        });
        if (recent.length > 10) {
          recent.pop();
        }
        localStorage.setItem("recentlyViewed", JSON.stringify(recent));
      } catch (e) {
        console.error("Could not save recently viewed", e);
      }
    }
  }, [product]);

  // Loading state
  if (!isReady || loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="p-10 text-center">
        Product not found
      </div>
    );
  };

  return (
    <>
      {/* Product Section */}
      <ProductFeature
        product={product}
      />

      {/* Related Products */}
      {!zooming && (
        <RelatedProducts product={product} />
      )}
    </>
  );
}