import Link from "next/link";

export default function ProductHeader() {
  return (
    <section className="rounded-[32px] bg-[#12251a] text-white p-6 flex justify-between">
      <div>Product management</div>

      <Link href="/admin/products/create" className="bg-white px-4 py-2 rounded">
        + Add Product
      </Link>
    </section>
  );
}