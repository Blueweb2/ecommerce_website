"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { orderAPI } from "@/lib/api/order.api";
import OrderTimeline from "@/components/orders/OrderTimeline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { loadRazorpay } from "@/lib/utils/loadRazorpay";
import { getLineGstAmount, getOrderTotals } from "@/lib/utils/orderTotals";

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

interface OrderItem {
  product: {
    name: string;
    image?: string;
  };
  quantity: number;
  price: number;
  gstPercentage?: number;
  gstAmount?: number;
}

interface Order {
  _id: string;
  status: string;
  paymentStatus: "pending" | "success" | "failed";
  paymentMethod: string;
  isPaid: boolean;
  items: OrderItem[];
  totalPrice: number;
  totalGstAmount: number;
  grandTotal: number;
  shippingAddress: {
    fullName?: string;
    phone?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const downloadInvoice = async () => {
    if (!order) return;

    const element = document.getElementById("invoice");
    if (!element) return;

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

  const handleCancel = async () => {
    if (!order) return;

    try {
      await orderAPI.cancelOrder(order._id);
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
      alert("Order cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  const handleRetryPayment = async () => {
    if (!order) return;

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay failed to load");
        return;
      }

      const pricing = getOrderTotals(order);
      const res = await orderAPI.retryPayment(order._id);
      const { razorpayOrderId, amount } = res.data.data;
      const payableAmount = amount ?? pricing.grandTotal;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(payableAmount * 100),
        currency: "INR",
        order_id: razorpayOrderId,
        handler: async (response: RazorpaySuccessResponse) => {
          await orderAPI.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            orderId: order._id,
          });

          window.location.reload();
        },
      };

      const Razorpay = (
        window as Window & typeof globalThis & { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }
      ).Razorpay;
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment retry failed");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(params.id);
        const data = res.data?.data || res.data;
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-red-500">Order not found</div>;
  }

  const pricing = getOrderTotals(order);

