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
  Download,
} from "lucide-react";
import OrderTimeline from "@/components/orders/OrderTimeline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { loadRazorpay } from "@/lib/utils/loadRazorpay";
import { orderAPI } from "@/lib/api/order.api";
import { Order } from "@/types/order";
import { getOrderTotals } from "@/lib/utils/orderTotals";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
}

interface RazorpayInstance {
  open: () => void;
}

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
    const reason = window.prompt(
      "Please enter a reason for returning this order:"
    );
    if (reason) {
      await requestReturn(id, reason);
    }
  };

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
        handler: async function (response: RazorpaySuccessResponse) {
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

      const Razorpay = (
        window as Window & typeof globalThis & { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }
      ).Razorpay;
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Retry payment failed");
    }
  };

  const downloadInvoice = async (order: Order) => {
    const element = document.getElementById(`invoice-download-${order._id}`);
    if (!element) return;

    element.classList.remove("hidden");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const elements = clonedDoc.getElementsByTagName("*");
        for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
          const style = window.getComputedStyle(el);

          if (style.color.includes("lab") || style.color.includes("oklch")) {
            el.style.color = "#000000";
          }
          if (
            style.backgroundColor.includes("lab") ||
            style.backgroundColor.includes("oklch")
          ) {
            el.style.backgroundColor = "#ffffff";
          }
          if (
            style.borderColor.includes("lab") ||
            style.borderColor.includes("oklch")
          ) {
            el.style.borderColor = "#e5e7eb";
          }
        }
      },
    });

    element.classList.add("hidden");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#d4af37]" />
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
          📦
        </div>
        <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
        <p className="mt-2 max-w-sm px-6 text-sm text-gray-500">
          You haven&apos;t placed any orders yet. Start shopping to see your
          order history here!
        </p>
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mt-8 rounded-full bg-black px-8 py-3 font-bold text-white shadow-lg transition hover:bg-gray-800"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const pricing = getOrderTotals(order);

        return (
          <div
            key={order._id}
            className="group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="font-black text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="mr-4 hidden text-right md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Total Amount
                  </p>
                  <p className="font-black text-gray-900">₹{pricing.grandTotal}</p>
                </div>

                <span
                  className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-widest ${
                    order.returnStatus && order.returnStatus !== "none"
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : getStatusColor(order.status)
                  }`}
                >
                  {order.status}
                </span>

                <div className="ml-2 flex items-center gap-2 border-l pl-4">
                  <button
                    onClick={() => {
                      window.location.href = `/orders/${order._id}`;
                    }}
                    className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-black"
                    title="View Details"
                  >
                    <Truck size={18} />
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                    title="Download Invoice"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="rounded-xl p-2 transition-colors hover:bg-gray-50"
                  >
                    {expandedOrder === order._id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {expandedOrder === order._id && (
              <div className="animate-in fade-in slide-in-from-top-2 px-6 pb-6 pt-0 duration-300">
                <div className="space-y-4 rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <OrderTimeline status={order.status} />

                  <div className="space-y-3 border-t border-gray-200/50 pt-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-[10px] font-bold">
                            {item.quantity}x
                          </div>
                          <p className="text-sm font-bold text-gray-700">
                            {typeof item.product === "object"
                              ? item.product.name
                              : "Product"}
                          </p>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200/50 pt-4">
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-[10px] font-black uppercase text-rose-500 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      {!order.isPaid && order.status !== "cancelled" && (
                        <button
                          onClick={() => handleRetryPayment(order)}
                          className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                        >
                          Retry Payment
                        </button>
                      )}
                      {order.isPaid &&
                        order.status === "delivered" &&
                        order.returnStatus === "none" && (
                          <button
                            onClick={() => handleRequestReturn(order._id)}
                            className="text-[10px] font-black uppercase text-purple-600 hover:underline"
                          >
                            Request Return
                          </button>
                        )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Grand Total
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        ₹{pricing.grandTotal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              id={`invoice-download-${order._id}`}
              className="fixed left-[-9999px] top-[-9999px] hidden"
              style={{ backgroundColor: "#ffffff", width: "800px", padding: "48px" }}
            >
              <div className="mb-8 flex items-start justify-between border-b-4 border-black pb-8">
                <div>
                  <h1
                    className="text-5xl font-black uppercase tracking-tighter"
                    style={{ color: "#000000" }}
                  >
                    Tax Invoice
                  </h1>
                  <p className="mt-2 text-xl font-bold" style={{ color: "#000000" }}>
                    E-COMMERCE STORE
                  </p>
                  <p style={{ color: "#6b7280" }}>123 Business Avenue, Digital City</p>
                  <p style={{ color: "#6b7280" }}>GSTIN: 29ABCDE1234F1Z5</p>
                </div>
                <div className="text-right">
                  <p
                    style={{ color: "#9ca3af" }}
                    className="text-xs font-bold uppercase tracking-widest"
                  >
                    Invoice For
                  </p>
                  <p className="text-2xl font-black" style={{ color: "#000000" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ color: "#6b7280" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <table
                className="w-full"
                style={{ marginBottom: "48px", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid #f3f4f6",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "#9ca3af",
                    }}
                  >
                    <th style={{ padding: "16px 8px" }}>Description</th>
                    <th style={{ padding: "16px 8px", textAlign: "center" }}>HSN</th>
                    <th style={{ padding: "16px 8px", textAlign: "center" }}>Qty</th>
                    <th style={{ padding: "16px 8px", textAlign: "right" }}>Rate</th>
                    <th style={{ padding: "16px 8px", textAlign: "center" }}>GST %</th>
                    <th style={{ padding: "16px 8px", textAlign: "right" }}>GST Amt</th>
                    <th style={{ padding: "16px 8px", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td
                        style={{
                          padding: "20px 8px",
                          fontWeight: "700",
                          color: "#111827",
                          fontSize: "11px",
                        }}
                      >
                        {typeof item.product === "object"
                          ? item.product.name
                          : "Product"}
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "center",
                          color: "#9ca3af",
                          fontSize: "11px",
                        }}
                      >
                        9983
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "center",
                          color: "#374151",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "right",
                          color: "#374151",
                          fontSize: "11px",
                        }}
                      >
                        ₹{item.price}
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "center",
                          color: "#374151",
                          fontSize: "11px",
                        }}
                      >
                        {item.gstPercentage || 0}%
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "right",
                          color: "#374151",
                          fontSize: "11px",
                        }}
                      >
                        ₹{(item.gstAmount || 0) * item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "20px 8px",
                          textAlign: "right",
                          fontWeight: "900",
                          color: "#000000",
                          fontSize: "11px",
                        }}
                      >
                        ₹{(item.price + (item.gstAmount || 0)) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div
                    className="flex justify-between text-xs font-bold uppercase"
                    style={{ color: "#6b7280" }}
                  >
                    <span>Subtotal</span>
                    <span>₹{pricing.subtotal}</span>
                  </div>
                  <div
                    className="flex justify-between text-xs font-bold uppercase"
                    style={{ color: "#059669" }}
                  >
                    <span>GST Collected</span>
                    <span>₹{pricing.totalGstAmount}</span>
                  </div>
                  <div
                    className="flex justify-between border-t-2 border-black pt-4"
                    style={{ color: "#000000" }}
                  >
                    <span className="font-black uppercase tracking-widest">
                      Grand Total
                    </span>
                    <span className="text-2xl font-black">₹{pricing.grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 border-t border-gray-100 pt-8 text-center">
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  This is a computer generated document. Thank you for shopping
                  with us!
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
