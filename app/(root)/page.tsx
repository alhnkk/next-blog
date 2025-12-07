import BlogList from "@/components/blog-list";
import Sidebar from "@/components/sidebar";
import { Pagination, PaginationInfo, MobilePagination } from "@/components/pagination";
import Link from "next/link";
import { 
  getCachedPublishedPosts, 
  getCachedPostsByCategorySlug, 
  getCachedPostsByTag,
  getCachedCategories,
  getCachedPopularTags 
} from "@/lib/actions/cached-queries";
import { ImageKitProvider } from "@imagekit/next";
import { generateWebSiteSchema, generateOrganizationSchema, generateBlogSchema } from "@/lib/utils/structured-data";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generateHomePageMetadata, generateCategoryMetadata, generateTagMetadata } from "@/lib/utils/seo";
import type { Metadata } from "next";

// ✅ PERFORMANCE: ISR ile statik sayfa, searchParams dinamik
export const revalidate = 300; // 5 dakika - daha agresif caching

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  
  if (resolvedSearchParams.category) {
    const categoriesResult = await getCachedCategories();
    const categories = categoriesResult.success ? categoriesResult.data || [] : [];
    const selectedCategory = categories.find((cat) => cat.slug === resolvedSearchParams.category);
    
    if (selectedCategory) {
      return generateCategoryMetadata(selectedCategory);
    }
  }
  
  if (resolvedSearchParams.tag) {
    // Tag gönderi sayısını al - cached sorgu
    const tagPostsResult = await getCachedPostsByTag(resolvedSearchParams.tag, 1, 1);
    const postCount = tagPostsResult.success ? tagPostsResult.pagination?.total || 0 : 0;
    
    return generateTagMetadata(resolvedSearchParams.tag, postCount);
  }
  
  return generateHomePageMetadata();
}

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  
  // Sayfa numarasını al
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const postsPerPage = 6; // Sayfa başına gönderi sayısı

  // ✅ OPTIMIZED: Tüm sorguları paralel + cached olarak çalıştır
  const [postsResult, categoriesResult, popularTagsResult] = await Promise.all([
    // Filtre tipine göre cached postları getir
    resolvedSearchParams.category
      ? getCachedPostsByCategorySlug(resolvedSearchParams.category, currentPage, postsPerPage)
      : resolvedSearchParams.tag
        ? getCachedPostsByTag(resolvedSearchParams.tag, currentPage, postsPerPage)
        : getCachedPublishedPosts(currentPage, postsPerPage),
    // Kategoriler ve taglar
    getCachedCategories(),
    getCachedPopularTags(10),
  ]);

  const posts = postsResult.success ? postsResult.data || [] : [];
  const pagination = postsResult.success ? postsResult.pagination : null;
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  const popularTags: Array<{ name: string; count: number }> = popularTagsResult.success ? popularTagsResult.data || [] : [];

  const selectedCategoryName = resolvedSearchParams.category
    ? categories.find((cat) => cat.slug === resolvedSearchParams.category)?.name
    : null;
    
  const selectedTag = resolvedSearchParams.tag;

  const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Structured data oluştur
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const blogSchema = generateBlogSchema();
  
  // Breadcrumb schema'sı oluştur (kategori/tag sayfaları için)
  let breadcrumbSchema = null;
  if (selectedCategoryName || selectedTag) {
    const { generateBreadcrumbSchema } = await import("@/lib/utils/structured-data");
    const breadcrumbItems = [
      { name: 'Blog', url: baseUrl }
    ];
    
    if (selectedCategoryName) {
      breadcrumbItems.push({ 
        name: selectedCategoryName, 
        url: `${baseUrl}/?category=${resolvedSearchParams.category}` 
      });
    } else if (selectedTag) {
      breadcrumbItems.push({ 
        name: `#${selectedTag}`, 
        url: `${baseUrl}/?tag=${encodeURIComponent(selectedTag)}` 
      });
    }
    
    breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  }

  return (
    <ImageKitProvider urlEndpoint={imagekitUrlEndpoint || ''}>
      <StructuredData data={breadcrumbSchema ? [websiteSchema, organizationSchema, blogSchema, breadcrumbSchema] : [websiteSchema, organizationSchema, blogSchema]} />
      <div className="max-w-7xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start justify-between gap-x-4">
        <div className="w-5/6">
          {/* Breadcrumb for filtered pages */}
          {(selectedCategoryName || selectedTag) && (
            <Breadcrumb 
              items={[
                ...(selectedCategoryName ? [{ 
                  label: selectedCategoryName, 
                  href: `/?category=${resolvedSearchParams.category}` 
                }] : []),
                ...(selectedTag ? [{ 
                  label: `#${selectedTag}`, 
                  href: `/?tag=${encodeURIComponent(selectedTag)}` 
                }] : [])
              ]}
              className="mb-6" 
            />
          )}
          
          <div className="">
            <h2 className="text-3xl font-bold tracking-tight">
              {selectedCategoryName
                ? `${selectedCategoryName} Gönderileri`
                : selectedTag
                ? `#${selectedTag} Etiketli Gönderiler`
                : ""}
            </h2>
            
            {/* Post sayısı ve açıklama */}
            {(selectedCategoryName || selectedTag) && (
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground">
                  {posts.length} gönderi bulundu
                  {selectedCategoryName && (
                    <span className="ml-2">
                      • {categories.find(cat => cat.slug === resolvedSearchParams.category)?.description || 
                        `${selectedCategoryName} kategorisindeki tüm yazılar`}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="ml-2">
                      • #{selectedTag} etiketi ile işaretlenmiş yazılar
                    </span>
                  )}
                </p>
                
                {/* İlgili kategoriler/taglar */}
                {selectedCategoryName && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">İlgili kategoriler:</span>
                    {categories
                      .filter(cat => cat.slug !== resolvedSearchParams.category)
                      .slice(0, 3)
                      .map(cat => (
                        <Link key={cat.id} href={`/?category=${cat.slug}`}>
                          <span className="text-sm bg-muted hover:bg-muted/80 px-2 py-1 rounded cursor-pointer transition-colors">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
                
                {selectedTag && popularTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">İlgili etiketler:</span>
                    {popularTags
                      .filter(tag => tag.name !== selectedTag)
                      .slice(0, 4)
                      .map(tag => (
                        <Link key={tag.name} href={`/?tag=${encodeURIComponent(tag.name)}`}>
                          <span className="text-sm bg-muted hover:bg-muted/80 px-2 py-1 rounded cursor-pointer transition-colors">
                            #{tag.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* @ts-expect-error Type mismatch will be fixed later */}
          <BlogList posts={posts} />
          
          {/* Sayfalama */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12">
              {/* Desktop sayfalama */}
              <div className="hidden sm:block">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  baseUrl="/"
                  searchParams={new URLSearchParams(
                    Object.entries(resolvedSearchParams).filter(([_, value]) => value !== undefined) as [string, string][]
                  )}
                />
              </div>
              
              {/* Mobil sayfalama */}
              <div className="block sm:hidden">
                <MobilePagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  baseUrl="/"
                  searchParams={new URLSearchParams(
                    Object.entries(resolvedSearchParams).filter(([_, value]) => value !== undefined) as [string, string][]
                  )}
                />
              </div>
              
              {/* Sayfalama bilgisi */}
              <div className="mt-4 text-center">
                <PaginationInfo
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                />
              </div>
            </div>
          )}
        </div>
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
          <Sidebar
            categories={categories}
            popularTags={popularTags}
            selectedCategory={resolvedSearchParams.category}
            selectedTag={resolvedSearchParams.tag}
          />
        </aside>
      </div>
    </ImageKitProvider>
  );
};

export default BlogPage;
