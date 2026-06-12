"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyProfile,
  getMyProducts,
  getMyOrders,
} from "@/lib/api/designer/designer-portal.api";
import {
  useVendorSessionPreview,
  type VendorSessionPreview,
} from "@/lib/vendor/auth";
import type { Designer } from "@/types/designer";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

type VendorMonthlyPoint = {
  month: string;
  orders: number;
  revenue: number;
};

type VendorStats = {
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
};

type RecentVendorOrder = Order & {
  vendorTotal: number;
};

type TopVendorProduct = Product & {
  totalSold: number;
};

type VendorPortalState = {
  designer: Designer | null;
  identityLabel: string;
  products: Product[];
  orders: Order[];
  recentOrders: RecentVendorOrder[];
  topProducts: TopVendorProduct[];
  monthlySeries: VendorMonthlyPoint[];
  stats: VendorStats;
  loading: boolean;
  error: string | null;
  notice: string | null;
  refresh: () => Promise<void>;
};

const EMPTY_STATS: VendorStats = {
  totalProducts: 0,
  inStockProducts: 0,
  lowStockProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  totalCustomers: 0,
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim().toLowerCase()
    : null;
}

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
  }).format(date);
}

function buildMonthlySeries(orders: RecentVendorOrder[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: formatMonthKey(date),
      month: formatMonthLabel(date),
      orders: 0,
      revenue: 0,
    };
  });

  const lookup = new Map(months.map((entry) => [entry.key, entry]));

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      continue;
    }

    const key = formatMonthKey(createdAt);
    const current = lookup.get(key);

    if (!current) {
      continue;
    }

    current.orders += 1;
    current.revenue += order.vendorTotal;
  }

  return months;
}

function matchDesigner(designer: Designer, preview: VendorSessionPreview) {
  const previewId = readString(preview.id);
  const previewEmail = readString(preview.email);
  const previewSlug = readString(preview.slug);
  const previewName = readString(preview.name);
  const previewBrand = readString(preview.brandName);

  const designerId = readString(designer._id);
  const designerEmail = readString(designer.email);
  const designerSlug = readString(designer.slug);
  const designerName = readString(designer.name);
  const designerBrand = readString(designer.brandName);

  return Boolean(
    (previewId && designerId === previewId) ||
      (previewEmail && designerEmail === previewEmail) ||
      (previewSlug && designerSlug === previewSlug) ||
      (previewName && designerName === previewName) ||
      (previewBrand && designerBrand === previewBrand)
  );
}

function matchesVendorProduct(product: Product, designer: Designer | null) {
  if (!designer) {
    return false;
  }

  const designerId = readString(designer._id);
  const designerName = readString(designer.name);
  const brandName = readString(designer.brandName);

  if (typeof product.designer === "string") {
    const productDesigner = readString(product.designer);

    return Boolean(
      (designerId && productDesigner === designerId) ||
        (designerName && productDesigner === designerName)
    );
  }

  if (product.designer && typeof product.designer === "object") {
    const record = product.designer as Record<string, unknown>;
    const productDesignerId = readString(record._id);
    const productDesignerName =
      readString(record.name) || readString(record.brandName);

    return Boolean(
      (designerId && productDesignerId === designerId) ||
        (designerName && productDesignerName === designerName) ||
        (brandName && productDesignerName === brandName)
    );
  }

  const productBrand = readString(product.brand);
  return Boolean(brandName && productBrand === brandName);
}

function getProductId(orderProduct: Order["items"][number]["product"]) {
  if (typeof orderProduct === "string") {
    return orderProduct;
  }

  return orderProduct?._id;
}

function getVendorOrderTotal(order: Order, productIds: Set<string>) {
  return order.items.reduce((sum, item) => {
    const productId = getProductId(item.product);

    if (!productId || !productIds.has(productId)) {
      return sum;
    }

    return sum + item.price * item.quantity + (item.gstAmount || 0);
  }, 0);
}

// loadDesignerDirectory removed

