import { useMemo } from "react";

interface ProductStatsProps {
  products: any[];
}

export default function ProductStats({ products }: ProductStatsProps) {
  const stats = useMemo(() => {
    const total = products.length;
    const published = products.filter(p => p.isPublished).length;
    const draft = total - published;
    const onSale = products.filter(p => p.isOnSale).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

    return { total, published, draft, onSale, outOfStock, lowStock };
  }, [products]);

  const StatCard = ({ title, value, color = "bg-gray-100", icon }: {
    title: string;
    value: number;
    color?: string;
    icon?: string;
  }) => (
    <div className={`${color} rounded-lg p-4 text-center transition-transform hover:scale-105`}>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{title}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard title="Total Products" value={stats.total} color="bg-blue-100" />
      <StatCard title="Published" value={stats.published} color="bg-green-100" />
      <StatCard title="Draft" value={stats.draft} color="bg-yellow-100" />
      <StatCard title="On Sale" value={stats.onSale} color="bg-red-100" />
      <StatCard title="Out of Stock" value={stats.outOfStock} color="bg-gray-100" />
      <StatCard title="Low Stock (≤5)" value={stats.lowStock} color="bg-orange-100" />
    </div>
  );
}