"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import { useAdminAuthStore } from "@/store/admin/useAdminAuthStore";
import Link from "next/link";

export default function AdminsPage() {
  const { user } = useAdminAuthStore();

  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== "superadmin") {
    return <div className="p-6 text-red-600">Access denied</div>;
  }

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/auth/admins");
      setAdmins(res.data.data);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🗑️ DELETE ADMIN
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this admin?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/auth/admin/${id}`);
      toast.success("Admin deleted");

      // 🔄 Refresh list
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admins</h2>

        <Link href="/admin/admins/create">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            + Add Admin
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.email}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      a.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {a.isActive ? "Active" : "Disabled"}
                  </span>
                </td>

                {/* 🔥 ACTION BUTTONS */}
                <td className="p-3 flex justify-center gap-2">
                  
                  {/* ✏️ Edit */}
                  <Link href={`/admin/admins/${a._id}`}>
                    <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                      Edit
                    </button>
                  </Link>

                  {/* 🗑️ Delete */}
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}