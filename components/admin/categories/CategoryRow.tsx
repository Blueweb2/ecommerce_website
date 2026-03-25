"use client";

import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";

type Props = {
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
  onDelete: (id: string) => void;
};

export default function CategoryRow({ category, onDelete }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      {/* Name */}
      <td className="p-3 font-medium">{category.name}</td>

      {/* Slug */}
      <td className="p-3 text-gray-600">{category.slug}</td>

      {/* Status */}
      <td className="p-3">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            category.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {category.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="p-3 flex items-center gap-3">
        {/* Edit */}
        <Link
          href={`/admin/categories/${category._id}/edit`}
          className="text-blue-600 hover:text-blue-800"
        >
          <Pencil size={18} />
        </Link>

        {/* Delete */}
        <button
          onClick={() => onDelete(category._id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
