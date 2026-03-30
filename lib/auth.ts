// lib/auth.ts

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
};