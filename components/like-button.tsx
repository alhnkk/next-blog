"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { togglePostLike, getPostLikeStatus } from "@/lib/actions/likes";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

interface LikeButtonProps {
  postId: number;
  initialLiked?: boolean;
  initialCount?: number;
  currentUser?: {
    id: string;
    name: string;
  } | null;
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg";
  showCount?: boolean;
  className?: string;
}

export function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
  currentUser: propUser,
  variant = "ghost",
  size = "default",
  showCount = true,
  className,
}: LikeButtonProps) {
  // ✅ Client-side session - server'ı bloklamaz
  const { user: sessionUser } = useSession();
  const currentUser = propUser || sessionUser;
  
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Kullanıcı giriş yaptıysa beğeni durumunu yükle
  useEffect(() => {
    if (currentUser) {
      loadLikeStatus();
    }
  }, [postId, currentUser?.id]);

  const loadLikeStatus = async () => {
    try {
      const result = await getPostLikeStatus(postId);
      if (result.success && result.data) {
        setLiked(result.data.liked);
        setLikeCount(result.data.likeCount);
      }
    } catch (error) {
      console.error("Error loading like status:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Giriş Gerekli",
        description: "Beğenmek için giriş yapmalısınız",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousLiked = liked;
    const previousCount = likeCount;
    
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const result = await togglePostLike(postId);

      if (result.success && result.data) {
        setLiked(result.data.liked);
        setLikeCount(result.data.likeCount);
        
        toast({
          title: result.data.liked ? "Beğenildi!" : "Beğeni Kaldırıldı",
          description: result.message,
        });
      } else {
        // Revert optimistic update
        setLiked(previousLiked);
        setLikeCount(previousCount);
        
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert optimistic update
      setLiked(previousLiked);
      setLikeCount(previousCount);
      
      toast({
        title: "Hata",
        description: "Beğeni işlemi sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 transition-all duration-200",
        liked && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-200",
          size === "sm" && "h-3 w-3",
          size === "lg" && "h-5 w-5",
          liked && "fill-current scale-110"
        )}
      />
      {showCount && (
        <span className={cn(
          "text-sm font-medium",
          size === "sm" && "text-xs",
          size === "lg" && "text-base"
        )}>
          {likeCount}
        </span>
      )}
    </Button>
  );
}