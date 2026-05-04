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

  const downloadInvoice = async (order: Order) => {
    const element = document.getElementById(`invoice-download-${order._id}`);
    if (!element) return;

    element.classList.remove('hidden');
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Find all elements and sanitize their colors
        const elements = clonedDoc.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          const style = window.getComputedStyle(el);
          
          // If the computed color uses modern functions, force a safe fallback
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
    
    element.classList.add('hidden');

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

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-3xl">📦</div>
      <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
      <p className="text-gray-500 mt-2 max-w-sm px-6 text-sm">
        You haven't placed any orders yet. Start shopping to see your order history here!
      </p>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg"
      >
        Start Shopping
      </button>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="group border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* VISIBLE ROW */}
          <div className="p-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-black text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="text-right mr-4 hidden md:block">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                  <p className="font-black text-gray-900">₹{order.grandTotal || order.totalPrice}</p>
               </div>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                  order.returnStatus && order.returnStatus !== "none"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : getStatusColor(order.status)
                }`}
              >
                {order.status}
              </span>

              <div className="flex items-center border-l pl-4 ml-2 gap-2">
                 <button 
                  onClick={() => window.location.href = `/orders/${order._id}`}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
                  title="View Details"
                 >
                    <Truck size={18} />
                 </button>
                 <button 
                  onClick={() => downloadInvoice(order)}
                  className="p-2 hover:bg-emerald-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors"
                  title="Download Invoice"
                 >
                    <Download size={18} />
                 </button>
                 <button 
                  onClick={() => toggleExpand(order._id)}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                 >
                    {expandedOrder === order._id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                 </button>
              </div>
            </div>
          </div>

          {/* EXPANDED PREVIEW */}
          {expandedOrder === order._id && (
            <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                  <OrderTimeline status={order.status} />
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200/50">
                    {order.items.map((item: any, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-[10px] font-bold">
                              {item.quantity}x
                           </div>
                           <p className="text-sm font-bold text-gray-700">
                             {typeof item.product === 'object' ? item.product.name : 'Product'}
                           </p>
                        </div>
                        <span className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                     <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button onClick={() => handleCancelOrder(order._id)} className="text-[10px] font-black uppercase text-rose-500 hover:underline">Cancel</button>
                        )}
                        {!order.isPaid && order.status !== 'cancelled' && (
                          <button onClick={() => handleRetryPayment(order)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Retry Payment</button>
                        )}
                        {order.isPaid && order.status === 'delivered' && order.returnStatus === 'none' && (
                          <button onClick={() => handleRequestReturn(order._id)} className="text-[10px] font-black uppercase text-purple-600 hover:underline">Request Return</button>
                        )}
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                        <p className="text-xl font-black text-gray-900">₹{order.grandTotal || order.totalPrice}</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* HIDDEN INVOICE TEMPLATE FOR PDF CAPTURE */}
          <div 
            id={`invoice-download-${order._id}`} 
            className="hidden fixed left-[-9999px] top-[-9999px]"
            style={{ backgroundColor: '#ffffff', width: '800px', padding: '48px' }}
          >
            <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
              <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: '#000000' }}>Tax Invoice</h1>
                <p className="text-xl font-bold mt-2" style={{ color: '#000000' }}>E-COMMERCE STORE</p>
                <p style={{ color: '#6b7280' }}>123 Business Avenue, Digital City</p>
                <p style={{ color: '#6b7280' }}>GSTIN: 29ABCDE1234F1Z5</p>
              </div>
              <div className="text-right">
                <p style={{ color: '#9ca3af' }} className="font-bold uppercase tracking-widest text-xs">Invoice For</p>
                <p className="text-2xl font-black" style={{ color: '#000000' }}>#{order._id.slice(-8).toUpperCase()}</p>
                <p style={{ color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full" style={{ marginBottom: '48px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>
                  <th style={{ padding: '16px 8px' }}>Description</th>
                  <th style={{ padding: '16px 8px', textAlign: 'center' }}>HSN</th>
                  <th style={{ padding: '16px 8px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '16px 8px', textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: '16px 8px', textAlign: 'center' }}>GST %</th>
                  <th style={{ padding: '16px 8px', textAlign: 'right' }}>GST Amt</th>
                  <th style={{ padding: '16px 8px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '20px 8px', fontWeight: '700', color: '#111827', fontSize: '11px' }}>{typeof item.product === 'object' ? item.product.name : 'Product'}</td>
                    <td style={{ padding: '20px 8px', textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>9983</td>
                    <td style={{ padding: '20px 8px', textAlign: 'center', color: '#374151', fontSize: '11px', fontWeight: '700' }}>{item.quantity}</td>
                    <td style={{ padding: '20px 8px', textAlign: 'right', color: '#374151', fontSize: '11px' }}>₹{item.price}</td>
                    <td style={{ padding: '20px 8px', textAlign: 'center', color: '#374151', fontSize: '11px' }}>{item.gstPercentage || 0}%</td>
                    <td style={{ padding: '20px 8px', textAlign: 'right', color: '#374151', fontSize: '11px' }}>₹{(item.gstAmount || 0) * item.quantity}</td>
                    <td style={{ padding: '20px 8px', textAlign: 'right', fontWeight: '900', color: '#000000', fontSize: '11px' }}>₹{(item.price + (item.gstAmount || 0)) * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between font-bold uppercase text-xs" style={{ color: '#6b7280' }}>
                  <span>Subtotal</span>
                  <span>₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between font-bold uppercase text-xs" style={{ color: '#059669' }}>
                  <span>GST Collected</span>
                  <span>₹{order.totalGstAmount}</span>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-4" style={{ color: '#000000' }}>
                  <span className="font-black uppercase tracking-widest">Grand Total</span>
                  <span className="text-2xl font-black">₹{order.grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center border-t border-gray-100 pt-8">
              <p style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                This is a computer generated document. Thank you for shopping with us!
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;