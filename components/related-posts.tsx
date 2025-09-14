"use client";

import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils/date";
import { ArrowRight } from "lucide-react";

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  tags: string[];
  createdAt: Date;
  author: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  readingTime?: number;
  title?: string;
}

export function RelatedPosts({ 
  posts, 
  title = "İlgili Yazılar" 
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        {title}
      </h3>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link 
              href={`/blog/${post.slug}`}
              className="flex items-start justify-between py-3 px-0 hover:bg-muted/30 transition-colors rounded-lg"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h4>
                
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  
                  {post.category && (
                    <>
                      <span>•</span>
                      <span className="text-xs">{post.category.name}</span>
                    </>
                  )}
                  
                  {post.author && (
                    <>
                      <span>•</span>
                      <span className="text-xs">{post.author.name}</span>
                    </>
                  )}
                </div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
