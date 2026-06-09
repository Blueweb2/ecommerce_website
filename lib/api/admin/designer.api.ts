import api from "@/lib/api/axios";
import { normalizeDesigner, normalizeDesigners } from "@/lib/api/designer.api";
import type {
  AdminCreateDesignerPayload,
  AdminStorefrontPayload,
  Designer,
  DesignerDetailResponse,
  DesignerListResponse,
  DesignerPayload,
} from "@/types/designer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    (error as any).response !== null &&
    "status" in (error as any).response &&
    typeof (error as any).response.status === "number"
  ) {
    return (error as any).response.status;
  }
  return undefined;
}

async function requestWithFallback<T>(
  method: "get" | "put" | "delete" | "post",
  endpoints: string[],
  data?: unknown
) {
  for (const endpoint of endpoints) {
    try {
      return await api.request<T>({ method, url: endpoint, data });
    } catch (error) {
      if (getStatusCode(error) !== 404) throw error;
    }
  }
  throw new Error(`Designer API route not found. Tried: ${endpoints.join(", ")}`);
}

// ─── List ─────────────────────────────────────────────────────────────────────

export const getDesigners = async (params?: {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  verificationStatus?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (typeof params?.isActive === "boolean")
    searchParams.set("isActive", String(params.isActive));
  if (typeof params?.isVerified === "boolean")
    searchParams.set("isVerified", String(params.isVerified));
  if (params?.verificationStatus)
    searchParams.set("verificationStatus", params.verificationStatus);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const url = `/designers/admin${query ? `?${query}` : ""}`;

  const response = await api.get(url);
  const data = response.data;

  // Handle paginated response
  if (data?.designers) {
    return {
      designers: data.designers as Designer[],
      total: data.total ?? data.designers.length,
      page: data.page ?? 1,
      totalPages: data.totalPages ?? 1,
    };
  }
  if (data?.data?.designers) {
    return {
      designers: data.data.designers as Designer[],
      total: data.data.total ?? data.data.designers.length,
      page: data.data.page ?? 1,
      totalPages: data.data.totalPages ?? 1,
    };
  }

  // Fallback to normalizeDesigners
  const list = normalizeDesigners(data as DesignerListResponse);
  return { designers: list, total: list.length, page: 1, totalPages: 1 };
};

// ─── Detail ───────────────────────────────────────────────────────────────────

export const getDesignerById = async (id: string) => {
  const response = await requestWithFallback<DesignerDetailResponse>("get", [
    `/designers/admin/${id}`,
    `/designers/${id}`,
  ]);
  return normalizeDesigner(response.data);
};

// ─── Create (admin — name + email + password only) ────────────────────────────

export const createDesigner = async (data: AdminCreateDesignerPayload) => {
  const response = await api.post<DesignerDetailResponse>("/designers", data);
  return normalizeDesigner(response.data);
};

// ─── Full update (admin) ──────────────────────────────────────────────────────

export const updateDesigner = async (id: string, data: DesignerPayload) => {
  const response = await requestWithFallback<DesignerDetailResponse>(
    "put",
    [`/designers/${id}`, `/designers/admin/${id}`],
    data
  );
  return normalizeDesigner(response.data);
};

// ─── Storefront controls ──────────────────────────────────────────────────────

export const updateDesignerStorefront = async (
  id: string,
  data: AdminStorefrontPayload
) => {
  const response = await api.put<DesignerDetailResponse>(
    `/designers/admin/${id}/storefront`,
    data
  );
  return normalizeDesigner(response.data);
};

// ─── Approval workflow ────────────────────────────────────────────────────────

export const approveDesigner = async (id: string) => {
  const response = await api.put<DesignerDetailResponse>(
    `/designers/admin/${id}/approve`
  );
  return normalizeDesigner(response.data);
};

export const rejectDesigner = async (id: string, reason?: string) => {
  const response = await api.put<DesignerDetailResponse>(
    `/designers/admin/${id}/reject`,
    { reason }
  );
  return normalizeDesigner(response.data);
};

// ─── Reset password ───────────────────────────────────────────────────────────

export const adminResetPassword = async (id: string) => {
  const response = await api.post(`/designers/admin/${id}/reset-password`);
  return response.data;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteDesigner = async (id: string) => {
  await requestWithFallback("delete", [
    `/designers/${id}`,
    `/designers/admin/${id}`,
  ]);
};

// ─── Slug lookup ──────────────────────────────────────────────────────────────

export const getDesignerBySlug = async (slug: string) => {
  const response = await api.get(`/designers/slug/${slug}`);
  return normalizeDesigner(response.data);
};
