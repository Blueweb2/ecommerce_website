"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

type AdminFormData = {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  isActive?: boolean;
};

type Props = {
  initialData?: AdminFormData;
  onSubmit: (data: AdminFormData) => Promise<void>;
  isEdit?: boolean;
};

export default function AdminForm({
  initialData,
  onSubmit,
  isEdit = false,
}: Props) {
  const [form, setForm] = useState<AdminFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    phone: initialData?.phone || "",
    isActive: initialData?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof AdminFormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "isActive" ? e.target.checked : e.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //  Basic validation
    if (!form.name || !form.email) {
      toast.error("Name and Email are required");
      return;
    }

    if (!isEdit && !form.password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold">
        {isEdit ? "Edit Admin" : "Create Admin"}
      </h2>

      {/* Name */}
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange("name")}
        className="w-full border px-3 py-2 rounded-lg"
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange("email")}
        className="w-full border px-3 py-2 rounded-lg"
      />

      {/* Password (only for create OR optional update) */}
      {!isEdit && (
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange("password")}
          className="w-full border px-3 py-2 rounded-lg"
        />
      )}

      {/* Phone */}
      <input
        type="text"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange("phone")}
        className="w-full border px-3 py-2 rounded-lg"
      />

      {/* Active Toggle (only in edit) */}
      {isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={handleChange("isActive")}
          />
          Active
        </label>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
      >
        {loading
          ? isEdit
            ? "Updating..."
            : "Creating..."
          : isEdit
          ? "Update Admin"
          : "Create Admin"}
      </button>
    </form>
  );
}