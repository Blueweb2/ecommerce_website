"use client";

import AccountPageShell from "@/components/account/AccountPageShell";
import AccountDetails from "@/components/profile/AccountDetails";

export default function AccountDetailsPage() {
  return (
    <AccountPageShell title="Account Details">
      <AccountDetails />
    </AccountPageShell>
  );
}
