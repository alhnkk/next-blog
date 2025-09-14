"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/actions/users";
import { toast } from "sonner";

import CardList from "@/components/admin/card-list";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Candy, Citrus, Shield, Loader2 } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "@/components/admin/edit-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLineChart from "@/components/admin/app-line-chart";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  _count?: {
    posts: number;
    comments: number;
  };
}

const SingleUserPage = () => {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = params.id as string;
        const result = await getUserById(userId);
        
        if (result.success && result.data) {
          setUser(result.data);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Kullanıcı bilgileri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const calculateProfileCompletion = (user: User) => {
    let completed = 0;
    const fields = [user.name, user.email, user.bio, user.location, user.phone, user.image];
    fields.forEach(field => {
      if (field && field.trim() !== '') completed++;
    });
    return Math.round((completed / fields.length) * 100);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'moderator':
        return 'bg-blue-500 text-white';
      case 'user':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Kullanıcı bilgileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Kullanıcı Bulunamadı</h2>
          <p className="text-muted-foreground">Aradığınız kullanıcı mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Admin Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/users">Kullanıcılar</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{user.name || user.email}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>  
      {/* CONTAINER */}
      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* USER BADGES CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Kullanıcı Rozetleri</h1>
            <div className="flex gap-4 mt-4">
              {user.emailVerified && (
                <HoverCard>
                  <HoverCardTrigger>
                    <BadgeCheck
                      size={36}
                      className="rounded-full bg-blue-500/30 border-1 border-blue-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Onaylı Kullanıcı</h1>
                    <p className="text-sm text-muted-foreground">
                      Bu kullanıcının email doğrulaması mevcut.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
              {user.role === 'ADMIN' && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield
                      size={36}
                      className="rounded-full bg-green-800/30 border-1 border-green-800/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Admin</h1>
                    <p className="text-sm text-muted-foreground">
                     Tam erişim yetkisine sahip.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
              {user._count && user._count.posts > 10 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Candy
                      size={36}
                      className="rounded-full bg-yellow-500/30 border-1 border-yellow-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Aktif Yazar</h1>
                    <p className="text-sm text-muted-foreground">
                    Bu kullanıcı 10&apos;dan fazla gönderi yazmıştır.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
              {user._count && user._count.comments > 50 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Citrus
                      size={36}
                      className="rounded-full bg-orange-500/30 border-1 border-orange-500/50 p-2"
                    />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="font-bold mb-2">Aktif Yorumcu</h1>
                    <p className="text-sm text-muted-foreground">
                      Topluluk içerisinde aktif yorumcu.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
          {/* INFORMATION CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Kullanıcı Bilgileri</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Düzenle</Button>
                </SheetTrigger>
                <EditUser 
                  user={user} 
                  onUserUpdate={(updatedUser) => {
                    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
                  }} 
                />
              </Sheet>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">
                Profil Tamamlanma Oranı
                </p>
                <Progress value={calculateProfileCompletion(user)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">İsim:</span>
                <span>{user.name || 'Belirtilmemiş'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-bold">Telefon:</span>
                  <span>{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <span className="font-bold">Konum:</span>
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold">Rol:</span>
                <Badge className={getRoleBadgeColor(user.role || 'USER')}>
                  {user.role === 'ADMIN' ? 'Admin' : user.role === 'MODERATOR' ? 'Moderatör' : 'Kullanıcı'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Gönderi Sayısı:</span>
                <span>{user._count?.posts || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Yorum Sayısı:</span>
                <span>{user._count?.comments || 0}</span>
              </div>
              {user.banned && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600">Durum:</span>
                  <Badge variant="destructive">Yasaklı</Badge>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {new Date(user.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı.
            </p>
          </div>
          {/* CARD LIST CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <CardList title="Recent Transactions" />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          {/* USER CARD CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback>{getUserInitials(user.name || user.email)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{user.name || 'İsimsiz Kullanıcı'}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {user.bio || 'Bu kullanıcı henüz bir biyografi eklememiştir.'}
            </p>
          </div>
          {/* CHART CONTAINER */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Aktivite</h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;