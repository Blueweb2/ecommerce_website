"use client";

import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function DesignerProductsPage() {
  const products = [
    {
      _id: "1",
      name: "Modern Sofa",
      category: "Furniture",
      price: 25000,
      stock: 12,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    },
    {
      _id: "2",
      name: "Luxury Chair",
      category: "Furniture",
      price: 8500,
      stock: 5,
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage products listed under your brand.
          </p>
        </div>

        <Link
          href="/designer/products/create"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5">
          <Package className="mb-2 h-8 w-8 text-slate-700" />
          <p className="text-sm text-slate-500">Total Products</p>
          <h2 className="text-2xl font-bold">24</h2>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Active Products</p>
          <h2 className="text-2xl font-bold">18</h2>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Out of Stock</p>
          <h2 className="text-2xl font-bold">3</h2>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <p className="text-sm text-slate-500">Inventory Value</p>
          <h2 className="text-2xl font-bold">₹4.5L</h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Product
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Price
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Stock
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-medium text-slate-900">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {product.category}
                  </td>

                  <td className="px-5 py-4">
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {product.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-2 hover:bg-slate-100">
                        <Eye size={18} />
                      </button>

                      <button className="rounded-lg p-2 hover:bg-slate-100">
                        <Pencil size={18} />
                      </button>

                      <button className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}