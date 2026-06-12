import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth";

type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isDesignerUrl(url?: string) {
  return (
    url?.startsWith("/designer/") ||
    url?.startsWith("/designers/")
  );
}

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach the correct token based on the endpoint being called.

api.interceptors.request.use((config) => {
  if (isDesignerUrl(config.url)) {
    // Designer endpoints: use the isolated designerToken
    if (typeof window !== "undefined") {
      const designerToken = localStorage.getItem("designerToken");
      if (designerToken) {
        config.headers.Authorization = `Bearer ${designerToken}`;
      }
    }
    return config; // Early return to completely isolate designer tokens
  }

  // Customer / Admin endpoints: use the standard accessToken
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────

let isRefreshingCustomer = false;
let customerFailedQueue: FailedQueueItem[] = [];

let isRefreshingDesigner = false;
let designerFailedQueue: FailedQueueItem[] = [];

function processQueue(
  queue: FailedQueueItem[],
  error: unknown,
  token: string | null = null
) {
  queue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });
  queue.length = 0;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // ── Designer 401 path ──────────────────────────────────────────────────
    if (isDesignerUrl(originalRequest.url)) {
      if (isRefreshingDesigner) {
        return new Promise<string | null>((resolve, reject) => {
          designerFailedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshingDesigner = true;

      try {
        // Call the DESIGNER-SPECIFIC refresh endpoint
        const res = await api.post("/designers/auth/refresh-token");
        const newToken = res.data.data.accessToken;

        // Persist the new designerToken
        if (typeof window !== "undefined") {
          localStorage.setItem("designerToken", newToken);
        }

        processQueue(designerFailedQueue, null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(designerFailedQueue, refreshError, null);

        // Clear designer session and redirect to designer login
        if (typeof window !== "undefined") {
          localStorage.removeItem("designerToken");
          localStorage.removeItem("designer");
          if (!window.location.pathname.includes("/designer/login")) {
            window.location.href = "/designer/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshingDesigner = false;
      }
    }

    // ── Customer / Admin 401 path ──────────────────────────────────────────
    if (isRefreshingCustomer) {
      return new Promise<string | null>((resolve, reject) => {
        customerFailedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshingCustomer = true;

    try {
      const response = await api.post("/auth/refresh-token");
      const newToken = response.data.data.accessToken;

      setAccessToken(newToken);
      processQueue(customerFailedQueue, null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(customerFailedQueue, refreshError, null);
      clearAccessToken();

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (
          currentPath.startsWith("/admin") &&
          !currentPath.includes("/admin/login")
        ) {
          window.location.href = "/admin/login";
        } else if (currentPath.startsWith("/designer")) {
          // Do not redirect designer routes to customer login.
          // Designer route guards handle unauthenticated designer states.
        } else if (!currentPath.includes("/login")) {
          window.location.href = "/account/login";
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshingCustomer = false;
    }
  }
);

export default api;
