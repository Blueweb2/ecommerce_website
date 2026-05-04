"use client";

import { Trash2, Plus, Info } from "lucide-react";

type Specification = {
  name: string;
  value: string;
};

type Props = {
  specifications: Specification[];
  setForm: (fn: (prev: any) => any) => void;
};

export default function SpecificationsSection({ specifications, setForm }: Props) {
  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { name: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_: any, i: number) => i !== index),
    }));
  };

  const updateSpec = (index: number, field: keyof Specification, value: string) => {
    setForm((prev) => {
      const updated = [...(prev.specifications || [])];
      updated[index][field] = value;
      return { ...prev, specifications: updated };
    });
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">Technical Specifications</h3>
            <div className="group relative">
              <Info size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                Add dimensions, weight, material, or any other technical details.
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">Input precise measurements and details (e.g., Length: 4cm).</p>
        </div>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"
        >
          <Plus size={16} />
          Add Detail
        </button>
      </div>

      <div className="space-y-3">
        {specifications.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-sm text-slate-400">No specifications added yet.</p>
          </div>
        )}

        {specifications.map((spec, idx) => (
          <div key={idx} className="flex gap-3 group items-center">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  placeholder="e.g. Length"
                  value={spec.name}
                  onChange={(e) => updateSpec(idx, "name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <input
                  placeholder="e.g. 4cm / 1.6in"
                  value={spec.value}
                  onChange={(e) => updateSpec(idx, "value", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-medium text-slate-900"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSpec(idx)}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
