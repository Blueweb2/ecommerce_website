import { getPrimaryProductImage, getProductImageUrl } from "@/lib/constants/admin-catalog";
import Link from "next/link";

export default function ProductCard({
  product,
  categories,
  onDelete,
  onDeleteImage,
}: any) {

  const primaryImage = getPrimaryProductImage(product.images);
  const imageUrl = getProductImageUrl(primaryImage);

  const categoryName = categories.find((c: any) => c._id === product.category)?.name || 'No Category';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">

      {/* Image */}
      <div className="relative mb-3">
        {product.isOnSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
            SALE
          </span>
        )}
        {!product.isPublished && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
            DRAFT
          </span>
        )}

        <img
          src={imageUrl}
          alt={product.name}
          className="h-32 w-full object-cover rounded-lg"
        />

        {/* Image Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-1 mt-2 overflow-x-auto">
            {product.images.slice(0, 4).map((image: any, index: number) => (
              <img
                key={image._id || index}
                src={getProductImageUrl(image)}
                alt={`${product.name} ${index + 1}`}
                className={`h-8 w-8 object-cover rounded border-2 ${
                  image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                } flex-shrink-0`}
              />
            ))}
            {product.images.length > 4 && (
              <div className="h-8 w-8 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                +{product.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

        <p className="text-sm text-gray-600">{categoryName}</p>

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.isOnSale ? (
            <>
              <span className="text-lg font-bold text-red-600">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          )}
        </div>

        {/* Status & GST */}
        <div className="flex items-center justify-between text-sm">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            product.stock === 0
              ? 'bg-red-100 text-red-800'
              : product.stock <= 5
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Low: ${product.stock}` : `In Stock: ${product.stock}`}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
            GST: {product.gstPercentage || 0}%
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
