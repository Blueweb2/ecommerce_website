"use client";

import { useAuthInit } from "@/hooks/useAuthInit";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInit();

  return <>{children}</>;
}