"use client";

import { useEffect, useState } from "react";
import { orderAPI } from "@/lib/api/order.api";
import OrderTimeline from "@/components/orders/OrderTimeline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { loadRazorpay } from "@/lib/utils/loadRazorpay";

/* ================= TYPES ================= */

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
street: string;
city: string;
state: string;
postalCode: string;
country: string;
};

createdAt: string;
}

/* ================= COMPONENT ================= */

export default function OrderDetailPage({
params,
}: {
params: { id: string };
}) {
const [order, setOrder] = useState<Order | null>(null);
const [loading, setLoading] = useState(true);

/* ================= DOWNLOAD INVOICE ================= */

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
      const elements = clonedDoc.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        const style = window.getComputedStyle(el);
        if (style.color.includes('lab') || style.color.includes('oklch')) {
          el.style.color = '#000000';
        }
        if (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = '#ffffff';
        }
        if (style.borderColor.includes('lab') || style.borderColor.includes('oklch')) {
          el.style.borderColor = '#e5e7eb';
        }
      }
    }
  });
  
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Additional pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
};

/* ================= CANCEL ORDER ================= */

const handleCancel = async () => {
if (!order) return;

try {
  await orderAPI.cancelOrder(order._id);

  setOrder((prev) =>
    prev ? { ...prev, status: "cancelled" } : prev
  );

  alert("Order cancelled successfully");
} catch (err) {
  console.error(err);
  alert("Failed to cancel order");
}


};

/* ================= RETRY PAYMENT ================= */

const handleRetryPayment = async () => {
  if (!order) return;

  try {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay failed to load");
      return;
    }

    const res = await orderAPI.retryPayment(order._id);
    const { razorpayOrderId, amount } = res.data.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round((amount || order.grandTotal) * 100),
      currency: "INR",
      order_id: razorpayOrderId,

      handler: async (response: any) => {
        await orderAPI.verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          orderId: order._id,
        });

        window.location.reload();
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Payment retry failed");
  }
};

/* ================= FETCH ORDER ================= */

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

/* ================= UI STATES ================= */

if (loading) {
return ( <div className="p-6 text-center text-gray-500">
Loading order... </div>
);
}

if (!order) {
return ( <div className="p-6 text-center text-red-500">
Order not found </div>
);
}

/* ================= UI ================= */

return (
  <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 bg-white min-h-screen">
    {/* INVOICE CONTAINER - This is what gets captured */}
    <div id="invoice" className="bg-white p-2 md:p-0">
      
      {/* 1. PROFESSIONAL HEADER (Visible only in PDF or top of page) */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-100 pb-8 mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: '#000000' }}>
            Tax Invoice
          </h1>
          <div className="text-sm font-medium" style={{ color: '#6b7280' }}>
            <p className="font-bold text-lg" style={{ color: '#111827' }}>E-COMMERCE STORE</p>
            <p>123 Business Avenue, Digital City</p>
            <p>Karnataka, India - 560001</p>
            <p className="mt-2" style={{ color: '#059669' }}>GSTIN: 29ABCDE1234F1Z5</p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 inline-block text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Order Reference</p>
            <p className="text-lg font-black" style={{ color: '#111827' }}>#{order._id.slice(-8).toUpperCase()}</p>
            <div className="mt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Date</p>
              <p className="text-sm font-bold" style={{ color: '#000000' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT COLUMN: Items & Address */}
        <div className="md:col-span-2 space-y-10">
          
          {/* SHIPPING ADDRESS */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#9ca3af' }}>
              <span className="w-8 h-[1px]" style={{ backgroundColor: '#e5e7eb' }}></span>
              Shipping To
            </h2>
            <div className="pl-10 space-y-1">
              <p className="font-bold" style={{ color: '#111827' }}>{order.shippingAddress.street}</p>
              <p className="text-sm" style={{ color: '#4b5563' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="text-sm" style={{ color: '#4b5563' }}>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#9ca3af' }}>
              <span className="w-8 h-[1px]" style={{ backgroundColor: '#e5e7eb' }}></span>
              Items Summary
            </h2>
            
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: '#f9fafb', color: '#9ca3af' }}>
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
                          <img
                            src={item.product?.image || "/placeholder.png"}
                            alt={item.product?.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          />
                          <p className="font-bold text-gray-900 leading-tight">{item.product?.name || "Product"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-400 font-medium">9983</td>
                      <td className="px-4 py-4 text-center font-bold text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-gray-600">₹{item.price}</td>
                      <td className="px-4 py-4 text-center text-gray-600">{item.gstPercentage || 0}%</td>
                      <td className="px-4 py-4 text-right text-gray-600">₹{(item.gstAmount || 0) * item.quantity}</td>
                      <td className="px-4 py-4 text-right font-black text-gray-900">
                        ₹{(item.price + (item.gstAmount || 0)) * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STATUS (Hidden in PDF) */}
          <div data-html2canvas-ignore className="space-y-4 pt-4 border-t border-dashed">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Updates</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <OrderTimeline status={order.status} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Payment */}
        <div className="space-y-6">
          {/* FINANCIAL SUMMARY */}
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Calculation</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#9ca3af' }}>Items Total</span>
                <span className="font-medium" style={{ color: '#ffffff' }}>₹{order.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#9ca3af' }}>GST Collected</span>
                <span className="font-bold" style={{ color: '#34d399' }}>₹{order.totalGstAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#9ca3af' }}>Delivery Fee</span>
                <span className="font-bold" style={{ color: '#34d399' }}>FREE</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Grand Total</p>
                  <p className="text-3xl font-black" style={{ color: '#ffffff' }}>₹{order.grandTotal}</p>
                </div>
              </div>
            </div>

            {/* PAYMENT BADGE */}
            <div className={`mt-4 px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-widest border-2 ${
                order.paymentStatus === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500 text-amber-400'
              }`}>
              {order.paymentStatus === 'success' ? 'Fully Paid' : 'Payment Pending'}
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Method</h2>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                   <span className="text-xs font-bold">{order.paymentMethod.slice(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{order.paymentMethod.toUpperCase()}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Verified Secure</p>
                </div>
             </div>
          </div>

          {/* ACTIONS (Hidden in PDF) */}
          <div data-html2canvas-ignore className="space-y-3 pt-4">
            {order.status === "pending" && order.paymentStatus !== "success" && (
              <button
                onClick={handleCancel}
                className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-100 transition-colors"
              >
                Cancel Order
              </button>
            )}

            {order.paymentMethod === "razorpay" && order.paymentStatus !== "success" && (
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Retry Payment
              </button>
            )}

            <button
              onClick={downloadInvoice}
              className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-900 shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER (Visible only in PDF) */}
      <div className="mt-20 border-t border-gray-100 pt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
         <p>This is a computer generated document. No signature required.</p>
         <p className="mt-1">Thank you for shopping with us!</p>
      </div>
    </div>
  </div>
);
}