  return (
    <div className="max-w-6xl mx-auto min-h-screen space-y-8 bg-white p-4 md:p-10">
      <div id="invoice" className="bg-white p-2 md:p-0">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b-2 border-gray-100 pb-8 md:flex-row">
          <div className="space-y-1">
            <h1
              className="text-4xl font-black uppercase tracking-tighter"
              style={{ color: "#000000" }}
            >
              Tax Invoice
            </h1>
            <div className="text-sm font-medium" style={{ color: "#6b7280" }}>
              <p className="text-lg font-bold" style={{ color: "#111827" }}>
                E-COMMERCE STORE
              </p>
              <p>123 Business Avenue, Digital City</p>
              <p>Karnataka, India - 560001</p>
              <p className="mt-2" style={{ color: "#059669" }}>
                GSTIN: 29ABCDE1234F1Z5
              </p>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="inline-block rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left">
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#9ca3af" }}
              >
                Order Reference
              </p>
              <p className="text-lg font-black" style={{ color: "#111827" }}>
                #{order._id.slice(-8).toUpperCase()}
              </p>
              <div className="mt-2">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#9ca3af" }}
                >
                  Date
                </p>
                <p className="text-sm font-bold" style={{ color: "#000000" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            <div className="space-y-4">
              <h2
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                style={{ color: "#9ca3af" }}
              >
                <span
                  className="h-[1px] w-8"
                  style={{ backgroundColor: "#e5e7eb" }}
                />
                Shipping To
              </h2>
              <div className="space-y-1 pl-10">
                {order.shippingAddress.fullName && (
                  <p className="font-bold" style={{ color: "#111827" }}>
                    {order.shippingAddress.fullName}
                  </p>
                )}
                {order.shippingAddress.phone && (
                  <p className="text-sm" style={{ color: "#4b5563" }}>
                    {order.shippingAddress.phone}
                  </p>
                )}
                <p className="font-bold" style={{ color: "#111827" }}>
                  {order.shippingAddress.street}
                </p>
                <p className="text-sm" style={{ color: "#4b5563" }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-sm" style={{ color: "#4b5563" }}>
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                style={{ color: "#9ca3af" }}
              >
                <span
                  className="h-[1px] w-8"
                  style={{ backgroundColor: "#e5e7eb" }}
                />
                Items Summary
              </h2>

              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full border-collapse text-left">
                  <thead
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ backgroundColor: "#f9fafb", color: "#9ca3af" }}
                  >
                    <tr>
                      <th className="px-4 py-4">Item Details</th>
                      <th className="px-4 py-4 text-center">HSN</th>
                      <th className="px-4 py-4 text-center">Qty</th>
                      <th className="px-4 py-4 text-right">Rate</th>
                      <th className="px-4 py-4 text-center">GST %</th>
                      <th className="px-4 py-4 text-right">GST Amt</th>
                      <th className="px-4 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item, i) => (
                      <tr key={i} className="text-[11px]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.product?.image || "/placeholder.png"}
                              alt={item.product?.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-lg border border-gray-100 object-cover"
                            />
                            <p className="leading-tight font-bold text-gray-900">
                              {item.product?.name || "Product"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-400">
                          9983
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-gray-600">
                          ₹{item.price}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {item.gstPercentage || 0}%
                        </td>
                        <td className="px-4 py-4 text-right text-gray-600">
                          ₹{getLineGstAmount(item)}
                        </td>
                        <td className="px-4 py-4 text-right font-black text-gray-900">
                          ₹{item.price * item.quantity + getLineGstAmount(item)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              data-html2canvas-ignore
              className="space-y-4 border-t border-dashed pt-4"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
                Live Updates
              </h2>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <OrderTimeline status={order.status} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-6 rounded-3xl bg-gray-900 p-8 text-white shadow-xl">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total Calculation
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#9ca3af" }}>Items Total</span>
                  <span className="font-medium" style={{ color: "#ffffff" }}>
                    ₹{pricing.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#9ca3af" }}>GST Collected</span>
                  <span className="font-bold" style={{ color: "#34d399" }}>
                    ₹{pricing.totalGstAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#9ca3af" }}>Delivery Fee</span>
                  <span className="font-bold" style={{ color: "#34d399" }}>
                    FREE
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "#9ca3af" }}
                    >
                      Grand Total
                    </p>
                    <p className="text-3xl font-black" style={{ color: "#ffffff" }}>
                      ₹{pricing.grandTotal}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 rounded-xl border-2 px-4 py-2 text-center text-xs font-black uppercase tracking-widest ${
                  order.paymentStatus === "success"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500 bg-amber-500/10 text-amber-400"
                }`}
              >
                {order.paymentStatus === "success" ? "Fully Paid" : "Payment Pending"}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Payment Method
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="text-xs font-bold">
                    {order.paymentMethod.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {order.paymentMethod.toUpperCase()}
                  </p>
                  <p className="text-[10px] uppercase tracking-tighter text-gray-500">
                    Verified Secure
                  </p>
                </div>
              </div>
            </div>

            <div data-html2canvas-ignore className="space-y-3 pt-4">
              {order.status === "pending" && order.paymentStatus !== "success" && (
                <button
                  onClick={handleCancel}
                  className="w-full rounded-2xl bg-red-50 py-4 font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  Cancel Order
                </button>
              )}

              {order.paymentMethod === "razorpay" &&
                order.paymentStatus !== "success" && (
                  <button
                    onClick={handleRetryPayment}
                    className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
                  >
                    Retry Payment
                  </button>
                )}

              <button
                onClick={downloadInvoice}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-100 pt-8 text-center text-[10px] uppercase tracking-widest text-gray-400">
          <p>This is a computer generated document. No signature required.</p>
          <p className="mt-1">Thank you for shopping with us!</p>
        </div>
      </div>
    </div>
  );
}
