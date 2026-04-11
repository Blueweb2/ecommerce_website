"use client";

import CheckoutNavbar from "@/components/checkout/CheckoutNavbar";
import CheckoutProducts from "@/components/checkout/CheckoutProducts";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function CheckoutPage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <CheckoutNavbar />
      <CheckoutProducts />
    </main>
  )
  // router.replace("/login?redirect=/checkout");
}