"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof RegisterForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone.trim() || undefined,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#f8f6f2] shadow-2xl">
        <section className="hidden flex-1 bg-[linear-gradient(145deg,#161d15_0%,#283223_55%,#87651e_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#e3c67c]">
              Goldland
            </p>
            <h1 className="mt-5 max-w-sm text-4xl font-semibold leading-tight">
              Create your account and start building your jewelry wishlist.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              Save favorites, track your orders, and check out faster whenever
              you are ready.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-[#f5deb0]">
              Password tips
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>Use at least 6 characters</li>
              <li>Include one uppercase letter</li>
              <li>Add at least one number</li>
            </ul>
          </div>
        </section>

        <section className="flex w-full flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-[#1a1f1a]">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Join Goldland to shop, save, and manage your orders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Phone</label>
                <input
                  type="tel"
                  placeholder="Optional phone number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Must include one uppercase letter and one number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1a1f1a] py-2 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#d4af37] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
