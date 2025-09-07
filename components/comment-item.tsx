"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentForm } from "./comment-form";
import { deleteComment, updateComment } from "@/lib/actions/comments";
import { toast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface CommentItemProps {
  comment: Comment;
  postId: number;
  currentUser?: {
    id: string;
    name: string;
    image?: string;
    role?: string;
  } | null;
  onUpdate?: () => void;
}

export function CommentItem({
  comment,
  postId,
  currentUser,
  onUpdate,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const isOwner = currentUser?.id === comment.author.id;
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  // 15 dakika içinde düzenlenebilir mi kontrol et
  const createdAt = new Date(comment.createdAt);
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const canEditTime = createdAt > fifteenMinutesAgo;

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onUpdate?.();
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }

    if (editContent.length < 3) {
      toast({
        title: "Hata",
        description: "Yorum en az 3 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    if (editContent.length > 1000) {
      toast({
        title: "Hata",
        description: "Yorum 1000 karakterden uzun olamaz",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateComment(comment.id, editContent.trim());

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        });
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteComment(comment.id);

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        });
        onUpdate?.();
      } else {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum silinirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? "Az önce" : `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
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

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && (
                  <span className="ml-1">(düzenlendi)</span>
                )}
              </span>
            </div>

            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && canEditTime && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={isUpdating}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {editContent.length}/1000 karakter
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-1" />
                    İptal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleEdit}
                    disabled={isUpdating || !editContent.trim()}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {isUpdating ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>

              {currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-6 px-2 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Yanıtla
                </Button>
              )}
            </div>
          )}

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                user={currentUser}
                placeholder={`${comment.author.name} kullanıcısına yanıt yazın...`}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-4 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUser={currentUser}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              {comment.replies && comment.replies.length > 0 && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400">
                  Not: Bu yorumun yanıtları olduğu için sadece içerik silinecek.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}