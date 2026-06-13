export default function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
        >
          <div className="aspect-[4/5] rounded-[22px] bg-gray-200" />
          <div className="mt-4 h-3 w-24 rounded-full bg-gray-200" />
          <div className="mt-3 h-4 rounded-full bg-gray-200" />
          <div className="mt-2 h-4 w-2/3 rounded-full bg-gray-200" />
          <div className="mt-4 h-4 w-20 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
