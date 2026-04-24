import { useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { getPrimaryProductImage, getProductImageUrl } from "@/lib/constants/admin-catalog";

export default function ProductList({
  products,
  loading,
  categories,
  onDelete,
  onDeleteImage,
}: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'created'>('created');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or add some products to get started.</p>
        <Link
          href="/admin/products/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Your First Product
        </Link>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case 'stock':
        return b.stock - a.stock;
      case 'created':
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price: Low to High</option>
              <option value="stock">Stock: High to Low</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM9 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              categories={categories}
              onDelete={onDelete}
              onDeleteImage={onDeleteImage}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product: any) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Image Gallery */}
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <div className="flex gap-1">
                      {product.images.slice(0, 3).map((image: any, index: number) => (
                        <img
                          key={image._id || index}
                          src={getProductImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          className={`h-12 w-12 object-cover rounded border-2 ${
                            image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        />
                      ))}
                      {product.images.length > 3 && (
                        <div className="h-12 w-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {categories.find((c: any) => c._id === product.category)?.name || 'No Category'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-medium text-gray-900">
                      {product.isOnSale ? `₹${product.discountPrice}` : `₹${product.price}`}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : product.stock <= 5
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    {product.sku && (
                      <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
