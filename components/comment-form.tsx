"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createComment } from "@/lib/actions/comments";
import { toast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  user?: {
    id: string;
    name: string;
    image?: string;
  } | null;
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Yorumunuzu yazın...",
  user,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Hata",
        description: "Yorum yapmak için giriş yapmalısınız",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir yorum yazın",
        variant: "destructive",
      });
      return;
    }

    if (content.length < 3) {
      toast({
        title: "Hata",
        description: "Yorum en az 3 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    if (content.length > 1000) {
      toast({
        title: "Hata",
        description: "Yorum 1000 karakterden uzun olamaz",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment({
        content: content.trim(),
        postId,
        parentId,
      });

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        });
        setContent("");
        // Kısa bir delay ile onSuccess çağır
        setTimeout(() => {
          onSuccess?.();
        }, 300);
      } else {
        console.error("Comment error:", result);
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Comment submission error:", error);
      toast({
        title: "Hata",
        description: "Yorum gönderilirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6 border rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Yorum yapmak için giriş yapmalısınız
        </p>
        <Button asChild>
          <a href="/login">Giriş Yap</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback className="text-xs">
            {user.name
              ?.split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-none"
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {content.length}/1000 karakter
            </div>
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim()}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}