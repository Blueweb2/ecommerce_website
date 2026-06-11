"use client";

import { usePathname } from "next/navigation";
import { useRequireDesignerAuth } from "@/hooks/useRequireDesignerAuth";
import VendorShell from "@/components/vendor-designer/VendorShell";

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/designer/login";

  // Use the custom hook to protect all pages within /designer/*
  const { loading } = useRequireDesignerAuth();

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return <VendorShell>{children}</VendorShell>;
}
