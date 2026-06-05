export default function GuidelinesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Guidelines
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Best practices for creating professional designer and brand profiles.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Brand Information */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Brand Information
          </h3>

          <ul className="space-y-1 text-xs leading-5 text-slate-600">
            <li>• Use the official designer or brand name.</li>
            <li>• Keep descriptions informative and concise.</li>
            <li>• Avoid duplicate brand profiles.</li>
            <li>• Ensure brand names match product branding.</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Category Assignment
          </h3>

          <ul className="space-y-1 text-xs leading-5 text-slate-600">
            <li>• Assign only relevant product categories.</li>
            <li>• Categories determine product eligibility.</li>
            <li>• Avoid assigning unnecessary categories.</li>
          </ul>
        </div>

        {/* Images */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Media Assets
          </h3>

          <ul className="space-y-1 text-xs leading-5 text-slate-600">
            <li>• Avatar should be square and high quality.</li>
            <li>• Brand logo should be clean and recognizable.</li>
            <li>• Banner images should be wide format.</li>
            <li>• Avoid blurry or watermarked images.</li>
          </ul>
        </div>

        {/* Visibility */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Storefront Visibility
          </h3>

          <ul className="space-y-1 text-xs leading-5 text-slate-600">
            <li>• Featured brands receive higher visibility.</li>
            <li>• Homepage brands appear in discovery sections.</li>
            <li>• Inactive brands are hidden from customers.</li>
          </ul>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h4 className="mb-1 text-sm font-medium text-amber-900">
          Important
        </h4>

        <p className="text-xs leading-5 text-amber-700">
          Since designers act as vendors in the platform, ensure business
          details, categories, and branding assets are reviewed before making
          the profile active.
        </p>
      </div>

      {/* Quick Checklist */}
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-emerald-900">
          Publishing Checklist
        </h4>

        <div className="space-y-2 text-xs text-emerald-700">
          <div>✓ Brand Name Added</div>
          <div>✓ Description Added</div>
          <div>✓ Business Details Added</div>
          <div>✓ Categories Assigned</div>
          <div>✓ Logo Uploaded</div>
          <div>✓ Banner Uploaded</div>
          <div>✓ Brand Activated</div>
        </div>
      </div>
    </div>
  );
}