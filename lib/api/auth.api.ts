import api from "./axios";

export const authApi = {
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.patch("/auth/update-profile", data),

  changePassword: (data: { oldPassword?: string; newPassword?: string }) =>
    api.patch("/auth/change-password", data),

  requestEmailChange: (newEmail: string) =>
    api.post("/auth/request-email-change", { newEmail }),

  verifyEmailChange: (data: { newEmail: string; otp: string }) =>
    api.post("/auth/verify-email-change", data),

  getMe: () => api.get("/auth/me"),
};
