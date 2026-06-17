"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth/useAuthStore";
import AdminLayoutWrapper from "@/components/admin/layout/AdminLayoutWrapper";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin-login";

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user) {
        router.replace("/admin-login");
      } else if (
        user.role !== "admin" &&
        user.role !== "superadmin"
      ) {
        router.replace("/admin-login");
      }
    }
  }, [user, loading, router, pathname, isLoginPage]);

  // If it's the login page, just render children without auth check or wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent rendering until auth is checked
  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
