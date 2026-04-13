"use client";

export default function DeliveryStep({
  onNext,
  onBack,
  setDeliveryMethod,
}: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Delivery Method</h2>

      <div
        onClick={() => {
          setDeliveryMethod("standard");
          onNext();
        }}
        className="border p-4 rounded cursor-pointer hover:border-black"
      >
        Standard Delivery (Free)
      </div>

      <div
        onClick={() => {
          setDeliveryMethod("express");
          onNext();
        }}
        className="border p-4 rounded cursor-pointer hover:border-black"
      >
        Express Delivery (₹50)
      </div>

      <button onClick={onBack} className="text-gray-600">
        ← Back
      </button>
    </div>
  );
}