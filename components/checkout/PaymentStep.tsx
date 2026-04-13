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

  const deliveryCharge = deliveryMethod === "express" ? 50 : 0;
  const finalTotal = total + deliveryCharge;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment</h2>

      {/* 🔹 ORDER SUMMARY */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <h3 className="font-medium">Order Summary</h3>

        {items.map((item: any, index: number) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex gap-3 items-center"
          >
            {/* IMAGE */}
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

              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="font-medium text-sm">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

        <hr />

        {/* DELIVERY */}
        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>
            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
          </span>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      {/* 🔹 PAYMENT METHODS */}
      <div className="space-y-3">
        <div
          onClick={() => setMethod("cod")}
          className={`border p-4 rounded cursor-pointer flex justify-between items-center ${
            method === "cod" ? "border-black bg-gray-100" : ""
          }`}
        >
          <span>Cash on Delivery</span>
          {method === "cod" && <span>✓</span>}
        </div>

        <div
          onClick={() => setMethod("razorpay")}
          className={`border p-4 rounded cursor-pointer flex justify-between items-center ${
            method === "razorpay" ? "border-black bg-gray-100" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Pay with Razorpay</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
              alt="razorpay"
              className="h-5"
            />
          </div>
          {method === "razorpay" && <span>✓</span>}
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="flex justify-between">
        <button onClick={onBack} className="text-gray-600">
          ← Back
        </button>

        <button
          onClick={() => onPlaceOrder(method)}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          {method === "cod" ? "Place Order" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}