"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import type { AdminCreateDesignerPayload } from "@/types/designer";

type Props = {
  onSubmit: (data: AdminCreateDesignerPayload) => Promise<void>;
};

export default function DesignerForm({ onSubmit }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<AdminCreateDesignerPayload>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create designer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Designer Account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a designer account. The designer will log in and complete
          their own profile, brand details, business information, categories,
          and media assets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">
            Account Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Designer Name
              </label>

              <input
                type="text"
                placeholder="e.g. Aanya Mehra"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="designer@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Temporary Password
              </label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>
    </>
  );
}