export default function ProductStats({ total, published }: { total: number; published: number }) {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div>Total: {total}</div>
      <div>Published: {published}</div>
    </section>
  );
}