import Link from "next/link";

export default function ProductHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Product Management</h1>
          <p className="text-blue-100">Manage your product catalog, inventory, and pricing</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products/create"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
}