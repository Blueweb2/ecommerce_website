"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
const Carousel = dynamic(() => import("./inside-product-feature/Carousel"));
const RightSide = dynamic(() => import("./inside-product-feature/RightSide"));

type ProductFeatureProps = {
  onToggleLayout: (visible: boolean) => void;
};

const ProductFeature = ({ onToggleLayout }: ProductFeatureProps) => {

  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zooming, setZooming] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // take window screen width
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // custom cursor handling
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

  // pass zooming value to parent component
  useEffect(() => {
    onToggleLayout(zooming);
  },[zooming]);


  return !isMobile && !zooming ? (
    <section className="py-10 mt-4 lg:mt-10">
      <div className="lg:grid  grid-cols-3 max-w-7xl mx-auto">

        {/* LEFT (IMAGE DISPLAY) (LARGE DIVICE ONLY) */}
        <div
          className="sticky top-20 h-[600px] group cursor-none hidden lg:block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setLeftPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
          onClick={()=>setZooming(true)}
        >
          <img
            src="/home/herosection/hero-right-top.png"
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Custom Cursor */}
          <div
            className="pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center leading-none text-white 
            "
            style={{
              left: leftPos.x - 20,
              top: leftPos.y - 20,
            }}
          ><span className="scale-190">+</span></div>
        </div>

        {/* MIDDLE SECTION ( ANOTHER IMAGES ) (LARGE DIVICE ONLY) */}
        <div className="group cursor-none relative hidden lg:block" onClick={()=>setZooming(true)}>
          <img src="/home/categorysection/category-one.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-center.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/shopsection/shop-one.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-right-bottom.png" alt="" className="h-[600px] w-full object-cover" />
          <img src="/home/herosection/hero-right-top.png" alt="" className="h-[600px] w-full object-cover" />
          {/* Custom Cursor */} 
          <div
            className="pointer-events-none fixed w-10 h-10 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center leading-none text-white"
            style={{
              left: mousePos.x - 20,
              top: mousePos.y - 20,
            }}
          >
            <span className="scale-190">+</span>
          </div>
        </div>

        {/* RIGHT (ADD TO CART AREA) */}
        <RightSide />

      </div>

    </section>
  ):(
    <>
      <Carousel setZooming={setZooming} />
      {isMobile && <RightSide /> }
    </>
  );
};

export default ProductFeature;