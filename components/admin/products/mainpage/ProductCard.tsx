import { getPrimaryProductImage, getProductImageUrl } from "@/lib/constants/admin-catalog";

export default function ProductCard({
  product,
  categories,
  onDelete,
  onDeleteImage,
}: any) {

  const primaryImage = getPrimaryProductImage(product.images);
  const imageUrl = getProductImageUrl(primaryImage);

  return (
    <div className="border rounded-xl p-4">

      {/* Image */}
      <div className="relative">
        {product.isOnSale && (
          <span className="absolute bg-red-500 text-white text-xs px-2">
            SALE
          </span>
        )}

        <img src={imageUrl} className="h-28 w-28 object-cover" />
      </div>

      {/* Name */}
      <h3>{product.name}</h3>

      {/* Price */}
      {product.isOnSale ? (
        <>
          <span className="text-red-500">₹{product.discountPrice}</span>
          <span className="line-through">₹{product.price}</span>
        </>
      ) : (
        <span>₹{product.price}</span>
      )}

      {/* Actions */}
      <button onClick={() => onDelete(product._id)}>Delete</button>
    </div>
  );
}