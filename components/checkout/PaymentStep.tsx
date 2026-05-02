"use client";

import { useState } from "react";
import Image from "next/image";
import { loadRazorpay } from "@/lib/utils/loadRazorpay";
import { orderAPI } from "@/lib/api/order.api";
import toast from "react-hot-toast";
import type {
  CartItem,
  SelectedOption,
} from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

type PaymentMethod = "cod" | "razorpay";
type DeliveryMethod = "standard" | "express";

interface PaymentStepProps {
  items: CartItem[];
  total: number;
  deliveryMethod: DeliveryMethod;
  onBack: () => void;
  onPlaceOrder: (method: PaymentMethod) => Promise<void>;
  onPaymentSuccess: () => Promise<void>;
  shippingAddress: Address | null;
}

interface RazorpayOrder {
  _id: string;
  totalPrice: number;
  razorpayOrderId: string;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  on: (event: "payment.failed", handler: () => void) => void;
  open: () => void;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;

  modal?: {
    ondismiss?: () => void;
  };
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

const formatSelectedOptions = (selectedOptions: SelectedOption[] = []) =>
  selectedOptions.map((opt) => `${opt.fieldName}: ${opt.value}`).join(", ");

const buildShippingAddress = (address: Address) => ({
  street: address.street,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
});

export default function PaymentStep({
  items,
  total,
  deliveryMethod,
  onBack,
  onPlaceOrder,
  onPaymentSuccess,
  shippingAddress,
}: PaymentStepProps) {
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);

  const deliveryCharge = deliveryMethod === "express" ? 50 : 0;
  const finalTotal = total + deliveryCharge;

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (method === "cod") {
        await onPlaceOrder("cod");
        return;
      }

      if (!shippingAddress) {
        toast.error("Please select a delivery address before payment.");
        return;
      }

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay failed to load.");
        return;
      }

      const res = await orderAPI.createOrder({
        shippingAddress: buildShippingAddress(shippingAddress),
        paymentMethod: "razorpay",
      });
      const order = res.data.data as RazorpayOrder;

      const Razorpay = (
        window as Window & typeof globalThis & { Razorpay: RazorpayConstructor }
      ).Razorpay;

      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(order.totalPrice * 100),
        currency: "INR",
        order_id: order.razorpayOrderId,

        handler: async (response) => {
          try {
            await orderAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              orderId: order._id,
            });

            toast.success("Payment successful!");
            await onPaymentSuccess();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      });

      rzp.on("payment.failed", () => {
        toast.error("Payment failed. You can retry from orders.");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment</h2>

      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <h3 className="font-medium">Order Summary</h3>

        {items.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex gap-3 items-center"
          >
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              width={60}
              height={60}
              className="rounded object-cover"
            />

            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>

              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <p className="text-xs text-gray-500">
                  {formatSelectedOptions(item.selectedOptions)}
                </p>
              )}

              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>

            <p className="font-medium text-sm">₹{item.price * item.quantity}</p>
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

      <div className="space-y-3">
        <div
          onClick={() => setMethod("cod")}
          className={`border p-4 rounded cursor-pointer flex justify-between ${method === "cod" ? "border-black bg-gray-100" : ""
            }`}
        >
          <span>Cash on Delivery</span>
          {method === "cod" && <span>✓</span>}
        </div>

        <div
          onClick={() => setMethod("razorpay")}
          className={`border p-4 rounded cursor-pointer flex justify-between ${method === "razorpay" ? "border-black bg-gray-100" : ""
            }`}
        >
          <span>Pay with Razorpay</span>
          {method === "razorpay" && <span>✓</span>}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack}>← Back</button>

        <button
          onClick={handlePayment}
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
