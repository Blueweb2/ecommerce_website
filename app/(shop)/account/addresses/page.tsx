"use client";

import AccountPageShell from "@/components/account/AccountPageShell";
import AddressBook from "@/components/profile/AddressBook";

export default function AddressesPage() {
  return (
    <AccountPageShell title="Address Book">
      <AddressBook />
    </AccountPageShell>
  );
}
