"use client";

import { useEffect, useState } from "react";
import { orderAPI } from "@/lib/api/order.api";
import OrderTimeline from "@/components/orders/OrderTimeline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ================= TYPES ================= */

interface OrderItem {
product: {
name: string;
image?: string;
};
quantity: number;
price: number;
}

interface Order {
_id: string;
status: string;
paymentStatus: "pending" | "success" | "failed";
paymentMethod: string;

items: OrderItem[];
totalPrice: number;

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

const canvas = await html2canvas(element);
const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p", "mm", "a4");

const imgWidth = 210;
const pageHeight = 295;
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

pdf.save(`invoice-${order._id}.pdf`);


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
  const res = await orderAPI.retryPayment(order._id);
  const { razorpayOrderId, amount } = res.data.data;

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100,
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

return ( <div
   id="invoice"
   className="max-w-6xl mx-auto p-6 space-y-6 bg-white"
 >
{/* HEADER */} <div className="flex justify-between items-center"> <div> <h1 className="text-2xl font-semibold">
Order #{order._id.slice(-6)} </h1> <p className="text-xs text-gray-400">{order._id}</p> </div>

    <span className="text-sm text-gray-500">
      {new Date(order.createdAt).toLocaleDateString()}
    </span>
  </div>

  {/* STATUS */}
  <div className="border rounded-xl p-5 shadow-sm">
    <h2 className="font-medium mb-4">Order Status</h2>
    <OrderTimeline status={order.status} />
  </div>

  <div className="grid md:grid-cols-3 gap-6">

    {/* LEFT */}
    <div className="md:col-span-2 space-y-6">

      {/* ITEMS */}
      <div className="border rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Items</h2>

        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 border-b pb-4 last:border-none">
            <img
              src={item.product?.image || "/placeholder.png"}
              alt={item.product?.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-medium">
                {item.product?.name || "Product"}
              </p>

              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>

              <p className="text-sm text-gray-500">
                ₹{item.price}
              </p>
            </div>

            <div className="font-semibold">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="border rounded-xl p-5 shadow-sm">
        <h2 className="font-medium mb-3">Shipping Address</h2>

        <p className="text-sm">{order.shippingAddress.street}</p>
        <p className="text-sm">
          {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
        <p className="text-sm">{order.shippingAddress.postalCode}</p>
        <p className="text-sm">{order.shippingAddress.country}</p>
      </div>
    </div>

    {/* RIGHT */}
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="border rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="font-medium">Order Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{order.totalPrice}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>Free</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>

        {/* CANCEL */}
        {order.status === "pending" &&
          order.paymentStatus !== "success" && (
            <button
              onClick={handleCancel}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Cancel Order
            </button>
          )}

        {/* RETRY PAYMENT */}
        {order.paymentMethod === "razorpay" &&
          order.paymentStatus !== "success" && (
            <button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Retry Payment
            </button>
          )}

        {/* DOWNLOAD */}
        <button
          onClick={downloadInvoice}
          className="w-full bg-black text-white py-2 rounded"
        >
          Download Invoice
        </button>
      </div>

      {/* PAYMENT */}
      <div className="border rounded-xl p-5 shadow-sm">
        <h2 className="font-medium mb-3">Payment</h2>

        <p className="text-sm">
          Method: {order.paymentMethod.toUpperCase()}
        </p>

        <p className="text-sm">
          Status:{" "}
          <span
            className={`font-medium ${
              order.paymentStatus === "success"
                ? "text-green-600"
                : order.paymentStatus === "failed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {order.paymentStatus === "success"
              ? "Paid"
              : order.paymentStatus === "failed"
              ? "Failed"
              : "Pending"}
          </span>
        </p>
      </div>
    </div>
  </div>
</div>


);
}
