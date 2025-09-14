"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllComments } from "@/lib/actions/comments";
import { formatTimeAgo, truncateText } from "@/lib/utils/date";
import { MessageSquare, Eye } from "lucide-react";
import { CenterLoading } from "@/components/ui/loading";
import { EmptyStateSmall } from "@/components/ui/empty-state";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  authorId: string;
  postId: number;
  parentId: number | null;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  post: {
    id: number;
    title: string;
    slug: string;
  };
}

export function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const result = await getAllComments(1, 5);
        if (result.success && result.data) {
          setComments(result.data.comments);
        }
      } catch (error) {
        console.error("Error loading recent comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, []);


  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Son Yorumlar
          </h3>
        </div>
        <CenterLoading size="sm" message="" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Son Yorumlar
        </h3>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/comments">
            Tümünü Gör
          </Link>
        </Button>
      </div>

      {comments.length === 0 ? (
        <EmptyStateSmall 
          icon={MessageSquare}
          message="Henüz yorum bulunmuyor"
        />
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src={comment.author.image || undefined}
                  alt={comment.author.name}
                />
                <AvatarFallback className="text-xs">
                  {comment.author.name
                    ?.split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {comment.author.name}
                  </span>
                  <Badge
                    variant={comment.approved ? "default" : "secondary"}
                    className={`text-xs ${
                      comment.approved
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                    }`}
                  >
                    {comment.approved ? "Onaylı" : "Bekliyor"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {truncateText(comment.content, 80)}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-[150px]"
                  >
                    {truncateText(comment.post.title, 30)}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Link href={`/blog/${comment.post.slug}#comment-${comment.id}`}>
                        <Eye className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}