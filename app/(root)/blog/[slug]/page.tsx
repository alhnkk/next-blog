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
import { Image, ImageKitProvider } from "@imagekit/next";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { generateArticleSchema } from "@/lib/utils/structured-data";
import { StructuredData } from "@/components/seo/structured-data";
import { generatePostMetadata } from "@/lib/utils/seo";
import { calculateReadingTime, getWordCount, generateExcerpt } from "@/lib/utils/content-seo";
import { generateBreadcrumbSchema } from "@/lib/utils/structured-data";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedPosts } from "@/components/related-posts";
import { findRelatedPosts } from "@/lib/utils/related-posts";
import { getPublishedPosts } from "@/lib/actions/posts";
import { EnhancedContent } from "@/components/enhanced-content";
import { getCategories } from "@/lib/actions/categories";
import { getPopularTags } from "@/lib/actions/tags";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featured?: boolean;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  createdAt: string;
  tags?: string[];
  author: {
    id: string;
    name: string;
    image?: string;
    bio?: string;
  };
  category?: {
    id: number;
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postResult = await getPostBySlug(slug);
  
  if (!postResult.success || !postResult.data) {
    return {
      title: 'Gönderi Bulunamadı',
      description: 'Aradığınız blog gönderisi bulunamadı.',
    };
  }

  return generatePostMetadata(postResult.data);
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const postResult = await getPostBySlug(slug);
  
  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data;
  
  // Yorumları yükle
  const commentsResult = await getCommentsByPostId(post.id);
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
      };
    }
  } catch (error) {
    // Session alınamadı
  }

  const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  // Article schema oluştur
  const articleSchema = generateArticleSchema(post);

  // SEO bilgilerini hesapla
  const readingTime = calculateReadingTime(post.content || '');
  const wordCount = getWordCount(post.content || '');

  // İlgili postları ve diğer verileri getir
  const [allPostsResult, categoriesResult, popularTagsResult] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getPopularTags(10)
  ]);
  
  const allPosts = allPostsResult.success ? allPostsResult.data || [] : [];
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  const popularTags = popularTagsResult.success ? popularTagsResult.data || [] : [];
  
  // Post tipini related-posts utility'sine uygun hale getir
  const postForRelated = {
    id: Number(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags || [],
    categoryId: post.category?.id || null,
    createdAt: new Date(post.createdAt),
    author: {
      name: post.author.name
    }
  };
  
  const allPostsForRelated = allPosts.map(p => ({
    id: Number(p.id),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    tags: p.tags || [],
    categoryId: p.category?.id || null,
    createdAt: new Date(p.createdAt),
    author: {
      name: p.author.name
    }
  }));
  
  const relatedPosts = findRelatedPosts(postForRelated, allPostsForRelated, 3);
  
  // İlgili postları original format'a çevir
  const relatedPostsForComponent = relatedPosts.map(rp => {
    const originalPost = allPosts.find(p => Number(p.id) === rp.id);
    return originalPost ? {
      id: Number(originalPost.id),
      title: originalPost.title,
      slug: originalPost.slug,
      excerpt: originalPost.excerpt,
      featuredImageUrl: originalPost.featuredImageUrl,
      featuredImageAlt: originalPost.featuredImageAlt,
      tags: originalPost.tags || [],
      createdAt: new Date(originalPost.createdAt),
      author: {
        name: originalPost.author.name
      },
      category: originalPost.category
    } : null;
  }).filter(Boolean);

  // Breadcrumb schema oluştur
  const breadcrumbItems = [
    { name: 'Blog', url: '/' },
    ...(post.category ? [{ name: post.category.name, url: `/?category=${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <ImageKitProvider urlEndpoint={imagekitUrlEndpoint || ''}>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      <div className="min-h-screen">

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Blog', href: '/' },
              ...(post.category ? [{ label: post.category.name, href: `/?category=${post.category.slug}` }] : []),
              { label: post.title }
            ]}
            className="mb-8"
          />

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-4xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Featured Image */}
            <div className="relative w-full h-80 mb-8 rounded-[1px] overflow-hidden">
              <Image
                src={post.featuredImageUrl || "/placeholder.jpeg"}
                alt={post.featuredImageAlt || post.title}
                width={800}
                height={320}
                className="w-full h-full object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
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
                  <span>•</span>
                  <span>{readingTime} dk okuma</span>
                  <span>•</span>
                  {post.category && (
                    <>
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
                postId={post.id}
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
            <EnhancedContent
              content={post.content}
              categories={categories}
              popularTags={popularTags}
              relatedPosts={relatedPostsForComponent.filter(p => p !== null).slice(0, 3)} // Sadece ilk 3'ü
              currentPostId={Number(post.id)}
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

        {/* Related Posts */}
        <RelatedPosts 
          posts={relatedPostsForComponent.filter(p => p !== null)}
          readingTime={readingTime}
        />

        {/* Comments Section */}
        <CommentsSection
          postId={post.id}
          initialComments={[]}
          currentUser={currentUser}
        />
      </main>
    </div>
    </ImageKitProvider>
  );
};

export default BlogPostPage;