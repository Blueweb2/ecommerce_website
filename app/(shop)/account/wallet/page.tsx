"use client";

import { ShieldCheck } from "lucide-react";

import AccountPageShell from "@/components/account/AccountPageShell";
import EmptyState from "@/components/account/EmptyState";

export default function WalletPage() {
  return (
    <AccountPageShell title="Privacy Settings">
      <EmptyState
        icon={ShieldCheck}
        title="Privacy settings are coming soon"
        description="Manage your account privacy preferences, security options, and communication settings here."
      />
    </AccountPageShell>
  );
}