"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";

type Customer = {
  _id: string;
  name?: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  role?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value?: string, withTime = false) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      try {
        const res = await api.get(`/auth/customer/${id}`);
        setUser(res.data?.data ?? null);
      } catch {
        const res = await api.get("/auth/customers");
        const customers = Array.isArray(res.data?.data) ? res.data.data : [];
        const matchedUser = customers.find(
          (customer: Customer) => customer._id === id
        );

        if (!matchedUser) {
          throw new Error("User not found");
        }

        setUser(matchedUser);
      }
    } catch {
      setUser(null);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="rounded-[32px] bg-[#12251a] p-8 text-white shadow-xl">
          <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-white/15" />
          <div className="mt-6 h-20 animate-pulse rounded-[24px] bg-white/8" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-[28px] border border-rose-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <UserX className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          User not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The customer record could not be loaded for this ID.
        </p>
        <Link
          href="/admin/users"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </div>
    );
  }

  const displayName = user.name?.trim() || user.email.split("@")[0];

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </div>

      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-[28px] bg-white/10 text-2xl font-semibold text-white">
                {getInitials(displayName)}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Customer profile
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                  {displayName}
                </h1>
                <p className="mt-2 text-sm text-emerald-50/80">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {user.isActive ? (
                  <UserCheck className="h-4 w-4" />
                ) : (
                  <UserX className="h-4 w-4" />
                )}
                {user.isActive ? "Active account" : "Blocked account"}
              </span>

              <button
                type="button"
                onClick={fetchUser}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Role</p>
              <p className="mt-3 text-xl font-semibold capitalize">
                {user.role || "Customer"}
              </p>
            </article>

            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Joined</p>
              <p className="mt-3 text-xl font-semibold">
                {formatDate(user.createdAt)}
              </p>
            </article>

            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Last update</p>
              <p className="mt-3 text-xl font-semibold">
                {formatDate(user.updatedAt, true)}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            Account details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Identity and contact information for this customer.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Full name
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {displayName}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="mt-1 break-all text-base font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Customer ID
                  </p>
                  <p className="mt-1 break-all text-base font-semibold text-slate-900">
                    {user._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">Activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Helpful timestamps for support and admin review.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Joined on
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-950">
                    {formatDate(user.createdAt, true)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sky-700">
                    Last updated
                  </p>
                  <p className="mt-1 text-base font-semibold text-sky-950">
                    {formatDate(user.updatedAt, true)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Account state
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {user.isActive
                  ? "This user account is currently active."
                  : "This user account is currently blocked."}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
