"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/user/cart/useCartStore";

export const useCartPersistence = () => {
  const { items, setCart } = useCartStore();

  // load
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, [setCart]);

  // save
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
};