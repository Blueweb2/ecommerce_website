"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useMyOrderStore } from "@/store/user/order/useMyOrderStore";
import { Clock, CheckCircle, Truck, XCircle, RefreshCw, Package } from "lucide-react";

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
    case "delivered": return <CheckCircle className="h-4 w-4" />;
    case "shipped": return <Truck className="h-4 w-4" />;
    case "processing": return <RefreshCw className="h-4 w-4" />;
    case "cancelled": return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const MyOrders = () => {
  const { orders, loading, fetchMyOrders, cancelOrder, pagination } = useMyOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const handleCancelOrder = async (orderId: string) => {
     if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
         await cancelOrder(orderId);
     }
  };

  const handlePageChange = (newPage: number) => {
    fetchMyOrders(newPage, pagination.limit);
  };

  if (loading && orders.length === 0) {
     return <div className="p-10 text-center text-slate-500 w-full col-span-full">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="w-full flex items-center justify-center mt-6 md:mt-0">
        <div className="text-center max-w-md px-6">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center border border-black rounded-full text-xl">
              !
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-3">
            You don’t currently have any orders
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
            Once you have checked out, you can view and track your order here
          </p>
          <Link
            href="/"
            className="text-sm underline underline-offset-4 hover:text-gray-800 transition"
          >
            Shop What’s New
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:px-6">
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
            
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <p className="text-sm text-gray-500 mb-1">
                     Order Placed: <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                     Order ID: <span className="font-mono font-medium text-gray-900">{order._id.slice(-8).toUpperCase()}</span>
                  </p>
               </div>
               
               <div className="flex flex-col sm:items-end gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  
                  {/* Dynamic Cancel Button (only if not cancelled and not delivered/shipped) */}
                  {order.status !== "cancelled" && order.status !== "delivered" && order.status !== "shipped" && (
                     <button 
                       onClick={() => handleCancelOrder(order._id)}
                       className="text-xs text-rose-600 hover:text-rose-700 underline font-medium"
                     >
                        Cancel Order
                     </button>
                  )}
               </div>
            </div>

            {/* Items */}
            <div className="p-4 md:p-5 divide-y divide-gray-100">
               {order.items.map((item, index) => {
                  const isPopulated = typeof item.product === 'object' && item.product !== null;
                  const productName = isPopulated ? (item.product as any).name : 'Product (Details Unavailable)';
                  
                  return (
                    <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                       <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Package className="h-8 w-8 text-gray-400" />
                       </div>
                       
                       <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{productName}</h4>
                          
                           {/* Variant / Customizations */}
                           {(item.variantId || (item.selectedOptions && item.selectedOptions.length > 0)) && (
                             <div className="mt-1 text-xs text-gray-500">
                               {item.variantId && <span className="block">Variant: {item.variantId}</span>}
                               {item.selectedOptions?.map((opt, i) => (
                                 <span key={i} className="block">{opt.fieldName}: {opt.value}</span>
                               ))}
                             </div>
                           )}
                       </div>
                       
                       <div className="text-right flex flex-col justify-center">
                          <p className="font-semibold text-gray-900">₹{item.price}</p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                       </div>
                    </div>
                  )
               })}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 p-4 md:p-5 border-t border-gray-200 flex justify-between items-center">
               <div className="test-sm text-gray-600">
                  <span className="font-medium mr-2">Payment:</span>
                  <span className="uppercase">{order.paymentMethod}</span>
                  <span className={`ml-2 font-medium ${order.isPaid ? 'text-emerald-600' : 'text-orange-600'}`}>
                     ({order.isPaid ? 'Paid' : 'Unpaid'})
                  </span>
               </div>
               
               <div className="font-semibold text-lg text-gray-900">
                  Total: ₹{order.totalPrice}
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;