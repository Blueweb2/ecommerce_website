export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full aspect-[3/4] bg-neutral-200 animate-pulse rounded" />
      <div className="w-3/4 h-4 bg-neutral-200 animate-pulse rounded" />
      <div className="w-1/2 h-4 bg-neutral-200 animate-pulse rounded" />
    </div>
  );
};