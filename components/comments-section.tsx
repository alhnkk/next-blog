"use client";

import { useState, useEffect } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { getCommentsByPostId } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Loader2, RefreshCw } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: number;
  initialComments?: Comment[];
  currentUser?: {
    id: string;
    name: string;
    image?: string;
    role?: string;
  } | null;
}

export function CommentsSection({
  postId,
  initialComments = [],
  currentUser,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadComments = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const result = await getCommentsByPostId(postId);
      if (result.success && result.data) {
        // Date tiplerini string'e dönüştür (recursive)
        const formatComment = (comment: any): any => ({
          ...comment,
          createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
          updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
          replies: comment.replies?.map((reply: any) => formatComment(reply)) || []
        });
        
        const formattedComments = result.data.map((comment: any) => formatComment(comment));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCommentUpdate = () => {
    // Kısa bir delay ile yorumları yeniden yükle
    setTimeout(() => {
      loadComments(false);
    }, 500);
  };

  // İlk yükleme
  useEffect(() => {
    loadComments();
  }, [postId]);

  const totalComments = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <Separator />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="text-xl font-semibold">
              Yorumlar ({totalComments})
            </h3>
          </div>
          
          {comments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadComments(false)}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Yenile
            </Button>
          )}
        </div>

        {/* Comment Form */}
        <CommentForm
          postId={postId}
          user={currentUser}
          onSuccess={handleCommentUpdate}
        />

        <Separator />

        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Yorumlar yükleniyor...</span>
            </div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-8">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                currentUser={currentUser}
                onUpdate={handleCommentUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              Henüz yorum yok
            </h4>
            <p className="text-gray-500 dark:text-gray-500">
              İlk yorumu siz yapın ve tartışmayı başlatın!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}