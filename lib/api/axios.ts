import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

// ✅ Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 AUTO REFRESH LOGIC
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔴 If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔥 Call refresh token API
        const res = await api.post("/auth/refresh-token");

        const newToken = res.data.data.accessToken;

        setAccessToken(newToken); // store new token

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest); // retry original request

      } catch (err) {
        processQueue(err, null);

        clearAccessToken();

        // 🚪 logout user if refresh fails
        window.location.href = "/admin/login";

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;