"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Search,
  Trash2,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useOrderStore } from "@/store/admin/useOrderStore";

const STATUS_TABS = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
    case "processing": return "bg-orange-50 text-orange-700 border-orange-200";
    case "cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200"; // pending
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return <CheckCircle className="h-3 w-3" />;
    case "shipped": return <Truck className="h-3 w-3" />;
    case "processing": return <RefreshCw className="h-3 w-3" />;
    case "cancelled": return <XCircle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

export default function AdminOrdersPage() {
  const {
    orders,
    loading,
    fetchOrders,
    deleteOrder,
    pagination,
  } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (activeStatus !== "all") {
        result = result.filter(order => order.status === activeStatus);
    }

    if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        result = result.filter(order => {
            const userObj = typeof order.user === 'object' ? order.user : null;
            return (
              order._id.toLowerCase().includes(query) || 
              (userObj && userObj.name?.toLowerCase().includes(query)) ||
              (userObj && userObj.email?.toLowerCase().includes(query))
            );
        });
    }
    
    return result;
  }, [orders, activeStatus, searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order? This cannot be undone.")) {
      await deleteOrder(id);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage, pagination.limit);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <ShoppingBag className="h-3.5 w-3.5" />
              Order Management
            </div>
            <h1 className="mt-4 text-3xl font-bold">All Orders</h1>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total orders</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {pagination.total}
          </p>
        </article>

        <article className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Delivered</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-950">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </article>

        <article className="rounded-[24px] border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-700">Pending</p>
          <p className="mt-4 text-3xl font-semibold text-orange-950">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </article>
      </section>

      {/* Main List Section */}
      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Transactions
                </h2>
                 <p className="mt-1 text-sm text-slate-500">
                  {filteredOrders.length} orders visible
                </p>
              </div>

              <label className="flex min-w-[260px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by ID, name, or email"
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-3 mt-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveStatus(tab.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeStatus === tab.value
                    ? "bg-[#12251a] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-slate-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="p-10 text-center text-slate-500">No orders found matching the criteria.</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {typeof order.user === 'object' && order.user !== null ? (
                        <>
                          <div className="font-medium text-slate-900">{order.user.name || "Unknown"}</div>
                          <div className="text-xs text-slate-500">{order.user.email || "No email"}</div>
                        </>
                      ) : (
                        <div className="font-medium text-slate-900">Unknown</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 rounded bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="inline-flex items-center gap-1.5 rounded bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  Next
                </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}