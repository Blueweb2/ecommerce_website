"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/useAuthStore";
import AdminLayoutWrapper from "@/components/admin/layout/AdminLayoutWrapper";
import { useAuthInit } from "@/hooks/useAuthInit"; // 👈 import

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useAuthInit(); // 🔥 THIS IS THE KEY

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    router.replace("/admin/login");
    return null;
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    router.replace("/admin/login");
    return null;
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}