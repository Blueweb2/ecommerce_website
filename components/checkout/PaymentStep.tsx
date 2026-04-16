"use client";

import { useState } from "react";
import Image from "next/image";

export default function PaymentStep({
  items,
  total,
  deliveryMethod,
  onBack,
  onPlaceOrder,
}: any) {
  const [method, setMethod] = useState<"cod" | "razorpay">("cod");
  const [loading, setLoading] = useState(false);

  const deliveryCharge = deliveryMethod === "express" ? 50 : 0;
  const finalTotal = total + deliveryCharge;

  const handleClick = async () => {
    setLoading(true);
    await onPlaceOrder(method);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment</h2>

      {/* ORDER SUMMARY */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <h3 className="font-medium">Order Summary</h3>

        {items.map((item: any, index: number) => (
          <div key={`${item.productId}-${index}`} className="flex gap-3 items-center">
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              width={60}
              height={60}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>

              {item.selectedOptions?.length > 0 && (
                <p className="text-xs text-gray-500">
                  {item.selectedOptions
                    .map((opt: any) => `${opt.fieldName}: ${opt.value}`)
                    .join(", ")}
                </p>
              )}

              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>

            <p className="font-medium text-sm">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

        <hr />

        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="space-y-3">
        <div
          onClick={() => setMethod("cod")}
          className={`border p-4 rounded cursor-pointer flex justify-between ${
            method === "cod" ? "border-black bg-gray-100" : ""
          }`}
        >
          <span>Cash on Delivery</span>
          {method === "cod" && <span>✓</span>}
        </div>

        <div
          onClick={() => setMethod("razorpay")}
          className={`border p-4 rounded cursor-pointer flex justify-between ${
            method === "razorpay" ? "border-black bg-gray-100" : ""
          }`}
        >
          <span>Pay with Razorpay</span>
          {method === "razorpay" && <span>✓</span>}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <button onClick={onBack}>← Back</button>

        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : method === "cod"
            ? "Place Order"
            : "Pay Now"}
        </button>
      </div>
    </div>
  );
}