import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button variant="ghost" className="p-0" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Title Skeleton */}
          <Skeleton className="h-12 w-3/4 mb-6" />

          {/* Featured Image Skeleton */}
          <Skeleton className="w-full h-80 mb-8 rounded-[1px]" />

          {/* Excerpt Skeleton */}
          <div className="mb-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Author and Meta Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Social Actions Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          <Separator />
        </header>

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
        <div className="mt-12 pt-8">
          <Separator className="my-6" />
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Comments Section Skeleton */}
        <div className="mt-12 pt-8">
          <Skeleton className="h-7 w-32 mb-6" />
          
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}