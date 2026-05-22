"use client";

import { useEffect } from "react";
import api from "@/lib/api/axios";
import { setAccessToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

let authInitPromise: Promise<void> | null = null;

export const useAuthInit = () => {
  const { initialized, setInitialized, setLoading, setUser } = useAuthStore();

  useEffect(() => {
    if (initialized || authInitPromise) {
      return;
    }

    authInitPromise = (async () => {
      try {
        setLoading(true);

        const refreshRes = await api.post("/auth/refresh-token");
        const accessToken = refreshRes.data.data.accessToken;

        setAccessToken(accessToken);

        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        const waitForCartHydration = () =>
          new Promise<void>((resolve) => {
            if (useCartStore.getState().hydrated) {
              resolve();
              return;
            }

            const unsubscribe = useCartStore.subscribe((state) => {
              if (state.hydrated) {
                unsubscribe();
                resolve();
              }
            });
          });

        await waitForCartHydration();
        await useCartStore.getState().ensureServerCartForCheckout();
      } catch {
        console.log("No valid session");
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
        authInitPromise = null;
      }
    })();
  }, [initialized, setInitialized, setLoading, setUser]);
};
