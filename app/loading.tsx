export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#c9a96e] rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm text-gray-500 tracking-wide">
          Loading...
        </p>

      </div>
    </div>
  );
}