"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUserProfile } from "@/lib/actions/users";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Mail, MapPin, Phone, Calendar, Heart, ExternalLink } from "lucide-react";
import Link from "next/link";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi girin.",
  }),
  bio: z.string().max(500, {
    message: "Bio en fazla 500 karakter olabilir.",
  }).optional(),
  location: z.string().max(100, {
    message: "Konum en fazla 100 karakter olabilir.",
  }).optional(),
  phone: z.string().max(20, {
    message: "Telefon numarası en fazla 20 karakter olabilir.",
  }).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

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
  onUpdate?: () => void;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      image: user.image || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    
    try {
      const result = await updateUserProfile(user.id, {
        name: data.name,
        email: data.email,
        bio: data.bio || undefined,
        location: data.location || undefined,
        phone: data.phone || undefined,
        image: data.image || undefined,
      });

      if (result.success) {
        toast({
          title: "Başarılı!",
          description: result.message,
        });
        
        // Callback'i çağır ki parent component güncellensin
        onUpdate?.();
        
        // Sayfayı yenile
        window.location.reload();
      } else {
        toast({
          title: "Hata!",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0] || "")
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Üye olma: {joinDate}
              </div>
              {user.location && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              {user.phone && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Form Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi görüntüleyin ve düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Image */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profil Fotoğrafı</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={field.value || user.image || ""} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Input
                                placeholder="Profil fotoğrafı URL'si"
                                {...field}
                              />
                              <FormDescription>
                                Profil fotoğrafınızın URL'sini girin
                              </FormDescription>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name and Email */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İsim</FormLabel>
                          <FormControl>
                            <Input placeholder="Adınız ve soyadınız" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input placeholder="E-posta adresiniz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location and Phone */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konum</FormLabel>
                          <FormControl>
                            <Input placeholder="Şehir, Ülke" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="+90 555 123 45 67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hakkında</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Kendinizi tanıtan kısa bir metin (maksimum 500 karakter)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Profili Güncelle
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}