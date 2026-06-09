"use client";

import Link from "next/link";
import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  PackagePlus,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useVendorPortalData } from "@/hooks/useVendorPortalData";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

export default function VendorDashboardClient() {
  const {
    designer,
    identityLabel,
    loading,
    error,
    notice,
    recentOrders,
    topProducts,
    monthlySeries,
    stats,
  } = useVendorPortalData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-[32px] bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-[28px] bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-[32px] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h1 className="text-2xl font-semibold">Vendor dashboard unavailable</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6">{error}</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#10231a_0%,#1e5a43_55%,#d1e4d8_160%)] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-50">
              <BarChart3 className="h-3.5 w-3.5" />
              Vendor Overview
            </div>
            <h1 className="mt-4 text-3xl font-semibold">
              {designer?.brandName || identityLabel}
            </h1>
            <p className="mt-3 text-sm leading-6 text-emerald-50/85">
              Track catalogue health, recent orders, and revenue trends in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/designer/products"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              View Products
            </Link>
            <Link
              href="/designer/products/create"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Add Product
            </Link>
          </div>
        </div>
      </section>

      {notice ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {notice}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Boxes}
          label="Products"
          value={String(stats.totalProducts)}
          tone="bg-slate-100 text-slate-700"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={String(stats.totalOrders)}
          tone="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={CircleDollarSign}
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          tone="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={String(stats.totalCustomers)}
          tone="bg-sky-100 text-sky-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
        <article className="rounded-[28px] border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sales trend</h2>
              <p className="mt-1 text-sm text-slate-500">
                Revenue over the last six months.
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Avg order {formatCurrency(stats.averageOrderValue)}
            </div>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value || 0))}
                  labelStyle={{ color: "#0f172a" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[28px] border bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Order flow</h2>
            <p className="mt-1 text-sm text-slate-500">
              Monthly order count for your brand.
            </p>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr,0.9fr]">
        <article className="rounded-[28px] border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest vendor-linked orders from the shared order feed.
              </p>
            </div>
            <Link
              href="/designer/orders"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length ? (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Order</th>
                    <th className="px-6 py-3 text-left font-medium">Customer</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Vendor total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-100">
                      <td className="px-6 py-4 font-mono text-slate-700">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {typeof order.user === "object"
                          ? order.user?.name || order.user?.email
                          : order.guestEmail || "Guest"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        {formatCurrency(order.vendorTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                No vendor-linked orders yet.
              </div>
            )}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[28px] border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Catalog pulse</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">In stock</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {stats.inStockProducts}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Low stock</p>
                <p className="mt-2 text-2xl font-semibold text-amber-900">
                  {stats.lowStockProducts}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Delivered orders</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-900">
                  {stats.deliveredOrders}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Top products</h2>
              <PackagePlus className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-5 space-y-4">
              {topProducts.length ? (
                topProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Stock {product.stock} · Sold {product.totalSold}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(product.discountPrice || product.price)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Product insights will appear here once your catalogue is linked.
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
