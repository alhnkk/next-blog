import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filter/Search Skeleton */}
      <div className="mb-8 flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Blog Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            {/* Featured Image */}
            <Skeleton className="w-full h-48 rounded" />
            
            {/* Category Badge */}
            <Skeleton className="h-5 w-20 rounded-full" />
            
            {/* Title */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            
            {/* Excerpt */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Author and Date */}
            <div className="flex items-center gap-3 pt-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-12 gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}