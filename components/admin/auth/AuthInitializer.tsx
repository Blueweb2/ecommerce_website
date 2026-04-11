"use client";


// this is not using anymore, moved to Providers.tsx
import { useEffect } from "react";
import api from "@/lib/api/axios";
import { setAccessToken } from "@/lib/auth";

export default function AuthInitializer() {
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh-token");

        setAccessToken(res.data.accessToken);

        console.log("✅ Access token restored");
      } catch (err) {
        console.log("❌ No valid session");
      }
    };

    initAuth();
  }, []);

  return null;
}