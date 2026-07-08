"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ShoppingBag,
  CreditCard,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { getMyOrderById } from "@/lib/api/designer/designer-portal.api";
import { getOrderTotals } from "@/lib/utils/orderTotals";
import toast from "react-hot-toast";

export default function DesignerOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getMyOrderById(id);
      if (data) {
        setOrder(data);
      } else {
        toast.error("Order not found");
      }
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-slate-500">
        <p>Order not found</p>
        <Link
          href="/designer/orders"
          className="mt-4 inline-block text-emerald-600 hover:underline"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  // Calculate pricing based on the filtered items (only designer's items)
  // getOrderTotals works on the order object provided
  const pricing = getOrderTotals(order);

  return (
    <div className="space-y-6 pb-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/designer/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${order.status === "delivered"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "cancelled"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-blue-100 text-blue-800"
                }`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                Order Items ({order.items.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item: any, index: number) => {
                const isPopulated =
                  typeof item.product === "object" && item.product !== null;
                const productName = isPopulated
                  ? (item.product as { name?: string }).name
                  : "Product Data Missing";

                return (
                  <div key={index} className="flex gap-4 p-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      <ShoppingBag className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-semibold text-slate-900">{productName}</h3>

                      {(item.variantId ||
                        (item.selectedOptions && item.selectedOptions.length > 0)) && (
                          <div className="mt-1 text-xs text-slate-500">
                            {item.variantId && (
                              <span className="block">Variant: {item.variantId}</span>
                            )}
                            {item.selectedOptions?.map((opt: any, i: number) => (
                              <span key={i} className="block">
                                {opt.fieldName}: {opt.value}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold text-slate-900">
                          ₹{item.price * item.quantity} (₹{item.price} each)
                          {item.gstPercentage ? ` · GST ${item.gstPercentage}%` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 rounded-b-[24px] border-t border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>₹{pricing.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>GST</span>
                <span>₹{pricing.totalGstAmount}</span>
              </div>
              {(order.shippingCharge ?? 0) > 0 && (
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>₹{order.shippingCharge}</span>
                </div>
              )}
              {(order.discountAmount ?? 0) > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-700">
                  <span>Discount {order.promoCode?.code ? `(${order.promoCode.code})` : ""}</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="font-semibold text-slate-700">Amount payable</span>
                <span className="text-xl font-bold text-slate-900">
                  ₹{pricing.grandTotal}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              <User className="h-5 w-5 text-emerald-600" />
              Customer Details
            </h2>
            {order.isGuestOrder ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Type:</span>{" "}
                  <span className="px-2 py-0.5 bg-gray-200 text-xs rounded-full text-gray-700">Guest</span>
                </p>
                <p>
                  <span className="font-medium text-slate-800">Guest Email:</span>{" "}
                  {order.guestEmail}
                </p>
              </div>
            ) : order.user && typeof order.user !== "string" ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Type:</span>{" "}
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Registered User</span>
                </p>
                <p>
                  <span className="font-medium text-slate-800">Name:</span>{" "}
                  {order.user.name}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Email:</span>{" "}
                  {order.user.email}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Customer details unavailable</p>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="space-y-1 text-sm text-slate-600">
                {order.shippingAddress.firstName && (
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                )}
                {order.shippingAddress.phone && (
                  <p>{order.shippingAddress.phone}</p>
                )}
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No address provided</p>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Payment Information
            </h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex justify-between">
                <span className="font-medium text-slate-800">Method:</span>
                <span className="uppercase">{order.paymentMethod}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-slate-800">Status:</span>
                <span
                  className={`font-semibold ${order.isPaid ? "text-emerald-600" : "text-rose-600"
                    }`}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
