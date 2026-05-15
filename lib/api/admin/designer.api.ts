import api from "@/lib/api/axios";
import { normalizeDesigner, normalizeDesigners } from "@/lib/api/designer.api";
import type {
  DesignerDetailResponse,
  DesignerListResponse,
  DesignerPayload,
} from "@/types/designer";

function getStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return undefined;
}

async function requestWithFallback<T>(
  method: "get" | "put" | "delete",
  endpoints: string[],
  data?: unknown
) {
  for (const endpoint of endpoints) {
    try {
      return await api.request<T>({
        method,
        url: endpoint,
        data,
      });
    } catch (error) {
      if (getStatusCode(error) !== 404) {
        throw error;
      }
    }
  }

  throw new Error(`Designer API route not found. Tried: ${endpoints.join(", ")}`);
}

export const getDesigners = async () => {
  const response = await requestWithFallback<DesignerListResponse>("get", [
    "/designers/admin",
    "/designers",
  ]);

  return normalizeDesigners(response.data);
};

export const getDesignerById = async (id: string) => {
  const response = await requestWithFallback<DesignerDetailResponse>("get", [
    `/designers/admin/${id}`,
    `/designers/${id}`,
  ]);

  return normalizeDesigner(response.data);
};

export const createDesigner = async (data: DesignerPayload) => {
  const response = await api.post<DesignerDetailResponse>("/designers", data);
  return normalizeDesigner(response.data);
};

export const updateDesigner = async (id: string, data: DesignerPayload) => {
  const response = await requestWithFallback<DesignerDetailResponse>("put", [
    `/designers/${id}`,
    `/designers/admin/${id}`,
  ], data);

  return normalizeDesigner(response.data);
};

export const deleteDesigner = async (id: string) => {
  await requestWithFallback("delete", [
    `/designers/${id}`,
    `/designers/admin/${id}`,
  ]);
};

export const getDesignerBySlug = async (slug: string) => {
  const response = await api.get(`/designers/slug/${slug}`);

  return normalizeDesigner(response.data);
};
