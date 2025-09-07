import { Calendar, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LikeButton } from "@/components/like-button";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string | null;
  slug: string;
  excerpt: string | null;
  featured: boolean;
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  _count: {
    comments: number;
    likes: number;
  };
}

interface BlogListProps {
  posts: Post[];
  currentUser?: {
    id: string;
    name: string;
  } | null;
}

const BlogList = ({ posts, currentUser }: BlogListProps) => {
  if (posts.length === 0) {
    return (
      <div className="mt-8 text-center py-12">
        <p className="text-muted-foreground text-lg">
          Henüz gönderi bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-12">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="flex flex-col sm:flex-row shadow-none overflow-hidden rounded-md border-none bg-transparent"
        >
          <Link
            href={`/blog/${post.slug}`}
            className="w-[400px] h-[256px] bg-muted rounded-[1px] flex items-center justify-center"
          >
            <Image
              src="/placeholder2.jpeg"
              alt={post.title}
              width={400}
              height={302}
              className="w-full h-[256px] object-cover"
            />
          </Link>
          <CardContent className="px-0 py-0 flex flex-col max-w-lg">
            <div className="flex items-start gap-6 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {post.category && (
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
              )}
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight my-5 hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </h3>
            </Link>

            <p className="mt-2 text-muted-foreground line-clamp-2 text-ellipsis mr-4">
              {post.excerpt ||
                post.content?.substring(0, 200) + "..." ||
                "İçerik mevcut değil."}
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <LikeButton
                postId={post.id}
                initialCount={post._count.likes}
                currentUser={currentUser}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-500 p-0 h-auto"
              />
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post._count.comments}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
