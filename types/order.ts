// types/order.ts

export interface OrderSelectedOption {
  fieldName: string;
  value: string;
}

export interface OrderItem {
  product:
  | string // If just the ID
  | {
    // If populated
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  price: number;
  variantId?: string;
  selectedOptions?: OrderSelectedOption[];
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id: string;
  user: string | OrderUser; // String ID or populated User object
  items: OrderItem[];
  totalPrice: number;
  totalQuantity: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "success" | "failed";
  refundStatus: "none" | "requested" | "approved" | "rejected";
  isPaid: boolean;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
