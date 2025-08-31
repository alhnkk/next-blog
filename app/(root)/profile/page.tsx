import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserById } from "@/lib/actions/users";
import ProfileForm from "@/components/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userResult = await getUserById(session.user.id);

  if (!userResult.success || !userResult.data) {
    redirect("/login");
  }

  const user = userResult.data;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground">
            Profil bilgilerinizi görüntüleyin ve düzenleyin
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Overview */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {user.role && (
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {user.role}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user.location}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Üye olma: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Edit Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgilerini Düzenle</CardTitle>
                <CardDescription>
                  Profil bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}