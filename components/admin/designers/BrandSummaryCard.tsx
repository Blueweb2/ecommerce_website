type BrandSummaryCardProps = {
  form: {
    name?: string;
    brandName?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    categories?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
    isFavorite?: boolean;
  };
};

export default function BrandSummaryCard({
  form,
}: BrandSummaryCardProps) {
  const completionItems = [
    !!form.name,
    !!form.brandName,
    !!form.businessName,
    !!form.email,
    !!form.phone,
    (form.categories?.length ?? 0) > 0,
  ];

  const completed = completionItems.filter(Boolean).length;
  const total = completionItems.length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Brand Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quick overview of the brand partner configuration.
        </p>
      </div>

      {/* Completion */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Profile Completion
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {percentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 space-y-4">
        <SummaryRow
          label="Designer"
          value={form.name || "Not specified"}
        />

        <SummaryRow
          label="Brand"
          value={form.brandName || "Not specified"}
        />

        <SummaryRow
          label="Business"
          value={form.businessName || "Not specified"}
        />

        <SummaryRow
          label="Email"
          value={form.email || "Not specified"}
        />

        <SummaryRow
          label="Phone"
          value={form.phone || "Not specified"}
        />

        <SummaryRow
          label="Categories"
          value={`${form.categories?.length || 0} assigned`}
        />
      </div>

      {/* Status */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="mb-3 text-sm font-medium text-slate-800">
          Current Status
        </h3>

        <div className="flex flex-wrap gap-2">
          {form.isActive ? (
            <Badge color="green">Active</Badge>
          ) : (
            <Badge color="red">Inactive</Badge>
          )}

          {form.isFeatured && (
            <Badge color="amber">Featured</Badge>
          )}

          {form.isFavorite && (
            <Badge color="blue">Homepage</Badge>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
        <h4 className="mb-1 text-sm font-medium text-amber-900">
          Before Publishing
        </h4>

        <ul className="space-y-1 text-xs leading-5 text-amber-700">
          <li>• Upload brand logo and banner image.</li>
          <li>• Assign at least one category.</li>
          <li>• Add business contact details.</li>
          <li>• Enable Active Brand status.</li>
        </ul>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "red" | "amber" | "blue";
}) {
  const styles = {
    green:
      "bg-green-100 text-green-700",
    red:
      "bg-red-100 text-red-700",
    amber:
      "bg-amber-100 text-amber-700",
    blue:
      "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}