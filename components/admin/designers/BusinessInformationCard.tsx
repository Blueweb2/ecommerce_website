type BusinessInformationCardProps = {
  form: {
    businessName?: string;
    email?: string;
    phone?: string;
    gstNumber?: string;
    website?: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function BusinessInformationCard({
  form,
  setForm,
}: BusinessInformationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Business Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Business and contact details for the brand partner. These details
          help manage communication, invoicing, and future vendor operations.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Business Name */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Business Name
          </label>

          <input
            type="text"
            placeholder="e.g. Studio Mehra Fashion Pvt Ltd"
            value={form.businessName || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                businessName: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Registered business or trading name.
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Business Email
          </label>

          <input
            type="email"
            placeholder="contact@brand.com"
            value={form.email || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Primary contact email for brand communication.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Contact number for order and business coordination.
          </p>
        </div>

        {/* GST Number */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            GST Number
          </label>

          <input
            type="text"
            placeholder="29ABCDE1234F1Z5"
            value={form.gstNumber || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                gstNumber: e.target.value.toUpperCase(),
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 uppercase text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Optional GST registration number.
          </p>
        </div>

        {/* Website */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Website
          </label>

          <input
            type="url"
            placeholder="https://www.brand.com"
            value={form.website || ""}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                website: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          <p className="mt-1 text-xs text-slate-500">
            Official website or portfolio URL.
          </p>
        </div>
      </div>
    </div>
  );
}