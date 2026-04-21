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
  const { approveRefund, rejectRefund, approveReturn, rejectReturn, markReturnReceived } = useOrderStore();
  const [refundFilter, setRefundFilter] = useState<
  "all" | "requested" | "approved" | "rejected"
>("all");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  
const filteredOrders = useMemo(() => {
  let result = orders;

  // ✅ STATUS FILTER
  if (activeStatus !== "all") {
    result = result.filter((order) => order.status === activeStatus);
  }

  // ✅ SEARCH FILTER
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase();

    result = result.filter((order) => {
      const userObj =
        typeof order.user === "object" ? order.user : null;

      return (
        order._id.toLowerCase().includes(query) ||
        (userObj?.name?.toLowerCase().includes(query)) ||
        (userObj?.email?.toLowerCase().includes(query))
      );
    });
  }

  // ✅ 🔥 REFUND FILTER (NEW)
  if (refundFilter !== "all") {
    result = result.filter(
      (order) => order.refundStatus === refundFilter
    );
  }

  return result;
}, [orders, activeStatus, searchQuery, refundFilter]);

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

    {/* HEADER */}
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

    {/* STATS */}
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-[24px] border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total orders</p>
        <p className="mt-4 text-3xl font-semibold">{pagination.total}</p>
      </article>

      <article className="rounded-[24px] border bg-emerald-50 p-5 shadow-sm">
        <p className="text-sm text-emerald-700">Delivered</p>
        <p className="mt-4 text-3xl font-semibold">
          {orders.filter((o) => o.status === "delivered").length}
        </p>
      </article>

      <article className="rounded-[24px] border bg-orange-50 p-5 shadow-sm">
        <p className="text-sm text-orange-700">Pending</p>
        <p className="mt-4 text-3xl font-semibold">
          {orders.filter((o) => o.status === "pending").length}
        </p>
      </article>
    </section>

    {/* TABLE */}
    <section className="rounded-[28px] border bg-white shadow-sm overflow-hidden">

      {/* TOP BAR */}
      <div className="border-b p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="border px-3 py-2 rounded"
          />

          {/* 🔥 REFUND FILTER BUTTONS WITH COUNT */}
          <div className="flex gap-2">
            {["all", "requested", "approved", "rejected"].map((f) => {
              const count =
                f === "all"
                  ? orders.length
                  : orders.filter((o) => o.refundStatus === f).length;

              return (
                <button
                  key={f}
                  onClick={() => setRefundFilter(f as any)}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    refundFilter === f
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {f}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center">No orders found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t">

                  {/* ID */}
                  <td className="p-4 font-mono">
                    {order._id.slice(-8)}
                  </td>

                  {/* USER */}
                  <td className="p-4">
                    {typeof order.user === "object" ? (
                      <>
                        <p>{order.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {order.user.email}
                        </p>
                      </>
                    ) : "Unknown"}
                  </td>

                  {/* PRICE */}
                  <td className="p-4 font-medium">
                    ₹{order.totalPrice}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                      {order.status}
                    </span>

                    {/* REFUND BADGE */}
                    {order.refundStatus !== "none" && (
                      <div className="text-xs mt-1 text-purple-600">
                        Refund: {order.refundStatus}
                      </div>
                    )}
                    
                    {/* RETURN BADGE */}
                    {order.returnStatus && order.returnStatus !== "none" && (
                      <div className="text-xs mt-1 text-orange-600">
                        Return: {order.returnStatus}
                      </div>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">

                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="px-3 py-1 bg-gray-100 rounded text-xs"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(order._id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded text-xs"
                      >
                        Delete
                      </button>

                      {/* REFUND ACTIONS */}
                      {order.refundStatus === "requested" && (
                        <>
                          <button
                            onClick={() => approveRefund(order._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectRefund(order._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* RETURN ACTIONS */}
                      {order.returnStatus === "requested" && (
                        <>
                          <button
                            onClick={() => approveReturn(order._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                          >
                            Approve Return
                          </button>

                          <button
                            onClick={() => rejectReturn(order._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                          >
                            Reject Return
                          </button>
                        </>
                      )}

                      {order.returnStatus === "approved" && (
                        <button
                          onClick={() => markReturnReceived(order._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          Mark Received
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* PAGINATION */}
      {pagination.pages > 1 && (
        <div className="flex justify-between p-4 border-t">
          <button
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} / {pagination.pages}
          </span>

          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}

    </section>
  </div>
);
}