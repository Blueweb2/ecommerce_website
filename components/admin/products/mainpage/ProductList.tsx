import ProductCard from "./ProductCard";

export default function ProductList({
  products,
  loading,
  categories,
  onDelete,
  onDeleteImage,
}: any) {
  if (loading) return <div>Loading...</div>;
  if (!products.length) return <div>No products</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product: any) => (
        <ProductCard
          key={product._id}
          product={product}
          categories={categories}
          onDelete={onDelete}
          onDeleteImage={onDeleteImage}
        />
      ))}
    </div>
  );
}