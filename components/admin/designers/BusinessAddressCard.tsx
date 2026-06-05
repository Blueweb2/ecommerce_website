type BusinessAddressCardProps = {
  form: {
    address?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      district?: string;
      state?: string;
      country?: string;
      pincode?: string;
    };
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function BusinessAddressCard({
  form,
  setForm,
}: BusinessAddressCardProps) {
  const updateAddress = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Business Address
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Registered business address and operational location of the brand
          partner.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address Line 1
          </label>

          <input
            type="text"
            placeholder="Building name, street address"
            value={form.address?.addressLine1 || ""}
            onChange={(e) =>
              updateAddress("addressLine1", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address Line 2
          </label>

          <input
            type="text"
            placeholder="Area, locality, landmark"
            value={form.address?.addressLine2 || ""}
            onChange={(e) =>
              updateAddress("addressLine2", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            City
          </label>

          <input
            type="text"
            placeholder="Manjeri"
            value={form.address?.city || ""}
            onChange={(e) =>
              updateAddress("city", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* District */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            District
          </label>

          <input
            type="text"
            placeholder="Malappuram"
            value={form.address?.district || ""}
            onChange={(e) =>
              updateAddress("district", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            State
          </label>

          <input
            type="text"
            placeholder="Kerala"
            value={form.address?.state || ""}
            onChange={(e) =>
              updateAddress("state", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Country
          </label>

          <input
            type="text"
            placeholder="India"
            value={form.address?.country || ""}
            onChange={(e) =>
              updateAddress("country", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Pincode
          </label>

          <input
            type="text"
            placeholder="676121"
            value={form.address?.pincode || ""}
            onChange={(e) =>
              updateAddress("pincode", e.target.value)
            }
            maxLength={10}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-3">
        <p className="text-xs text-amber-700">
          This address may be used for invoices, business verification,
          logistics coordination, and future vendor operations.
        </p>
      </div>
    </div>
  );
}