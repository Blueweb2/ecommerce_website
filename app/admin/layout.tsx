"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/admin/useAdminAuthStore";
import AdminLayoutWrapper from "@/components/admin/layout/AdminLayoutWrapper";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAdminAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (user && user.role !== "admin" && user.role !== "superadmin") {
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router, user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
