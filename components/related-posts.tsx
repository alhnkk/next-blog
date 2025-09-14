"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Image } from "@imagekit/next";

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
  readingTime = 3, 
  title = "İlgili Yazılar" 
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8">
      <div className="border-t">
        <h3 className="text-2xl font-bold tracking-tight mb-6 mt-8">
          {title}
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  <Image
                    src={post.featuredImageUrl || "/placeholder2.jpeg"}
                    alt={post.featuredImageAlt || post.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
              
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} dk</span>
                  
                  {post.category && (
                    <>
                      <span>•</span>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: post.category.color
                            ? `${post.category.color}20`
                            : undefined,
                          color: post.category.color || undefined,
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    </>
                  )}
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h4 className="font-semibold leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </Link>

                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
                        <Badge 
                          variant="outline" 
                          className="text-xs hover:bg-muted cursor-pointer"
                        >
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
