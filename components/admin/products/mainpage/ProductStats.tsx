import { useMemo } from "react";
import {
  AlertTriangle,
  ArchiveX,
  CheckCircle2,
  FileText,
  Package,
  Tag,
} from "lucide-react";

interface ProductStatsProps {
  products: Array<{
    isPublished?: boolean;
    isOnSale?: boolean;
    stock?: number;
  }>;
}

export default function ProductStats({
  products,
}: ProductStatsProps) {
  const stats = useMemo(() => {
    const total = products.length;
    const published = products.filter((product) => product.isPublished).length;
    const draft = total - published;
    const onSale = products.filter((product) => product.isOnSale).length;
    const outOfStock = products.filter(
      (product) => (product.stock ?? 0) === 0
    ).length;
    const lowStock = products.filter((product) => {
      const stock = product.stock ?? 0;
      return stock > 0 && stock <= 5;
    }).length;

    return {
      total,
      published,
      draft,
      onSale,
      outOfStock,
      lowStock,
    };
  }, [products]);

  const statCards = [
    {
      title: "Total Products",
      value: stats.total,
      icon: <Package size={22} />,
    },
    {
      title: "Published",
      value: stats.published,
      icon: <CheckCircle2 size={22} />,
    },
    {
      title: "Draft",
      value: stats.draft,
      icon: <FileText size={22} />,
    },
    {
      title: "On Sale",
      value: stats.onSale,
      icon: <Tag size={22} />,
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: <ArchiveX size={22} />,
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: <AlertTriangle size={22} />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {statCards.map((card) => (
        <div
          key={card.title}
          className="group rounded-[28px] border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="rounded-2xl bg-[#f6f1ea] p-3 text-[#171717] transition group-hover:bg-black group-hover:text-white">
              {card.icon}
            </div>

            <h2 className="font-brand-display text-4xl text-[#171717]">
              {card.value}
            </h2>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
            {card.title}
          </p>
        </div>
      ))}
    </div>
  );
}
