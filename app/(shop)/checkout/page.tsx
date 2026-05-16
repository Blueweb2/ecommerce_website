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
import { loadRazorpayScript } from "@/lib/utils/razorpay";

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

/* ================= HANDLE ORDER ================= */
const handlePlaceOrder = async (method: PaymentMethod) => {
  try {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    const { street, city, state, postalCode, country } = selectedAddress;
    const shippingCharge = deliveryMethod === "express" ? 50 : 0;

    /* ================= CREATE ORDER ================= */
    const res = await orderAPI.createOrder({
      shippingAddress: { street, city, state, postalCode, country },
      paymentMethod: method,
      shippingCharge,
      notes: "",
    });

    const order = res.data.data || res.data;

    /* ================= COD FLOW ================= */
    if (method === "cod") {
      toast.success("Order placed successfully!");
      await showCompleteStep();
      return;
    }

    /* ================= RAZORPAY FLOW ================= */
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK. Are you online?");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(order.grandTotal * 100), // ✅ Use grandTotal
      currency: "INR",
      name: "Your Store Name",
      description: "Order Payment",
      order_id: order.razorpayOrderId,

      handler: async (response: any) => {
        try {
          await orderAPI.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            orderId: order._id,
          });

          toast.success("Payment successful!");
          await showCompleteStep();
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      toast.error("Payment failed. You can retry from your orders.");
      console.error("Payment failed details:", response.error);
    });

    rzp.open();
  } catch (err: any) {
    console.error("Order failed", err);
    const errorMsg = err.response?.data?.message || "Order failed. Please try again.";
    toast.error(errorMsg);
  };
};

  return ( 
    <div className="max-w-5xl mx-auto p-6 mt-10 md:mt-20"> 

      <div className="flex relative justify-between mb-8">
        {["Address", "Delivery", "Payment", "Complete"].map((label, i) => ( 
          <div key={label} className="flex-1 text-center z-10">
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
              step >= i + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {i + 1} 
            </div> 
            <p className="text-sm mt-1">{label}</p> 
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-1 bg-blue-500/20 rounded-full"></div>
      </div>

      <div className="border border-[#8D8B9D] p-6">
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
            shippingAddress={selectedAddress} 
            onPaymentSuccess={showCompleteStep}      />
        )}

        {step === 4 && <CompleteStep />}
      </div>

    </div>
  );
};