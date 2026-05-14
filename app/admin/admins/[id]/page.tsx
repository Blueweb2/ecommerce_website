"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import AdminForm from "@/components/admin/admins/AdminForm";

export default function EditAdminPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get(`/auth/admin/${id}`);
        setData(res.data.data);
      } catch {
        toast.error("Failed to load admin");
      }
    };

    if (id) fetchAdmin();
  }, [id]);

  const handleUpdate = async (formData: any) => {
    await api.patch(`/auth/admin/${id}`, formData);
    toast.success("Admin updated");
    router.push("/admin/admins");
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <AdminForm
      initialData={data}
      onSubmit={handleUpdate}
      isEdit
    />
  );
};