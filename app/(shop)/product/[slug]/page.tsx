import dynamic from "next/dynamic";

const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"))

export default function page() {
  return (
    <>
      <ProductFeature />
    </>
  );
};