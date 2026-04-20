"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import AdminForm from "@/components/admin/admins/AdminForm";

export default function CreateAdminPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    await api.post("/auth/admin", data);
    toast.success("Admin created");
    router.push("/admin/admins");
  };

  return <AdminForm onSubmit={handleCreate} />;
}