"use client";

import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Link href="/admin/products/create">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Table will come next */}
      <div className="p-6 bg-white rounded shadow">
        Product table coming next...
      </div>
    </div>
  );
}
