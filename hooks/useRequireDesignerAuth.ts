"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDesignerAuthStore } from "@/store/designer/useDesignerAuthStore";

export const useRequireDesignerAuth = () => {
  const { designer, loading, initialized, hydrateDesigner } = useDesignerAuthStore();
  const router = useRouter();

  // Hydrate designer store on mount if not already done
  useEffect(() => {
    if (!initialized) {
      hydrateDesigner();
    }
  }, [initialized, hydrateDesigner]);

  useEffect(() => {
    if (loading || !initialized) return;

    if (!designer) {
      router.replace("/designer/login");
      return;
    }

    if (designer.role && designer.role !== "designer") {
      router.replace("/designer/login");
    }
  }, [designer, loading, initialized, router]);

  return { designer, loading: loading || !initialized };
};
