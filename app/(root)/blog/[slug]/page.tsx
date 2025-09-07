import { getPostBySlug } from "@/lib/actions/posts";
import { getCommentsByPostId } from "@/lib/actions/comments";
import { auth } from "@/lib/auth";
import { LikeButton } from "@/components/like-button";
import {
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CommentsSection } from "@/components/comments-section";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured?: boolean;
  createdAt: string;
  tags?: string[];
  author: {
    id: string;
    name: string;
    image?: string;
    bio?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    likes: number;
  };
  comments?: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      image?: string;
    };
    replies?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: {
        id: string;
        name: string;
        image?: string;
      };
    }>;
  }>;
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const postResult = await getPostBySlug(params.slug);
  
  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data as Post;
  
  // Yorumları yükle
  const commentsResult = await getCommentsByPostId(parseInt(post.id));
  const comments = commentsResult.success ? commentsResult.data : [];

  // Session bilgisini al - basit yaklaşım
  let currentUser = null;
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
      };
    }
  } catch (error) {
    console.log("Session alınamadı:", error);
  }

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-4xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full h-80 mb-8 rounded-[1px] overflow-hidden">
            <Image
              src="/placeholder.jpeg"
              alt={post.title}
              width={800}
              height={320}
              className="w-full h-full object-cover"
              priority
            />
            {post.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                  Öne Çıkan
                </span>
              </div>
            )}
          </div>

          {post.excerpt && (
            <p className="leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={post.author.image || undefined}
                  alt={post.author.name}
                />
                <AvatarFallback>
                  {post.author.name
                    ?.split(" ")
                    .map((word: string) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {post.category && (
                    <>
                      <span>·</span>
                      <Link href={`/?category=${post.category.slug}`}>
                        <span className="cursor-pointer">
                          {post.category.name}
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Social Actions */}
            <div className="flex items-center gap-4">
              <LikeButton
                postId={parseInt(post.id)}
                initialCount={post._count.likes}
                currentUser={currentUser}
                variant="ghost"
                size="default"
              />
              <Button variant="ghost" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">{post.comments?.length || 0}</span>
              </Button>
              <ShareButton title={post.title} />
            </div>
          </div>

          {/* Divider */}
          <Separator />
        </header>

        {/* Article Content */}
        <article className="blog-content">
          {post.content ? (
            <div 
              className="leading-relaxed text-base"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="italic">Bu gönderi için içerik bulunmuyor.</p>
            </div>
          )}
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
                  <span className="inline-block px-3 py-1 rounded-full text-sm transition-colors cursor-pointer">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-12 pt-8">
          <Separator className="my-6" />
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={post.author.image || undefined}
                alt={post.author.name}
              />
              <AvatarFallback className="text-lg">
                {post.author.name
                  ?.split(" ")
                  .map((word: string) => word.charAt(0))
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold mb-2">{post.author.name}</h4>
              <p className="leading-relaxed">
                {post.author.bio || "Bu yazar hakkında henüz bilgi bulunmuyor."}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection
          postId={parseInt(post.id)}
          initialComments={[]}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
};

export default BlogPostPage;