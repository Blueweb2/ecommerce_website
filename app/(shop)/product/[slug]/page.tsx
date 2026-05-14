"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/user/product/useProductStore";

import Loading from "@/app/loading";

const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"));
const RelatedProducts = dynamic(() => import("@/components/details/RelatedProducts"));

export default function Page() {

  const [isLayoutVisible, setIsLayoutVisible] = useState(false);
  const { product, loading, error, fetchProductBySlug } = useProductStore();

  const params = useParams();
  const slug = params?.slug as string;

  const handleLayoutVisibility = (visible: boolean) => {
    setIsLayoutVisible(visible);
  };

  // Fetch product using Zustand
  useEffect(() => {
    if (!slug) return;
    fetchProductBySlug(slug);
  }, [slug, fetchProductBySlug]);

  // Loading state
  if (loading) {
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
        onToggleLayout={handleLayoutVisibility}
      />

      {/* Related Products */}
      {isLayoutVisible && (
        <RelatedProducts product={product} />
      )}
    </>
  );
}