"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

type Customer = {
  _id: string;
  name?: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type StatusFilter = "all" | "active" | "blocked";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatJoinedDate(value?: string) {
  if (!value) return "Recently added";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently added";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function UsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchUsers = async () => {
    setLoading(true);

    try {
     const res = await api.get("/auth/customers");

setUsers(
  Array.isArray(res.data?.data) ? res.data.data : []
);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      user.name?.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "blocked" && !user.isActive);

    return matchesQuery && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const blockedUsers = totalUsers - activeUsers;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] bg-[#12251a] p-6 text-white shadow-xl">
          <div className="h-4 w-28 animate-pulse rounded-full bg-white/15" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-white/20" />
          <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-gray-300" />
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-8 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Customer directory
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Track every customer at a glance
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80 md:text-base">
              Review account health, scan user details, and quickly focus on
              blocked or recently added customers.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh list
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total users</span>
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{totalUsers}</p>
          <p className="mt-2 text-sm text-slate-500">
            Full customer accounts currently in the system.
          </p>
        </article>

        <article className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700">
              Active users
            </span>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-emerald-950">
            {activeUsers}
          </p>
          <p className="mt-2 text-sm text-emerald-700/80">
            Accounts that can currently sign in and shop.
          </p>
        </article>

        <article className="rounded-[24px] border border-rose-100 bg-rose-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-rose-700">
              Blocked users
            </span>
            <UserX className="h-5 w-5 text-rose-600" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-rose-950">
            {blockedUsers}
          </p>
          <p className="mt-2 text-sm text-rose-700/80">
            Accounts that need admin attention before reuse.
          </p>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Customers</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredUsers.length} of {totalUsers} accounts
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-w-[240px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or email"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="blocked">Blocked only</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No customers match this view
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing the search term or status filter to reveal more
              customer accounts.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const displayName =
                      user.name?.trim() || user.email.split("@")[0];

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#12251a] text-sm font-semibold text-white">
                              {getInitials(displayName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {displayName}
                              </p>
                              <p className="text-sm text-slate-500">
                                ID: {user._id.slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatJoinedDate(user.createdAt || user.updatedAt)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Blocked"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                          >
                            View details
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredUsers.map((user) => {
                const displayName =
                  user.name?.trim() || user.email.split("@")[0];

                return (
                  <article
                    key={user._id}
                    className="rounded-[24px] border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#12251a] text-sm font-semibold text-white">
                          {getInitials(displayName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {displayName}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>
                        Joined {formatJoinedDate(user.createdAt || user.updatedAt)}
                      </span>
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="inline-flex items-center gap-1 font-medium text-slate-900"
                      >
                        Open
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
