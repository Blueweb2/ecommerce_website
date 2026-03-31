"use client";

import { useEffect } from "react";
import api from "@/lib/api/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";

export const useAuthInit = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");

      // ❌ No token → skip API
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [setUser, setLoading]);
};