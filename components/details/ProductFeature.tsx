"use client";

import { useState, useEffect } from "react";
import { resolveImageSrc } from "@/lib/utils/image";
import { useProductStore } from "@/store/user/product/useProductStore";
import Loading from "@/app/loading";

import Carousel from "./inside-product-feature/Carousel";
import RightSide from "./inside-product-feature/RightSide";

type ProductFeatureProps = {
  product: any;
};

const ProductFeature = ({ product }: ProductFeatureProps) => {

  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [carouselImageIndex, setCarouselImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const { zooming, setZooming } = useProductStore();

  const sortImages = (images: any[] = []) => {
    const imgs = images || [];
    if (!imgs.length) return imgs;
    const primaryIdx = imgs.findIndex((img: any) => img.isPrimary);
    if (primaryIdx <= 0) return imgs; // already first or not found
    const sorted = [...imgs];
    const [primary] = sorted.splice(primaryIdx, 1);
    sorted.unshift(primary);
    return sorted;
  };

  const activeImages =
    selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || [];
  const sortedImages = sortImages(activeImages);

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

  // fallback image (important) — use sorted images
  const mainImage = resolveImageSrc(sortedImages[0]?.url);

  // display only product images
  if (zooming) {
    return (
      <Carousel
        images={sortedImages}   
        firstImage={carouselImageIndex}
      />
    );
  };

  // first render time the show the loading ( check device small or not)
  if (isMobile === null) {
    return <Loading />
  };

  // only in mobile and medium device
  if (isMobile) {
    return (
      <>
        <Carousel images={sortedImages}  />
        <RightSide
          product={product}
          onVariantChange={(variant) => {
            setSelectedVariant(variant);
            setCarouselImageIndex(0);
          }}
        />
      </>
    );
  };

  // only in large large divice 
  return (
    <section className="pb-10">
      <div className="lg:grid grid-cols-3">

        {/* ================= LEFT IMAGE ================= */}
        <div
          className="sticky top-0 h-screen group cursor-none hidden lg:block"
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
          {sortedImages.length > 0 ? (
            sortedImages.slice(1).map((img: any, index: number) => (
              <img
                key={index}
                src={resolveImageSrc(img.url)}
                alt={img.altText || product.name}
                className="h-screen w-full object-cover"
                onClick={() => {
                  setCarouselImageIndex(() => index + 1 )
                  setZooming(true)
                }}
              />
            ))
          ) : (
            <img
              src={resolveImageSrc()}
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
        <RightSide
          product={product}
          onVariantChange={(variant) => {
            setSelectedVariant(variant);
            setCarouselImageIndex(0);
          }}
        />
      </div>
    </section>
  );
};

export default ProductFeature;
