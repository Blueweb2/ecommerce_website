"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/useAuthStore";
import AdminLayoutWrapper from "@/components/admin/layout/AdminLayoutWrapper";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useAuthInit();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/admin/login");
      } else if (
        user.role !== "admin" &&
        user.role !== "superadmin"
      ) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, router]);

  // ⛔ Prevent rendering until auth is checked
  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}