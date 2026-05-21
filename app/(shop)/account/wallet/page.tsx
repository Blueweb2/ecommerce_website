"use client";

import { CreditCard } from "lucide-react";

import AccountPageShell from "@/components/account/AccountPageShell";
import EmptyState from "@/components/account/EmptyState";

export default function WalletPage() {
  return (
    <AccountPageShell title="Card Wallet">
      <EmptyState
        icon={CreditCard}
        title="No payment methods saved"
        description="Securely save your preferred cards for a faster checkout experience."
      />
    </AccountPageShell>
  );
}
