"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function CheckoutPage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <div>Checkout Page</div>;
  // router.replace("/login?redirect=/checkout");
}