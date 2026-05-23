"use client";

import AccountPageShell from "@/components/account/AccountPageShell";
import EmptyState from "@/components/account/EmptyState";

export default function WalletPage() {
  return (
    <AccountPageShell title="Card Wallet">
      <EmptyState />
    </AccountPageShell>
  );
}
