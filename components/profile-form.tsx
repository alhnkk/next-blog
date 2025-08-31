"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { updateUserProfile } from "@/lib/actions/users";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "İsim en az 2 karakter olmalıdır.",
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

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
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
        router.refresh();
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

  return (
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

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İsim</FormLabel>
              <FormControl>
                <Input placeholder="Adınız ve soyadınız" {...field} />
              </FormControl>
              <FormDescription>
                Bu isim profil sayfanızda görünecektir.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konum</FormLabel>
              <FormControl>
                <Input placeholder="Şehir, Ülke" {...field} />
              </FormControl>
              <FormDescription>
                Bulunduğunuz şehir veya ülke
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder="+90 555 123 45 67" {...field} />
              </FormControl>
              <FormDescription>
                İletişim için telefon numaranız (opsiyonel)
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
  );
}