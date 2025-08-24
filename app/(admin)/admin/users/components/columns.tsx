"use client";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
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
import { deleteUser } from "@/lib/actions/users";

export type Users = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Kullanıcı silme fonksiyonu
const handleDeleteUser = async (userId: string, userName: string) => {
  try {
    const result = await deleteUser(userId);

    if (result.success) {
      alert(`${userName} başarıyla silindi`);
      // Sayfayı yenile
      window.location.reload();
    } else {
      alert(result.error || "Kullanıcı silinirken hata oluştu");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Beklenmeyen bir hata oluştu");
  }
};

export const columns: ColumnDef<Users>[] = [
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
          İsim
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()
                .slice(0, 2) ||
                user.email?.charAt(0).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-medium">{user.name}</div>
            {user.banned && (
              <Badge variant="destructive" className="text-xs">
                Yasaklı
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div>{user.email}</div>
          {!user.emailVerified && (
            <Badge variant="outline" className="text-xs my-1">
              Doğrulanmamış
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null;
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs font-medium`,
            role === "admin" &&
              "bg-blue-500/20 text-blue-800 border border-blue-200",
            (role === "user" || !role) && "bg-green-500/20 text-green-800"
          )}
        >
          {role === "admin" ? "Yönetici" : "Kullanıcı"}
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
          Kayıt Tarihi
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
    id: "status",
    header: "Durum",
    cell: ({ row }) => {
      const user = row.original;

      if (user.banned) {
        const isExpired =
          user.banExpires && new Date(user.banExpires) < new Date();
        return (
          <Badge
            variant={isExpired ? "outline" : "destructive"}
            className="text-xs"
          >
            {isExpired ? "Yasak Süresi Dolmuş" : "Yasaklı"}
          </Badge>
        );
      }

      return (
        <Badge variant="secondary" className="text-xs">
          Aktif
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Email&apos;i Kopyala
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              ID Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Kullanıcıyı Görüntüle</DropdownMenuItem>
            <DropdownMenuItem>Kullanıcıyı Düzenle</DropdownMenuItem>
            {user.banned ? (
              <DropdownMenuItem className="text-green-600">
                Yasağı Kaldır
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-orange-600">
                Kullanıcıyı Yasakla
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
                  Kullanıcıyı Sil
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>{user.name}</strong> kullanıcısını silmek
                    istediğinizden emin misiniz? Bu işlem geri alınamaz ve
                    kullanıcının tüm verileri kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteUser(user.id, user.name)}
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
