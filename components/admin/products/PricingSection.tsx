"use client";

import { Info, Tag, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    form: any;
    setForm: (updater: any) => void;
    errors: Record<string, string>;
    saleType: "percentage" | "fixed";
    setSaleType: (type: "percentage" | "fixed") => void;
};

export default function PricingSection({
    form,
    setForm,
    errors,
    saleType,
    setSaleType,
}: Props) {
    const [discountPercent, setDiscountPercent] = useState<number | "">("");

    // Auto-calculate discount price if percentage changes
    useEffect(() => {
        if (saleType === "percentage" && discountPercent !== "" && form.price > 0) {
            const calculated = Math.round(
                form.price - (form.price * Number(discountPercent)) / 100
            );
            setForm((prev: any) => ({ ...prev, discountPrice: calculated }));
        }
    }, [discountPercent, form.price, saleType, setForm]);

    // Sync discountPercent if discountPrice changes manually in fixed mode
    useEffect(() => {
        if (form.price > 0 && form.discountPrice > 0 && form.discountPrice < form.price) {
            const pct = Math.round(((form.price - form.discountPrice) / form.price) * 100);
            if (saleType === 'fixed') {
                setDiscountPercent(pct);
            }
        } else if (!form.discountPrice) {
            setDiscountPercent("");
        }
    }, [form.discountPrice, form.price, saleType]);

    const hasVariants = form.variants?.length > 0;

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* INFO ALERT */}
            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm">
                <Info className="h-5 w-5 shrink-0" />
                <p>
                    Configure the base pricing and sale offers. {hasVariants ? "Individual variant prices can be adjusted in the 'Attributes & Variants' step." : ""}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* BASE PRICE */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                    <label className="text-lg font-bold text-slate-800">Base Price</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={form.price}
                            onChange={(e) => setForm((prev: any) => ({ ...prev, price: e.target.value }))}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-2xl font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all"
                        />
                    </div>
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                {/* SALE TOGGLE CARD */}
                <div className={`rounded-3xl border-2 p-8 transition-all ${form.isOnSale
                        ? "border-amber-200 bg-amber-50/30"
                        : "border-slate-100 bg-slate-50/50 grayscale opacity-60"
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Tag className={`h-6 w-6 ${form.isOnSale ? "text-amber-600" : "text-slate-400"}`} />
                            <span className="text-lg font-bold text-slate-800">On Sale</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm((prev: any) => ({ ...prev, isOnSale: !prev.isOnSale }))}
                            className={`relative h-7 w-12 rounded-full transition-colors ${form.isOnSale ? "bg-amber-500" : "bg-slate-300"
                                }`}
                        >
                            <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all shadow-md ${form.isOnSale ? "left-6" : "left-1"
                                }`} />
                        </button>
                    </div>

                    {form.isOnSale && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-200">
                            {/* SALE TYPE SELECTOR */}
                            <div className="flex p-1 bg-white border border-amber-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setSaleType("percentage")}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${saleType === "percentage" ? "bg-amber-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    Percentage (%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSaleType("fixed")}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${saleType === "fixed" ? "bg-amber-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    Fixed Price
                                </button>
                            </div>

                            {/* SALE INPUTS */}
                            {saleType === "percentage" ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-amber-800 uppercase tracking-wider">Discount Percentage</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="20"
                                            value={discountPercent}
                                            onChange={(e) => setDiscountPercent(Number(e.target.value) || "")}
                                            className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl text-xl font-bold focus:border-amber-500 outline-none transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-amber-800 uppercase tracking-wider">New Sale Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            placeholder="800"
                                            value={form.discountPrice}
                                            onChange={(e) => setForm((prev: any) => ({ ...prev, discountPrice: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-amber-200 rounded-xl text-xl font-bold focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* VISUAL PREVIEW */}
                            {form.price > 0 && form.discountPrice > 0 && (
                                <div className="flex items-center gap-3 p-4 bg-white border border-amber-100 rounded-2xl shadow-sm">
                                    <span className="text-sm text-slate-400 line-through font-medium">₹{form.price}</span>
                                    <span className="text-xl font-black text-amber-600">₹{form.discountPrice}</span>
                                    <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-lg uppercase">
                                        {Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* GST PERCENTAGE */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                    <label className="text-lg font-bold text-slate-800">GST Slab (%)</label>
                    <div className="relative">
                        <select
                            value={form.gstPercentage || 0}
                            onChange={(e) => setForm((prev: any) => ({ ...prev, gstPercentage: Number(e.target.value) }))}
                            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xl font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value={0}>0% (Exempted)</option>
                            <option value={5}>5% (Essential Items)</option>
                            <option value={12}>12% (Standard)</option>
                            <option value={18}>18% (Standard Plus)</option>
                            <option value={28}>28% (Luxury/De-merit)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <ChevronDown size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">Select the government-defined tax slab for this category.</p>
                </div>

            </div>
        </section>
    );
}
