// app/vendor/dashboard/page.tsx

export default function DesignerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Products" value="120" />
        <StatCard title="Orders" value="58" />
        <StatCard title="Revenue" value="₹42,000" />
        <StatCard title="Customers" value="89" />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}