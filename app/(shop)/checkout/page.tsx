// "use client";

// import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
// import CheckoutProducts from "@/components/checkout/CheckoutProducts";

// import { useRequireAuth } from "@/hooks/useRequireAuth";

// export default function CheckoutPage() {
//   const { user, loading } = useRequireAuth();

//   if (loading || !user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <main>
//       <CheckoutNavbar />
//       <CheckoutProducts />
//     </main>
//   )
//   // router.replace("/login?redirect=/checkout");
// }

"use client";

import { useState } from "react";
import { useCartStore } from "@/store/user/cart/useCartStore";

import AddressStep from "@/components/checkout/AddressStep";
import DeliveryStep from "@/components/checkout/DeliveryStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import CompleteStep from "@/components/checkout/CompleteStep";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  const { items, totalPrice } = useCartStore();

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Stepper Header */}
      <div className="flex justify-between mb-8">
        {["Address", "Delivery", "Payment", "Complete"].map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center 
              ${step >= i + 1 ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </div>
            <p className="text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
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
            onBack={() => setStep(2)}
            onPlaceOrder={() => setStep(4)}
          />
        )}

        {step === 4 && <CompleteStep />}
      </div>
    </div>
  );
}