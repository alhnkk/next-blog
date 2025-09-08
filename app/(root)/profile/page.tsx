"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import { getUserById } from "@/lib/actions/users";
import UserProfile from "@/components/user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { getLikedPostsByUser } from "@/lib/actions/likes";
import { getCommentsByUser } from "@/lib/actions/comments";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
}

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("userId");
  const isOwnProfile = useMemo(() => {
    return userIdFromQuery ? userIdFromQuery === session?.user?.id : true;
  }, [userIdFromQuery, session?.user?.id]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);

  const fetchUserData = async () => {
    const targetUserId = userIdFromQuery || session?.user?.id;
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getUserById(targetUserId);
      
      if (result.success && result.data) {
        setUserData(result.data);
        setError(null);
      } else {
        setError(result.error || "Kullanıcı bilgileri alınamadı");
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      fetchUserData();
    }
  }, [session?.user?.id, userIdFromQuery, isPending]);

  // Beğeniler ve yorumlar
  useEffect(() => {
    const loadExtras = async () => {
      const targetUserId = userIdFromQuery || session?.user?.id;
      if (!targetUserId) return;
      const [likesRes, commentsRes] = await Promise.all([
        getLikedPostsByUser(targetUserId),
        getCommentsByUser(targetUserId, 1, 10),
      ]);
      if (likesRes.success) setLikedPosts(likesRes.data || []);
      if (commentsRes.success) setUserComments(commentsRes.data?.comments || []);
    };
    if (!isPending) loadExtras();
  }, [isPending, userIdFromQuery, session?.user?.id]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">
                  Profil bilgilerinizi görüntüleyin ve güncelleyin
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                  <Skeleton className="h-24" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">
                  Profil bilgilerinizi görüntüleyin ve güncelleyin
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Profil sayfasını görüntülemek için giriş yapmanız gerekiyor.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">
                  Profil bilgilerinizi görüntüleyin ve güncelleyin
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
                <p className="text-muted-foreground">
                  Profil bilgilerinizi görüntüleyin ve güncelleyin
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Kullanıcı bilgileri bulunamadı.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
              <p className="text-muted-foreground">
                Profil bilgilerinizi görüntüleyin ve güncelleyin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <UserProfile 
              user={userData} 
              onUpdate={fetchUserData}
            />
          </div>
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="font-semibold">Beğenilen Gönderiler</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {likedPosts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Henüz beğeni yok.</div>
                ) : (
                  likedPosts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="text-sm">
                      <Link href={`/blog/${post.slug}`} className="hover:underline font-medium">
                        {post.title}
                      </Link>
                      <div className="text-muted-foreground text-xs">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</div>
                    </div>
                  ))
                )}
                {likedPosts.length > 5 && (
                  <Link href={`/blog`} className="text-xs text-primary hover:underline">Tümünü gör</Link>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="font-semibold">Yorumlar</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {userComments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Henüz yorum yok.</div>
                ) : (
                  userComments.slice(0, 5).map((c: any) => (
                    <div key={c.id} className="text-sm">
                      <Link href={`/blog/${c.post.slug}`} className="hover:underline">
                        {c.post.title}
                      </Link>
                      <div className="text-muted-foreground text-xs line-clamp-1">{c.content}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;