"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AccountHeader from "@/components/account/AccountHeader";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface AccountPageShellProps {
  title: string;
  children: ReactNode;
}

export default function AccountPageShell({
  title,
  children,
}: AccountPageShellProps) {
  const router = useRouter();
  const { user, initialized, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen mt-16 lg:mt-32">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <AccountHeader title={title} />

        <div className="grid gap-20 lg:grid-cols-[260px_1fr]">
          <AccountSidebar />
          {children}
        </div>
      </div>
    </div>
  );
}
