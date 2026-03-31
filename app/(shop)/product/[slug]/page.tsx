import dynamic from "next/dynamic";

const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"));
const RelatedProducts = dynamic(() => import("@/components/details/RelatedProducts"));

export default function page() {
  return (
    <>
      <ProductFeature />
      <RelatedProducts />
    </>
  );
};