"use client";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Eye,
  Edit,
  Star,
  StarOff,
  FileText,
  MessageSquare,
  Heart,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deletePost, togglePostFeatured, updatePostStatus } from "@/lib/actions/posts";
import { PostStatus } from "@/lib/generated/prisma";
import { toast } from "sonner";

export type Post = {
  id: number;
  title: string;
  content: string | null;
  slug: string;
  excerpt: string | null;
  featured: boolean;
  status: PostStatus;
  tags: string[];
  authorId: string;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
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
};

// Gönderi silme fonksiyonu
const handleDeletePost = async (postId: number, postTitle: string) => {
  try {
    const result = await deletePost(postId);

    if (result.success) {
      toast.success(`"${postTitle}" başarıyla silindi`);
      window.location.reload();
    } else {
      toast.error(result.error || "Gönderi silinirken hata oluştu");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Beklenmeyen bir hata oluştu");
  }
};

// Gönderi öne çıkarma fonksiyonu
const handleToggleFeatured = async (postId: number, postTitle: string) => {
  try {
    const result = await togglePostFeatured(postId);

    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.error || "Öne çıkarma durumu değiştirilirken hata oluştu");
    }
  } catch (error) {
    console.error("Toggle featured error:", error);
    toast.error("Beklenmeyen bir hata oluştu");
  }
};

// Gönderi durumu değiştirme fonksiyonu
const handleStatusChange = async (postId: number, status: PostStatus, postTitle: string) => {
  try {
    const result = await updatePostStatus(postId, status);

    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.error || "Gönderi durumu değiştirilirken hata oluştu");
    }
  } catch (error) {
    console.error("Status change error:", error);
    toast.error("Beklenmeyen bir hata oluştu");
  }
};

// Kopyalama fonksiyonları
const handleCopySlug = async (slug: string) => {
  try {
    await navigator.clipboard.writeText(slug);
    toast.success("Slug kopyalandı");
  } catch (error) {
    toast.error("Slug kopyalanamadı");
  }
};

const handleCopyId = async (id: number) => {
  try {
    await navigator.clipboard.writeText(id.toString());
    toast.success("ID kopyalandı");
  } catch (error) {
    toast.error("ID kopyalanamadı");
  }
};

// Gönderi görüntüleme fonksiyonu
const handleViewPost = (slug: string) => {
  window.open(`/blog/${slug}`, "_blank");
};

// Gönderi düzenleme fonksiyonu
const handleEditPost = (postId: number) => {
  window.location.href = `/admin/posts/${postId}/edit`;
};

export const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Başlık
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div className="max-w-[300px]">
            <div className="font-medium truncate">{post.title}</div>
            <div className="text-xs text-muted-foreground truncate">
              /{post.slug}
            </div>
            {post.featured && (
              <Badge variant="secondary" className="text-xs mt-1">
                <Star className="h-3 w-3 mr-1" />
                Öne Çıkan
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Yazar",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.image || undefined} alt={post.author.name} />
            <AvatarFallback className="text-xs">
              {post.author.name
                ?.split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">{post.author.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const post = row.original;
      if (!post.category) {
        return (
          <Badge variant="outline" className="text-xs">
            Kategorisiz
          </Badge>
        );
      }
      return (
        <Badge 
          variant="secondary" 
          className="text-xs"
          style={{ 
            backgroundColor: post.category.color ? `${post.category.color}20` : undefined,
            color: post.category.color || undefined 
          }}
        >
          {post.category.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const status = row.getValue("status") as PostStatus;
      return (
        <Badge
          variant={
            status === PostStatus.PUBLISHED
              ? "default"
              : status === PostStatus.DRAFT
              ? "secondary"
              : "outline"
          }
          className="text-xs"
        >
          {status === PostStatus.PUBLISHED
            ? "Yayınlandı"
            : status === PostStatus.DRAFT
            ? "Taslak"
            : "Arşivlendi"}
        </Badge>
      );
    },
  },
  {
    id: "engagement",
    header: "Etkileşim",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-3 w-3" />
            <span>{post._count.comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>{post._count.likes}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Oluşturulma
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleCopySlug(post.slug)}>
              Slug&apos;ı Kopyala
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopyId(post.id)}>
              ID Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewPost(post.slug)}>
              <Eye className="mr-2 h-4 w-4" />
              Gönderiyi Görüntüle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditPost(post.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Gönderiyi Düzenle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleToggleFeatured(post.id, post.title)}
              className={post.featured ? "text-orange-600" : "text-blue-600"}
            >
              {post.featured ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Öne Çıkarmayı Kaldır
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Öne Çıkar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {post.status !== PostStatus.PUBLISHED && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(post.id, PostStatus.PUBLISHED, post.title)}
                className="text-green-600"
              >
                Yayınla
              </DropdownMenuItem>
            )}
            {post.status !== PostStatus.DRAFT && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(post.id, PostStatus.DRAFT, post.title)}
                className="text-yellow-600"
              >
                Taslağa Çevir
              </DropdownMenuItem>
            )}
            {post.status !== PostStatus.ARCHIVED && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(post.id, PostStatus.ARCHIVED, post.title)}
                className="text-gray-600"
              >
                Arşivle
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Gönderiyi Sil
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Gönderiyi Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>&quot;{post.title}&quot;</strong> gönderisini silmek
                    istediğinizden emin misiniz? Bu işlem geri alınamaz ve
                    gönderinin tüm verileri (yorumlar, beğeniler) kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Evet, Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
