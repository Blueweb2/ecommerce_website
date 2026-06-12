"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useVendorPortalData } from "@/hooks/useVendorPortalData";
import Link from "next/link";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorOrdersClient() {
  const { orders, stats, loading, error, notice } = useVendorPortalData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const customer =
        typeof order.user === "object"
          ? `${order.user?.name || ""} ${order.user?.email || ""}`
          : `${order.guestEmail || ""}`;

      const matchesQuery =
        !normalizedQuery ||
        order._id.toLowerCase().includes(normalizedQuery) ||
        customer.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-[32px] bg-slate-200" />;
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_55%,#dbeafe_180%)] text-white shadow-xl">
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-100">
            <ShoppingBag className="h-3.5 w-3.5" />
            Order Snapshot
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Vendor orders</h1>
            <p className="mt-2 text-sm text-blue-100/90">
              Watch new demand, pending fulfillment, and delivered volume.
            </p>
          </div>
        </div>
      </section>

      {notice ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {notice}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[24px] border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total orders</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {stats.totalOrders}
          </p>
        </article>
        <article className="rounded-[24px] border bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="mt-3 text-3xl font-semibold text-amber-900">
            {stats.pendingOrders}
          </p>
        </article>
        <article className="rounded-[24px] border bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Delivered</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-900">
            {stats.deliveredOrders}
          </p>
        </article>
        <article className="rounded-[24px] border bg-sky-50 p-5 shadow-sm">
          <p className="text-sm text-sky-700">Vendor revenue</p>
          <p className="mt-3 text-3xl font-semibold text-sky-900">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </article>
      </section>

      <section className="rounded-[28px] border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders by ID or customer"
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                    statusFilter === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredOrders.length ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Order</th>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Items</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      <Link href={`/designer/orders/${order._id}`} className="hover:text-blue-600 hover:underline">
                        #{order._id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {typeof order.user === "object"
                        ? order.user?.name || order.user?.email
                        : order.guestEmail || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.totalQuantity} items
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(
                        "vendorTotal" in order && typeof order.vendorTotal === "number"
                          ? order.vendorTotal
                          : order.grandTotal
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-500">
                No vendor orders matched the current filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
