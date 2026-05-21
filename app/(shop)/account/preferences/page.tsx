"use client";

import AccountPageShell from "@/components/account/AccountPageShell";
import PrivacySettings from "@/components/profile/PrivacySettings";

export default function PreferencesPage() {
  return (
    <AccountPageShell title="Preferences">
      <PrivacySettings />
    </AccountPageShell>
  );
}
