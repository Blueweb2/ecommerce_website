"use client";

import AccountPageShell from "@/components/account/AccountPageShell";
import MyOrders from "@/components/profile/MyOrders";

export default function OrdersPage() {
  return (
    <AccountPageShell title="My Orders">
      <MyOrders />
    </AccountPageShell>
  );
}
