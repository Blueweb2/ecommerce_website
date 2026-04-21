"use client";

import { useEffect, useState } from "react";
import { useMyOrderStore } from "@/store/user/order/useMyOrderStore";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import OrderTimeline from "@/components/orders/OrderTimeline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { loadRazorpay } from "@/lib/utils/loadRazorpay";
import { orderAPI } from "@/lib/api/order.api";
import { Order } from "@/types/order";

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "processing":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "processing":
      return <RefreshCw className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const MyOrders = () => {
  const { orders, loading, fetchMyOrders, cancelOrder, requestReturn } =
    useMyOrderStore();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const toggleExpand = (id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await cancelOrder(orderId);
    }
  };
  const handleRequestReturn = async (id: string) => {
    const reason = window.prompt("Please enter a reason for returning this order:");
    if (reason) {
      await requestReturn(id, reason);
    }
  };

  /* ================= RETRY PAYMENT ================= */
  const handleRetryPayment = async (order: Order) => {
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) return alert("Payment gateway failed");

      const res = await orderAPI.retryPayment(order._id);
      const data = res.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: "INR",
        order_id: data.razorpayOrderId,

        handler: async function (response: any) {
          await orderAPI.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            orderId: order._id,
          });

          alert("Payment successful!");
          await fetchMyOrders();
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Retry payment failed");
    }
  };

  /* ================= INVOICE ================= */
  const downloadInvoice = async (orderId: string) => {
    const element = document.getElementById(`invoice-${orderId}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 0);
    pdf.save(`invoice-${orderId}.pdf`);
  };

  if (loading && orders.length === 0) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl overflow-hidden bg-white shadow-sm"
        >
          {/* HEADER */}
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toDateString()}
              </p>
              <p className="font-mono text-sm">
                #{order._id.slice(-8)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  order.returnStatus && order.returnStatus !== "none"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : getStatusColor(order.status)
                }`}
              >
                {getStatusIcon(order.status)}
                {order.returnStatus && order.returnStatus !== "none"
                  ? `Return ${order.returnStatus.charAt(0).toUpperCase() + order.returnStatus.slice(1)}`
                  : order.status}
              </span>

              <button onClick={() => toggleExpand(order._id)}>
                {expandedOrder === order._id ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>
          </div>

          {/* EXPANDED */}
          {expandedOrder === order._id && (
            <div
              id={`invoice-${order._id}`}
              className="border-t p-4 space-y-4"
            >
              <OrderTimeline status={order.status} />

              {/* ITEMS */}
              <div className="space-y-2">
                {order.items.map((item, i) => {
                  const productName =
                    typeof item.product === "object"
                      ? (item.product as { name: string }).name
                      : "Product";

                  return (
                    <div key={i} className="flex justify-between">
                      <span>{productName}</span>
                      <span>
                        {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center border-t pt-3">

                <div className="flex gap-4">
                  {/* CANCEL */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-red-500 text-sm"
                    >
                      Cancel
                    </button>
                  )}

                  {/* RETRY PAYMENT */}
                  {!order.isPaid && order.status !== "cancelled" && (
                    <button
                      onClick={() => handleRetryPayment(order)}
                      className="text-blue-600 text-sm"
                    >
                      Retry Payment
                    </button>
                  )}
                </div>
                {order.isPaid && order.status === "delivered" && order.returnStatus === "none" && (
                  <button
                    onClick={() => handleRequestReturn(order._id)}
                    className="text-purple-600 text-sm"
                  >
                    Request Return
                  </button>
                )}

                {/* DOWNLOAD */}
                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="text-black text-sm underline"
                >
                  Invoice
                </button>
              </div>

              {/* TOTAL */}
              <div className="text-right font-semibold">
                Total: ₹{order.totalPrice}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;