import { getCachedPostBySlug, getCachedRelatedPosts, getCachedAllPostSlugs } from "@/lib/actions/cached-queries";
import { LikeButton } from "@/components/like-button";
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
import { calculateReadingTime, getWordCount } from "@/lib/utils/content-seo";
import { generateBreadcrumbSchema } from "@/lib/utils/structured-data";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { RelatedPosts } from "@/components/related-posts";
import { EnhancedContent } from "@/components/enhanced-content";
import type { Metadata } from "next";

// ✅ PERFORMANCE: Static Generation + ISR
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 saat - daha dengeli revalidation

// ✅ PERFORMANCE: Build time'da tüm post sayfalarını oluştur
export async function generateStaticParams() {
  const posts = await getCachedAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
  const postResult = await getCachedPostBySlug(slug);
  
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
  
  // ✅ OPTIMIZED: Post ve related posts'u paralel al
  const postResult = await getCachedPostBySlug(slug);
  
  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data;

  // ✅ OPTIMIZED: İlgili yazıları cached olarak getir
  const relatedPostsResult = await getCachedRelatedPosts(
    Number(post.id),
    post.category?.id,
    post.tags || [],
    3
  );

  const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  // Article schema oluştur
  const articleSchema = generateArticleSchema(post);

  // SEO bilgilerini hesapla
  const readingTime = calculateReadingTime(post.content || '');
  
  const relatedPostsForComponent = relatedPostsResult.success 
    ? (relatedPostsResult.data || []).map(rp => ({
        id: rp.id,
        title: rp.title,
        slug: rp.slug,
        excerpt: rp.excerpt,
        featuredImageUrl: rp.featuredImageUrl,
        featuredImageAlt: rp.featuredImageAlt,
        tags: rp.tags || [],
        createdAt: new Date(rp.createdAt),
        author: {
          name: rp.author.name
        },
        category: rp.category
      }))
    : [];

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
      <div className="flex max-w-7xl mx-auto justify-between">
      <div>
        {/* Main Content */}
        <main className="max-w-3xl px-8 lg:px-0 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-4xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Featured Image */}
            <div className="relative w-full h-[400px] mb-8 rounded overflow-hidden  border border-border/90">
              <Image
                src={post.featuredImageUrl || "/placeholder.jpeg"}
                alt={post.featuredImageAlt || post.title}
                width={800}
                height={400}  
                className="w-full h-full object-cover rounded-[1px]"
                priority
                loading="eager"
                transformation={[
                  {
                    width: "800",
                    height: "400",
                    quality: 85,
                    format: "auto"
                  }
                ]}
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

          {/* Divider */}
          <Separator />
        </header>

        {/* Article Content */}
        <article className="blog-content">
          {post.content ? (
            <EnhancedContent content={post.content} />
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
          posts={relatedPostsForComponent}
          readingTime={readingTime}
        />

        {/* Comments Section */}
        <CommentsSection
          postId={post.id}
          initialComments={[]}
        />
      </main>
    </div>
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 pt-12 pl-8 border-l border-border/50">
          <div className="sticky top-24 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { label: 'Blog', href: '/' },
                ...(post.category ? [{ label: post.category.name, href: `/?category=${post.category.slug}` }] : []),
                { label: post.title }
              ]}
              className="text-xs text-muted-foreground"
            />

            {/* Meta */}
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>{readingTime} dk okuma</p>
              {post.category && (
                <Link href={`/?category=${post.category.slug}`} className="block hover:text-foreground transition-colors">
                  {post.category.name}
                </Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <LikeButton
                postId={post.id}
                initialCount={post._count.likes}
                variant="ghost"
                size="sm"
              />
              <ShareButton title={post.title} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag: string) => (
                  <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
                    <span className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </ImageKitProvider>
  );
};

export default BlogPostPage;