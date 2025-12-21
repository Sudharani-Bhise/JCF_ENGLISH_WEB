export default function PageSkeleton() {
  return (
    <div className="animate-pulse px-6 md:px-20 py-24 space-y-10">
      
      {/* Navbar skeleton */}
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 bg-gray-300 rounded-md"
          />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-gray-300 rounded-xl"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}