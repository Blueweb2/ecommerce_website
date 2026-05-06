"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";

const Carousel = dynamic(() => import("./inside-product-feature/Carousel"),{
  loading: () => <p className="text-center py-10">Loading...</p>,
});
const RightSide = dynamic<{ product: any }>(() => import("./inside-product-feature/RightSide"),{
  loading: () => <p className="text-center py-10">Loading...</p>,
});

type ProductFeatureProps = {
  onToggleLayout: (visible: boolean) => void;
  product: any;
};

const ProductFeature = ({ onToggleLayout, product }: ProductFeatureProps) => {

  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zooming, setZooming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselImageIndex, setCarouselImageIndex] = useState<number>(0)

  // detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // notify parent about zoom state
  useEffect(() => {
    onToggleLayout(!zooming);
  }, [zooming, onToggleLayout]);
  

  // fallback image (important)
  const mainImage =
    optimizeCloudinaryUrl(product?.images?.[0]?.url) || "/placeholder.png";


  // display only product images
  if (zooming) {
    return (
      <Carousel
        images={product?.images || []}
        setZooming={setZooming}
        firstImage={carouselImageIndex}
      />
    );
  };

  // only in mobile divice
  if (isMobile) {
    return (
      <>
        <Carousel images={product?.images || []} setZooming={setZooming} />
        <RightSide product={product} />
      </>
    );
  };

  // only in large large divice 
  return (
    <section className="py-10">
      <div className="lg:grid grid-cols-3">

        {/* ================= LEFT IMAGE ================= */}
        <div
          className="sticky top-14 h-screen group cursor-none hidden lg:block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setLeftPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onClick={() => {
            setCarouselImageIndex(() => 0)
            setZooming(true)
          }}
        >
          <img
            src={mainImage}
            alt={product?.name}
            className="w-full h-full object-cover"
          />

          {/* Cursor */}
          <div
            className="pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            style={{
              left: leftPos.x - 20,
              top: leftPos.y - 20,
            }}
          >
            <span className="scale-150">+</span>
          </div>
        </div>

        {/* ================= MIDDLE IMAGES ================= */}
        <div
          className="group cursor-none relative hidden lg:block"
        >
          {product?.images?.length > 0 ? (
            product.images.slice(1).map((img: any, index: number) => (
              <img
                key={index}
                src={optimizeCloudinaryUrl(img.url)}
                alt={img.altText || product.name}
                className="h-screen w-full object-cover mb-2"
                onClick={() => {
                  setCarouselImageIndex(() => index + 1 )
                  setZooming(true)
                }}
              />
            ))
          ) : (
            <img
              src="/placeholder.png"
              alt="no image"
              className="h-screen w-full object-cover"
            />
          )}

          {/* Cursor */}
          <div
            className="pointer-events-none fixed w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            style={{
              left: mousePos.x - 20,
              top: mousePos.y - 20,
            }}
          >
            <span className="scale-150">+</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <RightSide product={product} />
      </div>
    </section>
  );
};

export default ProductFeature;