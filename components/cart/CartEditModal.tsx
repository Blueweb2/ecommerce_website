"use client";

import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useCartStore } from "@/store/user/cart/useCartStore";

interface Props {
    item: any;
    onClose: () => void;
}

export default function CartEditModal({
    item,
    onClose,
}: Props) {
    const { updateQuantity } = useCartStore();

    const [qty, setQty] = useState(item.quantity);

    const images =
        item.images?.length > 0
            ? item.images
            : [item.image || "/placeholder.png"];

    const [activeImage, setActiveImage] = useState(0);

    const step = item.isFabric ? item.stepQty || 1 : 1;

    const min = item.isFabric
        ? item.minOrderQty || 1
        : 1;

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-10">

            {/* MODAL */}
            <div className="relative w-full max-w-[1180px] bg-white shadow-2xl">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute right-7 top-7 z-20 text-black transition hover:opacity-60"
                >
                    <X size={28} strokeWidth={1.5} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[58%_42%]">

                    {/* LEFT IMAGE */}
                    <div className="relative bg-[#f7f7f5]">

                        {/* ARROWS */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() =>
                                        setActiveImage((prev) =>
                                            prev === 0
                                                ? images.length - 1
                                                : prev - 1
                                        )
                                    }
                                    className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
                                >
                                    <ChevronLeft size={22} />
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveImage((prev) =>
                                            prev === images.length - 1
                                                ? 0
                                                : prev + 1
                                        )
                                    }
                                    className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </>
                        )}

                        {/* IMAGE */}
                        <div className="flex h-full items-center justify-center p-10">
                            <img
                                src={images[activeImage]}
                                alt={item.name}
                                className="h-[760px] w-full object-contain"
                            />
                        </div>

                        {/* DOTS */}
                        {images.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                                {images.map((_: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`h-[6px] w-[6px] rounded-full transition ${activeImage === i
                                                ? "bg-black"
                                                : "bg-[#d0d0d0]"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col px-10 pb-10 pt-14">

                        {/* BRAND */}
                        <h2 className="font-serif text-[54px] uppercase leading-none tracking-[-1.5px] text-black">
                            {item.brand || item.name}
                        </h2>

                        {/* CATEGORY */}
                        <p className="mt-5 text-[13px] uppercase tracking-[4px] text-[#8b8b8b]">
                            Runway
                        </p>

                        {/* PRICE */}
                        <p className="mt-6 text-[40px] font-semibold tracking-[-1px] text-black">
                            ₹{item.price}
                        </p>

                        {/* OPTIONS */}
                        <div className="mt-10">

                            {/* COLOR */}
                            <div className="mb-7">
                                <p className="mb-3 text-[16px] text-[#6e6e6e]">
                                    Color:{" "}
                                    <span className="text-black">
                                        {item.selectedOptions?.find(
                                            (o: any) =>
                                                o.fieldName
                                                    .toLowerCase()
                                                    .includes("color")
                                        )?.value || "Default"}
                                    </span>
                                </p>

                                {/* SIZE + QTY */}
                                <div className="flex items-center gap-6">

                                    {/* SIZE */}
                                    {/* VARIANT OPTIONS */}
                                    {item.selectedOptions &&
                                        item.selectedOptions.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-3">
                                                {item.selectedOptions.map(
                                                    (opt: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="flex h-[54px] min-w-[140px] items-center border border-[#d6d6d6] px-5 text-[16px] text-black"
                                                        >
                                                            {opt.value}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {/* QTY */}
                                    <div className="flex items-center gap-5">

                                        <button
                                            onClick={() =>
                                                setQty(
                                                    Math.max(
                                                        min,
                                                        Number(
                                                            (qty - step).toFixed(2)
                                                        )
                                                    )
                                                )
                                            }
                                            className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-black transition hover:bg-black hover:text-white"
                                        >
                                            <Minus size={18} />
                                        </button>

                                        <span className="min-w-[20px] text-center text-[20px] text-black">
                                            {qty}
                                        </span>

                                        <button
                                            onClick={() =>
                                                setQty(
                                                    Number(
                                                        (qty + step).toFixed(2)
                                                    )
                                                )
                                            }
                                            className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-black transition hover:bg-black hover:text-white"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UPDATE BUTTON */}
                        <button
                            onClick={() => {
                                updateQuantity(item, qty);
                                onClose();
                            }}
                            className="mt-4 h-[58px] w-full bg-black text-[18px] font-medium text-white transition hover:bg-[#1d1d1d]"
                        >
                            Update
                        </button>

                     
                        {/* DETAILS */}
                        <Link
                            href={`/products/${item.slug || item.productId}`}
                            className="mx-auto mt-5 border-b border-black pb-[2px] text-[17px] text-black transition hover:opacity-60"
                        >
                            View more details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}