export function useVendorPortalData(): VendorPortalState {
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentVendorOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopVendorProduct[]>([]);
  const [monthlySeries, setMonthlySeries] = useState<VendorMonthlyPoint[]>([]);
  const [stats, setStats] = useState<VendorStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const identity = useVendorSessionPreview();

  const identityLabel =
    identity.brandName || identity.name || identity.email || "your brand";

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const preview = identity;

      const [designerResult, productsResult, ordersResult] =
        await Promise.allSettled([
          getMyProfile(),
          getMyProducts(),
          getMyOrders(),
        ]);

      if (
        designerResult.status === "rejected" &&
        productsResult.status === "rejected" &&
        ordersResult.status === "rejected"
      ) {
        setError(
          "The vendor dashboard could not load data. Please confirm you are logged in."
        );
        setDesigner(null);
        setProducts([]);
        setOrders([]);
        setRecentOrders([]);
        setTopProducts([]);
        setMonthlySeries([]);
        setStats(EMPTY_STATS);
        return;
      }

      const currentDesigner =
        designerResult.status === "fulfilled" ? designerResult.value : null;

      if (!currentDesigner) {
        setNotice(
          "We could not automatically match this login to a designer profile yet, so vendor-specific numbers may stay empty until the account is linked."
        );
      } else if (ordersResult.status === "rejected") {
        setNotice(
          "Products loaded, but order analytics are unavailable for this account right now."
        );
      }

      const vendorProducts =
        productsResult.status === "fulfilled" ? (productsResult.value as Product[]) : [];

      const productIds = new Set(vendorProducts.map((product) => product._id));
      const rawOrders =
        ordersResult.status === "fulfilled" ? (ordersResult.value as Order[]) : [];

      const vendorOrders = rawOrders
        .filter((order) =>
          order.items.some((item) => {
            const productId = getProductId(item.product);
            return Boolean(productId && productIds.has(productId));
          })
        )
        .map((order) => ({
          ...order,
          vendorTotal: getVendorOrderTotal(order, productIds),
        }));

      const customerIds = new Set(
        vendorOrders
          .map((order) =>
            typeof order.user === "object"
              ? order.user?._id
              : order.guestEmail || order.user
          )
          .filter(Boolean)
      );

      const soldCounts = new Map<string, number>();
      for (const order of vendorOrders) {
        for (const item of order.items) {
          const productId = getProductId(item.product);

          if (!productId || !productIds.has(productId)) {
            continue;
          }

          soldCounts.set(productId, (soldCounts.get(productId) || 0) + item.quantity);
        }
      }

      const rankedProducts = vendorProducts
        .map((product) => ({
          ...product,
          totalSold: soldCounts.get(product._id) || 0,
        }))
        .sort((left, right) => right.totalSold - left.totalSold)
        .slice(0, 5);

      const orderedRecent = [...vendorOrders]
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        )
        .slice(0, 6);

      const totalRevenue = vendorOrders.reduce(
        (sum, order) => sum + order.vendorTotal,
        0
      );

      setDesigner(currentDesigner);
      setProducts(vendorProducts);
      setOrders(vendorOrders);
      setRecentOrders(orderedRecent);
      setTopProducts(rankedProducts);
      setMonthlySeries(buildMonthlySeries(vendorOrders));
      setStats({
        totalProducts: vendorProducts.length,
        inStockProducts: vendorProducts.filter((product) => product.stock > 0).length,
        lowStockProducts: vendorProducts.filter((product) => product.stock <= 5).length,
        totalOrders: vendorOrders.length,
        pendingOrders: vendorOrders.filter((order) => order.status === "pending").length,
        deliveredOrders: vendorOrders.filter((order) => order.status === "delivered")
          .length,
        totalRevenue,
        averageOrderValue: vendorOrders.length
          ? totalRevenue / vendorOrders.length
          : 0,
        totalCustomers: customerIds.size,
      });
    } catch (caughtError) {
      console.error(caughtError);
      setError(
        "The vendor dashboard could not load data. Please try again after reconnecting the designer account."
      );
    } finally {
      setLoading(false);
    }
  }, [identity]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    designer,
    identityLabel,
    products,
    orders,
    recentOrders,
    topProducts,
    monthlySeries,
    stats,
    loading,
    error,
    notice,
    refresh,
  };
}
