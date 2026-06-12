/**
 * designer-portal.api.ts
 * API calls made by the logged-in designer using their own JWT token.
 * These hit the /designers/auth/* and /designers/products/* endpoints.
 */

import api from "@/lib/api/axios";
import type { Designer, DesignerProfilePayload } from "@/types/designer";
import type { Product } from "@/types/product";
// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractDesigner(data: any): Designer | null {
  if (!data) return null;
  if (data.designer) return data.designer;
  if (data.data?.designer) return data.data.designer;
  if (data.data && typeof data.data === "object" && "name" in data.data)
    return data.data;
  return null;
}

function extractList(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  return [];
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const designerLogin = async (credentials: any): Promise<any> => {
  const response = await api.post("/designers/auth/login", credentials);
  return response.data;
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getMyProfile = async (): Promise<Designer | null> => {
  const response = await api.get("/designers/auth/profile");
  return extractDesigner(response.data);
};

export const updateMyProfile = async (
  payload: DesignerProfilePayload
): Promise<Designer | null> => {
  const response = await api.put("/designers/auth/profile", payload);
  return extractDesigner(response.data);
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const getMyProducts = async (): Promise<any[]> => {
  const response = await api.get("/designers/products");
  return extractList(response.data);
};

export const getMyProductById = async (id: string): Promise<any | null> => {
  const response = await api.get(`/designers/products/${id}`);
  const data = response.data;
  if (data?.data) return data.data;
  return data;
};

export const createMyProduct = async (payload: any): Promise<any> => {
  const response = await api.post("/designers/products", payload);
  const data = response.data;
  if (data?.data) return data.data;
  return data;
};

export const updateMyProduct = async (
  id: string,
  payload: any
): Promise<any> => {
  const response = await api.put(`/designers/products/${id}`, payload);
  const data = response.data;
  if (data?.data) return data.data;
  return data;
};

export const deleteMyProduct = async (id: string): Promise<void> => {
  await api.delete(`/designers/products/${id}`);
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getMyDashboardStats = async (): Promise<any> => {
  const response = await api.get("/designers/dashboard/stats");
  const data = response.data;
  if (data?.data) return data.data;
  return data;
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getMyOrders = async (): Promise<any[]> => {
  const response = await api.get("/designers/orders");
  return extractList(response.data);
};
