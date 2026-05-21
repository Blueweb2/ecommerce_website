"use client";

import { Gift } from "lucide-react";

import AccountPageShell from "@/components/account/AccountPageShell";
import EmptyState from "@/components/account/EmptyState";

export default function RewardsPage() {
  return (
    <AccountPageShell title="Rewards Program">
      <EmptyState
        icon={Gift}
        title="Rewards are coming soon"
        description="Your future member rewards, exclusive perks, and account offers will appear here."
      />
    </AccountPageShell>
  );
}
