"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const ProductFeature = dynamic(() => import("@/components/details/ProductFeature"));
const RelatedProducts = dynamic(() => import("@/components/details/RelatedProducts"));
const Footer = dynamic(() => import("@/components/shared/Footer"));

export default function page() {

  const [isLayoutVisible, setIsLayoutVisible] = useState(true);

  const handleLayoutVisibility = (visible: boolean) => {
    setIsLayoutVisible(visible);
  };
  
  return (
    <>
      {!isLayoutVisible && <Navbar /> }
      <ProductFeature onToggleLayout={handleLayoutVisibility} />
      {!isLayoutVisible && <RelatedProducts /> }
      {!isLayoutVisible && <Footer /> }
    </>
  );
};