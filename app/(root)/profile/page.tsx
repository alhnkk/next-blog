"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/actions/users";
import UserProfile from "@/components/user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getUserById(session.user.id);
      
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
  }, [session?.user?.id, isPending]);

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
      <UserProfile 
        user={userData} 
        onUpdate={fetchUserData}
      />
    </div>
  );
};

export default ProfilePage;