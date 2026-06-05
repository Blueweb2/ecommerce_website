"use client";

import { useSyncExternalStore } from "react";
import { clearAccessToken, setAccessToken } from "@/lib/auth";

type RecordValue = Record<string, unknown>;

export type VendorSessionPreview = {
  token: string | null;
  id?: string;
  email?: string;
  slug?: string;
  name?: string;
  brandName?: string;
};

const EMPTY_VENDOR_SESSION_PREVIEW: VendorSessionPreview = {
  token: null,
};

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function decodeJwtPayload(token: string) {
  const segments = token.split(".");

  if (segments.length < 2) {
    return null;
  }

  try {
    const normalized = segments[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segments[1].length / 4) * 4, "=");

    const decoded =
      typeof window !== "undefined"
        ? window.atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf8");

    return JSON.parse(decoded) as RecordValue;
  } catch {
    return null;
  }
}

function getDesignerObject(payload: RecordValue | null) {
  if (!payload) {
    return null;
  }

  if (isRecord(payload.designer)) {
    return payload.designer;
  }

  if (isRecord(payload.user)) {
    return payload.user;
  }

  return payload;
}

export function getVendorToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("designerToken") ||
    localStorage.getItem("accessToken")
  );
}

export function getVendorSessionPreview(): VendorSessionPreview {
  const token = getVendorToken();
  const payload = token ? decodeJwtPayload(token) : null;
  const subject = getDesignerObject(payload);

  return {
    token,
    id:
      readString(subject?._id) ||
      readString(subject?.designerId) ||
      readString(subject?.id) ||
      readString(subject?.sub),
    email: readString(subject?.email),
    slug: readString(subject?.slug),
    name: readString(subject?.name),
    brandName: readString(subject?.brandName),
  };
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}

export function useVendorSessionPreview() {
  return useSyncExternalStore(
    subscribe,
    getVendorSessionPreview,
    () => EMPTY_VENDOR_SESSION_PREVIEW
  );
}

export function persistVendorToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("designerToken", token);
  setAccessToken(token);
}

export function clearVendorSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("designerToken");
  clearAccessToken();
}
