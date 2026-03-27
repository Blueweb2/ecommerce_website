"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { useAdminAuthStore } from "@/store/admin/useAdminAuthStore";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type AdminProfile = {
  _id?: string;
  name: string;
  email: string;
  role: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRole(role?: string) {
  if (!role) return "Admin";

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function ProfilePage() {
  const { user } = useAdminAuthStore();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/auth/me");
      setProfile(res.data?.data ?? null);
    } catch {
      setProfile(
        user
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : null
      );
      toast.error("Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfile({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }

    fetchProfile();
  }, [fetchProfile, user]);

  if (loading && !profile) {
    return (
      <div className="space-y-6">
        <div className="rounded-[32px] bg-[#12251a] p-8 text-white shadow-xl">
          <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-white/15" />
          <div className="mt-6 h-20 animate-pulse rounded-[24px] bg-white/8" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-[28px] border border-rose-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <UserRound className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          Profile unavailable
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          We could not load the current admin profile right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-18 w-18 items-center justify-center rounded-[28px] bg-white/10 text-2xl font-semibold text-white">
                {getInitials(profile.name || "Admin")}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin profile
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  {profile.name}
                </h1>
                <p className="mt-2 text-sm text-emerald-50/80">
                  {profile.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchProfile}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh profile
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Current role</p>
              <p className="mt-3 text-xl font-semibold">
                {formatRole(profile.role)}
              </p>
            </article>

            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Workspace access</p>
              <p className="mt-3 text-xl font-semibold">Protected admin area</p>
            </article>

            <article className="rounded-[24px] bg-white/7 p-5">
              <p className="text-sm text-emerald-50/75">Account state</p>
              <p className="mt-3 text-xl font-semibold">Authenticated</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            Identity details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Core information tied to this admin session.
          </p>

          <div className="mt-6 space-y-4">
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
                    {profile.name}
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
                  <p className="text-sm font-medium text-slate-500">
                    Email address
                  </p>
                  <p className="mt-1 break-all text-base font-semibold text-slate-900">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Role</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {formatRole(profile.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">
            Admin snapshot
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A quick read on this account&apos;s current capabilities.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Admin access
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-950">
                    You can access protected admin routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-sky-700 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sky-700">
                    Experience
                  </p>
                  <p className="mt-1 text-base font-semibold text-sky-950">
                    Profile page refreshed to match the new admin UI.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Admin ID
              </p>
              <p className="mt-2 break-all text-base font-semibold text-slate-900">
                {profile._id || "Not available"}
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
