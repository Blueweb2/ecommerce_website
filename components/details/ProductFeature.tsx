"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Carousel = dynamic(() => import("./inside-product-feature/Carousel"));
const RightSide = dynamic<{ product: any }>(() => import("./inside-product-feature/RightSide"));

type ProductFeatureProps = {
  onToggleLayout: (visible: boolean) => void;
  product: any; // ✅ add product prop
};

const ProductFeature = ({ onToggleLayout, product }: ProductFeatureProps) => {
  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zooming, setZooming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ custom cursor tracking
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

  // ✅ notify parent about zoom state
  useEffect(() => {
    onToggleLayout(!zooming);
  }, [zooming, onToggleLayout]);
  console.log(product,"products");
  

  // ✅ fallback image (important)
  const mainImage =
    product?.images?.[0]?.url || "/placeholder.png";

  return !isMobile && !zooming ? (
    <section className="py-10 mt-4 lg:mt-10">
      <div className="lg:grid grid-cols-3 gap-4">

        {/* ================= LEFT IMAGE ================= */}
        <div
          className="sticky top-20 h-[600px] group cursor-none hidden lg:block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setLeftPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onClick={() => setZooming(true)}
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
          className="group cursor-none relative hidden lg:block overflow-y-auto h-[600px]"
          onClick={() => setZooming(true)}
        >
          {product?.images?.length > 0 ? (
            product.images.map((img: any, index: number) => (
              <img
                key={index}
                src={img.url}
                alt={img.altText || product.name}
                className="h-[600px] w-full object-cover mb-2"
              />
            ))
          ) : (
            <img
              src="/placeholder.png"
              alt="no image"
              className="h-[600px] w-full object-cover"
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
  ) : (
    <>
      {/* ✅ pass images to carousel */}
      <Carousel
        images={product?.images || []}
        setZooming={setZooming}
      />

      {isMobile && <RightSide product={product} />}
    </>
  );
};

export default ProductFeature;