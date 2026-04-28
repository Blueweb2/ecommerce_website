"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AddressStep from "@/components/checkout/AddressStep";
import DeliveryStep from "@/components/checkout/DeliveryStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import CompleteStep from "@/components/checkout/CompleteStep";
import { orderAPI } from "@/lib/api/order.api";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

type DeliveryMethod = "standard" | "express";
type PaymentMethod = "cod" | "razorpay";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("standard");

  const { items, totalPrice } = useCartStore();

  const showCompleteStep = async () => {
    await useCartStore.getState().clearCartAsync();
    setStep(4);
  };

  const handlePlaceOrder = async (method: PaymentMethod) => {
    try {
      if (!selectedAddress) {
        toast.error(
          "Please select a delivery address before placing the order."
        );
        return;
      }

      const { street, city, state, postalCode, country } = selectedAddress;
      if (!street || !city || !state || !postalCode || !country) {
        toast.error(
          "Complete address details are required before placing the order."
        );
        return;
      }

      await orderAPI.createOrder({
        shippingAddress: { street, city, state, postalCode, country },
        paymentMethod: method,
        notes: "",
      });

      await showCompleteStep();
    } catch (err) {
      console.error("Order failed", err);
      toast.error("Order failed. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mb-8">
        {["Address", "Delivery", "Payment", "Complete"].map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= i + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </div>
            <p className="text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="border p-6 rounded-lg">
        {step === 1 && (
          <AddressStep
            onNext={() => setStep(2)}
            setAddress={setSelectedAddress}
            selectedAddress={selectedAddress}
          />
        )}

        {step === 2 && (
          <DeliveryStep
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            setDeliveryMethod={setDeliveryMethod}
          />
        )}

        {step === 3 && (
          <PaymentStep
            items={items}
            total={totalPrice}
            deliveryMethod={deliveryMethod}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePlaceOrder}
            onPaymentSuccess={showCompleteStep}
            shippingAddress={selectedAddress}
          />
        )}

        {step === 4 && <CompleteStep />}
      </div>
    </div>
  );
}
