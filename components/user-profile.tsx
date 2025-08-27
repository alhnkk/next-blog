"use client";

import { useState, useTransition } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { updateUser } from "@/lib/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

interface UserProfileProps {
  user: UserData;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: user.name || "İsimsiz Kullanıcı",
    email: user.email,
    phone: user.phone || " ",
    location: user.location || " ",
    bio: user.bio || "Bu kullanıcı henüz bir bio eklememış.",
    joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString(
      "tr-TR",
      {
        year: "numeric",
        month: "long",
      }
    ),
    avatar: user.image,
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = async () => {
    startTransition(async () => {
      try {
        const result = await updateUser(user.id, {
          name: editedProfile.name,
          email: editedProfile.email,
          bio: editedProfile.bio,
          location: editedProfile.location,
          phone: editedProfile.phone,
        });

        if (result.success && result.data) {
          // Server'dan dönen güncellenmiş veriyi kullan
          const updatedProfile = {
            name: result.data.name || "İsimsiz Kullanıcı",
            email: result.data.email,
            phone: result.data.phone || "",
            location: result.data.location || "",
            bio: result.data.bio || "Bu kullanıcı henüz bir bio eklememış.",
            joinDate: profile.joinDate, // Bu değişmez
            avatar: result.data.image,
          };

          setProfile(updatedProfile);
          setEditedProfile(updatedProfile);
          setIsEditing(false);
          toast.success(result.message || "Profil başarıyla güncellendi");

          // Sayfayı yenile ki session'daki veri de güncellensin
          router.refresh();
        } else {
          toast.error(result.error || "Profil güncellenirken hata oluştu");
        }
      } catch (error) {
        toast.error("Beklenmeyen bir hata oluştu");
        console.error("Profile update error:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Summary Card */}
          <div className="md:col-span-1">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0] || "")
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl text-balance">
                  {profile.name}
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Üye olma: {profile.joinDate}
                </div>
                <Separator />
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profil Bilgileri
                    </CardTitle>
                    <CardDescription>
                      Kişisel bilgilerinizi görüntüleyin ve düzenleyin
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Düzenle
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="gap-2"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isPending ? "Kaydediliyor..." : "Kaydet"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="gap-2 bg-transparent"
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                        İptal
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  // View Mode
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Ad Soyad
                        </Label>
                        <p className="text-foreground">{profile.name}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          E-posta
                        </Label>
                        <p className="text-foreground">{profile.email}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Telefon
                        </Label>
                        <p className="text-foreground">{profile.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Konum
                        </Label>
                        <p className="text-foreground">{profile.location}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Hakkımda
                      </Label>
                      <p className="text-foreground text-pretty leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              name: e.target.value,
                            })
                          }
                          placeholder="Adınızı ve soyadınızı girin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              email: e.target.value,
                            })
                          }
                          placeholder="E-posta adresinizi girin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Telefon numaranızı girin"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Konum</Label>
                        <Input
                          id="location"
                          value={editedProfile.location}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              location: e.target.value,
                            })
                          }
                          placeholder="Konumunuzu girin"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Hakkımda</Label>
                      <Textarea
                        id="bio"
                        value={editedProfile.bio}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
