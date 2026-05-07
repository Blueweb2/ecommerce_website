"use client";
import { bodoni } from "@/lib/fonts";

export default function DeliveryStep({
  onNext,
  onBack,
  setDeliveryMethod,
}: any) {
  
  return (
    <div className="space-y-4">
      <h2 className={`${bodoni.className} text-neutral-600  text-[clamp(25px,2.5vw,32px)] font-normal border-[#8D8B9D]`}>Delivery Method</h2>

      <div
        onClick={() => {
          setDeliveryMethod("standard");
          onNext();
        }}
        className={`${bodoni.className} text-neutral-600 border p-4 cursor-pointer border-[#8D8B9D] hover:border-[#494852]`}
      >
        Standard Delivery (Free)
      </div>

      <div
        onClick={() => {
          setDeliveryMethod("express");
          onNext();
        }}
        className={`${bodoni.className} text-neutral-600 border p-4 cursor-pointer border-[#8D8B9D] hover:border-[#494852]`}
      >
        Express Delivery (₹50)
      </div>

      <button onClick={onBack} className="text-gray-600">
        ← Back
      </button>
    </div>
  );
}