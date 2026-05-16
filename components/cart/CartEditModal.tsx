"use client";

import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useCartStore } from "@/store/user/cart/useCartStore";

interface Props {
    item: any;
    onClose: () => void;
}

export default function CartEditModal({
    item,
    onClose,
}: Props) {
    const { updateQuantity } = useCartStore();

    const [qty, setQty] = useState(item.quantity);

    const images =
        item.images?.length > 0
            ? item.images
            : [item.image || "/placeholder.png"];

    const [activeImage, setActiveImage] = useState(0);

    const step = item.isFabric ? item.stepQty || 1 : 1;

    const min = item.isFabric
        ? item.minOrderQty || 1
        : 1;

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
return (
  <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4 py-8">
    
    {/* MODAL */}
    <div className="relative w-full max-w-[1120px] overflow-hidden bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)] animate-[fadeIn_.25s_ease]">
      
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute right-7 top-7 z-20 text-black transition hover:opacity-50"
      >
        <X size={26} strokeWidth={1.5} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
        
        {/* LEFT IMAGE */}
        <div className="relative flex items-center justify-center bg-[#f8f7f4]">
          
          {/* LEFT ARROW */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setActiveImage((prev) =>
                  prev === 0
                    ? images.length - 1
                    : prev - 1
                )
              }
              className="absolute left-5 top-1/2 z-10 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
          )}

          {/* RIGHT ARROW */}
          {images.length > 1 && (
            <button
              onClick={() =>
                setActiveImage((prev) =>
                  prev === images.length - 1
                    ? 0
                    : prev + 1
                )
              }
              className="absolute right-5 top-1/2 z-10 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          )}

          {/* IMAGE */}
          <div className="flex h-full w-full items-center justify-center p-8 lg:p-10">
            <img
              src={images[activeImage]}
              alt={item.name}
              className="h-[620px] w-full object-contain"
            />
          </div>

          {/* DOTS */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {images.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-[5px] w-[5px] rounded-full transition ${
                    activeImage === i
                      ? "bg-black"
                      : "bg-[#d1d1d1]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col px-12 pb-12 pt-12">
          
          {/* BRAND */}
          <h2 className="font-serif text-[44px] uppercase leading-[0.95] tracking-[-1px] text-black">
            {item.brand || item.name}
          </h2>

          {/* CATEGORY */}
          <p className="mt-6 text-[12px] uppercase tracking-[5px] text-[#8d8d8d]">
            Runway
          </p>

          {/* PRICE */}
          <p className="mt-5 text-[34px] font-semibold tracking-[-0.5px] text-black">
            ₹{item.price}
          </p>

          {/* OPTIONS */}
          <div className="mt-10">
            
            {/* COLOR */}
            {item.selectedOptions?.find((o: any) =>
              o.fieldName.toLowerCase().includes("color")
            ) && (
              <p className="mb-4 text-[15px] text-[#6f6f6f]">
                Color:{" "}
                <span className="text-black">
                  {
                    item.selectedOptions.find((o: any) =>
                      o.fieldName
                        .toLowerCase()
                        .includes("color")
                    )?.value
                  }
                </span>
              </p>
            )}

            {/* VARIANTS + QTY */}
            <div className="flex items-center justify-between gap-6">
              
              {/* VARIANTS */}
              <div className="flex flex-wrap items-center gap-3">
                {item.selectedOptions
                  ?.filter(
                    (opt: any) =>
                      !opt.fieldName
                        .toLowerCase()
                        .includes("color")
                  )
                  .map((opt: any, index: number) => (
                    <div
                      key={index}
                      className="flex h-[52px] min-w-[120px] items-center border border-[#d9d9d9] bg-white px-5 text-[15px] text-black"
                    >
                      {opt.value}
                    </div>
                  ))}
              </div>

              {/* QTY */}
              <div className="ml-auto flex items-center gap-4">
                
                <button
                  onClick={() =>
                    setQty(
                      Math.max(
                        min,
                        Number((qty - step).toFixed(2))
                      )
                    )
                  }
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-black transition hover:bg-black hover:text-white"
                >
                  <Minus size={16} strokeWidth={1.5} />
                </button>

                <span className="min-w-[16px] text-center text-[18px] font-medium text-black">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty(
                      Number((qty + step).toFixed(2))
                    )
                  }
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-black transition hover:bg-black hover:text-white"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* UPDATE BUTTON */}
          <button
            onClick={() => {
              updateQuantity(item, qty);
              onClose();
            }}
            className="mt-8 h-[54px] w-full bg-black text-[15px] font-medium tracking-[1px] text-white transition hover:bg-[#1d1d1d]"
          >
            UPDATE
          </button>

          {/* PRODUCT CODE */}
       

          {/* DETAILS */}
          <Link
            href={`/products/${item.slug || item.productId}`}
            className="mx-auto mt-5 border-b border-black pb-[1px] text-[15px] text-black transition hover:opacity-60"
          >
            View more details
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}