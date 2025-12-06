import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative w-full min-h-[85vh] flex items-end">
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 md:pb-24">
          {/* Category Skeleton */}
          <Skeleton className="h-4 w-20 mb-4 bg-white/20" />
          
          {/* Title Skeleton */}
          <Skeleton className="h-14 w-3/4 mb-4 bg-white/20" />
          <Skeleton className="h-14 w-1/2 mb-8 bg-white/20" />
          
          {/* Meta Skeleton */}
          <div className="flex gap-8 mb-6">
            <div>
              <Skeleton className="h-3 w-12 mb-1 bg-white/10" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1 bg-white/10" />
              <Skeleton className="h-4 w-20 bg-white/20" />
            </div>
            <div>
              <Skeleton className="h-3 w-20 mb-1 bg-white/10" />
              <Skeleton className="h-4 w-12 bg-white/20" />
            </div>
          </div>
          
          {/* Excerpt Skeleton */}
          <Skeleton className="h-5 w-full mb-2 bg-white/20" />
          <Skeleton className="h-5 w-4/5 bg-white/20" />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Author and Social Actions Bar Skeleton */}
        <div className="flex items-center justify-between mb-8 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>

        {/* Article Content Skeleton */}
        <article className="space-y-6 mb-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </article>

        {/* Tags Skeleton */}
        <div className="mt-12 pt-8">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        {/* Author Bio Skeleton */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

