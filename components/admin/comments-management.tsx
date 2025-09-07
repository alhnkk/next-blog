"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getAllComments, toggleCommentApproval, deleteComment } from "@/lib/actions/comments";
import { toast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  post: {
    id: number;
    title: string;
    slug: string;
  };
}

interface CommentsData {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function CommentsManagement() {
  const [data, setData] = useState<CommentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadComments = async (page = 1) => {
    setIsLoading(true);
    try {
      const result = await getAllComments(page, 20);
      if (result.success && result.data) {
        setData(result.data);
        setCurrentPage(page);
      } else {
        toast({
          title: "Hata",
          description: result.error || "Yorumlar yüklenirken hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorumlar yüklenirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleToggleApproval = async (comment: Comment) => {
    setActionLoading(comment.id);
    try {
      const result = await toggleCommentApproval(comment.id);
      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        });
        loadComments(currentPage);
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
        description: "İşlem sırasında hata oluştu",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;

    setActionLoading(selectedComment.id);
    try {
      const result = await deleteComment(selectedComment.id);
      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        });
        loadComments(currentPage);
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
        description: "Yorum silinirken hata oluştu",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setShowDeleteDialog(false);
      setSelectedComment(null);
    }
  };

  const filteredComments = data?.comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.post.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Yorumlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Yorumlar</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm yorumları görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Yorum, yazar veya gönderi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => loadComments(currentPage)} variant="outline">
          Yenile
        </Button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold">{data.pagination.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Toplam Yorum
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">
              {data.comments.filter(c => c.approved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Onaylı Yorum
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-orange-600">
              {data.comments.filter(c => !c.approved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Bekleyen Yorum
            </div>
          </div>
        </div>
      )}

      {/* Comments Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] min-w-[160px] sticky left-0 bg-background z-10">Yazar</TableHead>
                <TableHead className="w-[300px] min-w-[250px]">İçerik</TableHead>
                <TableHead className="w-[200px] min-w-[150px]">Gönderi</TableHead>
                <TableHead className="w-[100px] min-w-[80px]">Durum</TableHead>
                <TableHead className="w-[120px] min-w-[100px]">Tarih</TableHead>
                <TableHead className="w-[50px] min-w-[40px] sticky right-0 bg-background z-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? "Arama kriterlerine uygun yorum bulunamadı" : "Henüz yorum bulunmuyor"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id} className="hover:bg-muted/50">
                    <TableCell className="py-3 sticky left-0 bg-background z-10">
                      <div className="flex items-center gap-2">
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
                        <span className="font-medium text-sm truncate">
                          {comment.author.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="max-w-[280px]">
                        <p className="text-sm leading-relaxed line-clamp-3">
                          {comment.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline block truncate"
                        title={comment.post.title}
                      >
                        {comment.post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant={comment.approved ? "default" : "secondary"}
                        className={
                          comment.approved
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                        }
                      >
                        {comment.approved ? "Onaylı" : "Bekliyor"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 sticky right-0 bg-background z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={actionLoading === comment.id}
                          >
                            {actionLoading === comment.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${comment.post.slug}#comment-${comment.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Görüntüle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleApproval(comment)}
                          >
                            {comment.approved ? (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Onayı Kaldır
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Onayla
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedComment(comment);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Sayfa {data.pagination.page} / {data.pagination.pages} 
            ({data.pagination.total} toplam yorum)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadComments(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadComments(currentPage + 1)}
              disabled={currentPage === data.pagination.pages || isLoading}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading !== null}>
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading !== null ? (
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