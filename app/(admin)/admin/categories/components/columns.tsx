"use client";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Eye,
  Edit,
  Folder,
  Hash,
  Palette,
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
import { deleteCategory } from "@/lib/actions/categories";
import { toast } from "sonner";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
  };
};

// Kategori silme fonksiyonu
const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
  try {
    const result = await deleteCategory(categoryId);

    if (result.success) {
      toast.success(`"${categoryName}" başarıyla silindi`);
      window.location.reload();
    } else {
      toast.error(result.error || "Kategori silinirken hata oluştu");
    }
  } catch (error) {
    console.error("Delete error:", error);
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

// Kategori görüntüleme fonksiyonu
const handleViewCategory = (slug: string) => {
  window.open(`/?category=${slug}`, "_blank");
};

// Kategori düzenleme fonksiyonu
const handleEditCategory = (categoryId: number) => {
  window.location.href = `/admin/categories/${categoryId}/edit`;
};

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategori Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full border"
            style={{ 
              backgroundColor: category.color || '#6b7280',
              borderColor: category.color || '#6b7280'
            }}
          />
          <div>
            <div className="font-medium">{category.name}</div>
            <div className="text-xs text-muted-foreground">
              /{category.slug}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;
      return (
        <div className="max-w-[300px]">
          {description ? (
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Açıklama yok
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Renk",
    cell: ({ row }) => {
      const color = row.getValue("color") as string | null;
      return (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: color || '#6b7280' }}
          />
          <span className="text-xs font-mono">
            {color || '#6b7280'}
          </span>
        </div>
      );
    },
  },
  {
    id: "postCount",
    header: "Gönderi Sayısı",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <Badge variant="secondary" className="text-xs">
          {category._count.posts} gönderi
        </Badge>
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
      const category = row.original;

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
            <DropdownMenuItem onClick={() => handleCopySlug(category.slug)}>
              Slug&apos;ı Kopyala
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopyId(category.id)}>
              ID Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewCategory(category.slug)}>
              <Eye className="mr-2 h-4 w-4" />
              Kategoriyi Görüntüle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditCategory(category.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Kategoriyi Düzenle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                  disabled={category._count.posts > 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Kategoriyi Sil
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>&quot;{category.name}&quot;</strong> kategorisini silmek
                    istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    {category._count.posts > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                        <strong>Uyarı:</strong> Bu kategoriye ait {category._count.posts} gönderi bulunmaktadır. 
                        Önce bu gönderileri başka kategorilere taşıyın veya silin.
                      </div>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={category._count.posts > 0}
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