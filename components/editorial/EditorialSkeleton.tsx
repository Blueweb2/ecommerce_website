export default function EditorialSkeleton({ category = false }: { category?: boolean }) {
  return <div className="animate-pulse space-y-14"><div className="h-[50vw] max-h-[620px] bg-stone-100" />{category ? null : <div className="h-10 w-56 bg-stone-100" />}<div className="grid grid-cols-1 gap-7 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="space-y-4"><div className="aspect-[4/5] bg-stone-100" /><div className="h-3 w-1/3 bg-stone-100" /><div className="h-7 w-5/6 bg-stone-100" /></div>)}</div></div>;
}
