"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { productAPI } from "@/lib/api/product.api";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"));
const RelatedProducts = dynamic(() => import("@/components/details/RelatedProducts"));
const Footer = dynamic(() => import("@/components/shared/Footer"));

export default function Page() {
  const [isLayoutVisible, setIsLayoutVisible] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useParams();
  const slug = params?.slug as string;

  const handleLayoutVisibility = (visible: boolean) => {
    setIsLayoutVisible(visible);
  };

  // ✅ Fetch product
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getBySlug(slug);
        setProduct(res.data.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ✅ Loading
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  // ✅ Not found
  if (!product) {
    return (
      <div className="p-10 text-center">
        Product not found
      </div>
    );
  }

  return (
    <>
      {/* ✅ Navbar hidden when zooming */}
      {!isLayoutVisible && <Navbar />}

      {/* ✅ Product Section */}
      <ProductFeature
        product={product}
        onToggleLayout={handleLayoutVisibility}
      />

      {/* ✅ Related + Footer */}
      {!isLayoutVisible && (
        <>
          <RelatedProducts product={product} />
          <Footer />
        </>
      )}
    </>
  );
}