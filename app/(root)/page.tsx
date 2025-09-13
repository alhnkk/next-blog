import BlogList from "@/components/blog-list";
import Sidebar from "@/components/sidebar";
import { getPublishedPosts, getPostsByCategorySlug } from "@/lib/actions/posts";
import { getCategories } from "@/lib/actions/categories";
import { auth } from "@/lib/auth";
import { ImageKitProvider } from "@imagekit/next";
import { generateWebSiteSchema, generateOrganizationSchema, generateBlogSchema } from "@/lib/utils/structured-data";
import { StructuredData } from "@/components/seo/structured-data";
import { generateHomePageMetadata, generateCategoryMetadata } from "@/lib/utils/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  
  if (resolvedSearchParams.category) {
    const categoriesResult = await getCategories();
    const categories = categoriesResult.success ? categoriesResult.data || [] : [];
    const selectedCategory = categories.find((cat) => cat.slug === resolvedSearchParams.category);
    
    if (selectedCategory) {
      return generateCategoryMetadata(selectedCategory);
    }
  }
  
  return generateHomePageMetadata();
}

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  
  // Session bilgisini al
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
    console.log("Session alınamadı:", error);
  }
  
  // Kategori filtresi varsa sadece o kategorinin postlarını getir, yoksa tüm postları getir
  const [postsResult, categoriesResult] = await Promise.all([
    resolvedSearchParams.category
      ? getPostsByCategorySlug(resolvedSearchParams.category, "PUBLISHED")
      : getPublishedPosts(),
    getCategories(),
  ]);

  const posts = postsResult.success ? postsResult.data || [] : [];
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  const selectedCategoryName = resolvedSearchParams.category
    ? categories.find((cat) => cat.slug === resolvedSearchParams.category)?.name
    : null;

  const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  // Structured data oluştur
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const blogSchema = generateBlogSchema();

  return (
    <ImageKitProvider urlEndpoint={imagekitUrlEndpoint || ''}>
      <StructuredData data={[websiteSchema, organizationSchema, blogSchema]} />
      <div className="max-w-7xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start justify-between gap-x-4">
        <div className="w-5/6">
          <h2 className="text-3xl font-bold tracking-tight">
            {selectedCategoryName
              ? `${selectedCategoryName} Gönderileri`
              : "Gönderiler"}
          </h2>
          <BlogList posts={posts} currentUser={currentUser} />
        </div>
        <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
          <Sidebar
            categories={categories}
            selectedCategory={resolvedSearchParams.category}
          />
        </aside>
      </div>
    </ImageKitProvider>
  );
};

export default BlogPage;
