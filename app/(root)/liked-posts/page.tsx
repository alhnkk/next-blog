import { getLikedPostsByUser } from "@/lib/actions/likes";
import { auth } from "@/lib/auth";
import BlogList from "@/components/blog-list";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LikedPostsPage() {
  // Session kontrolü
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect("/login");
  }

  const currentUser = {
    id: session.user.id,
    name: session.user.name,
  };

  // Beğenilen gönderileri al
  const likedPostsResult = await getLikedPostsByUser();
  const likedPosts = likedPostsResult.success ? likedPostsResult.data || [] : [];

  return (
    <div className="max-w-4xl mx-auto py-10 lg:py-16 px-6 xl:px-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold tracking-tight">
            Beğendiğim Gönderiler
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <p className="text-muted-foreground">
          Toplam {likedPosts.length} gönderi beğendiniz
        </p>
      </div>

      {/* Posts List */}
      {likedPosts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Henüz hiç gönderi beğenmediniz
          </h2>
          <p className="text-gray-500 mb-6">
            Beğendiğiniz gönderiler burada görünecek
          </p>
          <Button asChild>
            <Link href="/">
              Gönderileri Keşfet
            </Link>
          </Button>
        </div>
      ) : (
        <BlogList posts={likedPosts} currentUser={currentUser} />
      )}
    </div>
  );
}