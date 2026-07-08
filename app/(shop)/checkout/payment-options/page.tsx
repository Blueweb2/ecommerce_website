"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import CheckoutSteps from "@/components/checkout/new/CheckoutSteps";
import CheckoutTotalsBreakdown from "@/components/checkout/new/CheckoutTotalsBreakdown";
import { calculateCheckoutTotals } from "@/lib/utils/pricing";
import { bodoni } from "@/lib/fonts";
import { orderAPI } from "@/lib/api/order.api";
import { loadRazorpayScript } from "@/lib/utils/razorpay";
import {
  buildCheckoutOrderNotes,
  clearCheckoutSession,
  getShippingCharge,
  getStoredCheckoutAddress,
  getStoredCheckoutMode,
  getStoredGiftMessage,
  getStoredPackagingOption,
  getStoredShippingOption,
  getGuestCheckoutEmail,
  type PackagingOption,
  type ShippingOption,
} from "@/lib/utils/checkoutSession";
import {
  getPhoneValidationError,
  normalizePhoneNumber,
} from "@/lib/utils/phone";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

type PaymentMethod = "cod" | "razorpay";

interface CreatedOrder {
  _id: string;
  grandTotal: number;
  razorpayOrderId?: string;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

export default function PaymentOptionsPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const {
    items,
    appliedPromo,
    clearCartAsync,
    hydrated,
    ensureServerCartForCheckout,
    syncCart,
  } = useCartStore();
  const [checkoutMode] = useState(getStoredCheckoutMode);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);
  const [shippingAddress] = useState<Address | null>(getStoredCheckoutAddress);
  const [packagingOption] = useState<PackagingOption>(
    () => getStoredPackagingOption() ?? "standard"
  );
  const [shippingOption] = useState<ShippingOption>(
    () => getStoredShippingOption() ?? "standard"
  );
  const [giftMessage] = useState(() => getStoredGiftMessage());

  const shippingCharge = getShippingCharge(shippingOption);
  const discountAmount = appliedPromo?.discountAmount || 0;
  useEffect(() => {
    if (!initialized || !hydrated) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (!isAuthenticated && checkoutMode !== "guest") {
      router.replace("/checkout/login");
      return;
    }

    if (!getStoredCheckoutAddress()) {
      router.replace("/checkout/shipping-address");
      return;
    }

    if (getStoredShippingOption() === null) {
      router.replace("/checkout/shipping-options");
      return;
    }

    if (getStoredPackagingOption() === null) {
      router.replace("/checkout/packaging-options");
    }

  }, [checkoutMode, hydrated, initialized, isAuthenticated, items.length, router]);

  const finalizeCheckout = async () => {
    clearCheckoutSession();
    await clearCartAsync();
    router.push("/checkout/success");
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please select a shipping address first.");
      return;
    }

    const phoneError = getPhoneValidationError(shippingAddress.phone);

    if (phoneError) {
      toast.error(`${phoneError} Go back to shipping details to fix it.`);
      return;
    }

    const normalizedPhone = normalizePhoneNumber(shippingAddress.phone);

    if (!isAuthenticated && checkoutMode !== "guest") {
      toast.error("Please sign in to place your order.");
      router.push("/checkout/login");
      return;
    }

    try {
      setLoading(true);
      const cartReady = await ensureServerCartForCheckout();

      if (!cartReady) {
        toast.error("Your cart is empty. Please add items before checkout.");
        router.replace("/cart");
        return;
      }

      // Only sync server cart for logged-in users
      if (checkoutMode !== "guest") {
        await syncCart();
      }

      const latestItems = useCartStore.getState().items;
      const payableTotals = calculateCheckoutTotals({
        items: latestItems,
        shippingCharge,
        discountAmount,
      });

      const res = await orderAPI.createOrder({
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: normalizedPhone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod,
        shippingCharge,
        promoCode: appliedPromo?.code,
        packagingOption,
        giftMessage: packagingOption === "gift" ? giftMessage : "",
        notes: buildCheckoutOrderNotes(
          packagingOption,
          packagingOption === "gift" ? giftMessage : null
        ),
        isGuestOrder: checkoutMode === "guest",
        guestEmail: checkoutMode === "guest" ? getGuestCheckoutEmail() || undefined : undefined,
        items: checkoutMode === "guest" ? latestItems.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          variantId: i.variantId,
          selectedOptions: i.selectedOptions,
        })) : undefined,
      });

      const order = (res.data.data || res.data) as CreatedOrder;

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully.");
        await finalizeCheckout();
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded || !order.razorpayOrderId) {
        toast.error("Unable to start Razorpay checkout.");
        return;
      }

      const Razorpay = (
        window as Window & typeof globalThis & {
          Razorpay: RazorpayConstructor;
        }
      ).Razorpay;

      const instance = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round((order.grandTotal || payableTotals.grandTotal) * 100),
        currency: "INR",
        name: "ZENFAZ",
        description: "Checkout Payment",
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          await orderAPI.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            orderId: order._id,
          });

          toast.success("Payment successful.");
          await finalizeCheckout();
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
          },
        },
      });

      instance.open();
    } catch (error: unknown) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      if (apiMessage === "Cart is empty") {
        toast.error(
          "Your cart could not be synced. Please return to the cart and try again."
        );
        router.replace("/cart");
        return;
      }

      toast.error(apiMessage || "Unable to place your order right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || !hydrated || items.length === 0 || !shippingAddress) {
    return null;
  }

  return (
    <CheckoutContainer shippingCharge={shippingCharge}>
      <CheckoutSteps step={4} />

      <div className="border-b border-[#e5e5e5] pb-10">
        <h1 className={`mb-8 text-[24px] text-black ${bodoni.className}`}>
          Review & Pay
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 text-[12px] uppercase tracking-[0.15em] text-[#666]">
              Ship To
            </p>

            <div className="space-y-1 text-[13px] leading-7 text-black">
              <p className="uppercase">{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p>{shippingAddress.street}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[12px] uppercase tracking-[0.15em] text-[#666]">
              Delivery & Packaging
            </p>

            <div className="space-y-2 text-[13px] leading-7 text-black">
              <p>
                {shippingOption === "express"
                  ? "Express Delivery - ₹50"
                  : "Standard Delivery - Free"}
              </p>
              <p>{packagingOption === "gift" ? "Gift Packaging" : "Standard Packaging"}</p>
              <p className="text-[#666]">
                {packagingOption === "gift"
                  ? "Luxury gift box selected for this order."
                  : "Eco-friendly standard packaging selected."}
              </p>
              {packagingOption === "gift" && giftMessage.trim() && (
                <p className="text-[#666]">
                  Message: &ldquo;{giftMessage.trim()}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className={`mb-6 text-[24px] text-black ${bodoni.className}`}>
          Order Total
        </h2>
        <CheckoutTotalsBreakdown
          items={items}
          shippingCharge={shippingCharge}
          discountAmount={discountAmount}
        />
      </div>

      <div className="mt-12">
        <h2 className={`mb-10 text-[24px] text-black ${bodoni.className}`}>
          Payment Methods
        </h2>

        <label className="flex cursor-pointer items-start gap-4 border border-[#dcdcdc] bg-white p-6">
          <input
            type="radio"
            checked={paymentMethod === "razorpay"}
            onChange={() => setPaymentMethod("razorpay")}
            className="mt-1 h-5 w-5"
          />

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-black">
                Credit / Debit Card / UPI
              </span>
            </div>

            <p className="mt-2 text-[13px] text-[#666]">
              Secure online payment with Razorpay.
            </p>
          </div>
        </label>

        <label className="mt-5 flex cursor-pointer items-center gap-4 border border-[#dcdcdc] bg-white p-6">
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
            className="h-5 w-5"
          />

          <div>
            <span className="text-[13px] font-medium text-black">
              Cash on Delivery
            </span>

            <p className="mt-2 text-[13px] text-[#666]">
              Pay when your order is delivered.
            </p>
          </div>
        </label>

        <div className="mt-10 flex gap-5">
          <button
            onClick={() => router.push("/checkout/packaging-options")}
            className="flex h-[54px] flex-1 items-center justify-center border border-black bg-white text-sm uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
          >
            Back
          </button>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex h-[54px] flex-1 items-center justify-center bg-black text-sm uppercase tracking-[0.15em] text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
                ? "Place Order"
                : "Pay Now"}
          </button>
        </div>
      </div>
    </CheckoutContainer>
  );
}
