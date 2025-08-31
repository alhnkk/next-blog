import BlogList from "@/components/blog-list";
import Sidebar from "@/components/sidebar";
import { getPublishedPosts, getPostsByCategorySlug } from "@/lib/actions/posts";
import { getCategories } from "@/lib/actions/categories";

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  
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
  return (
    <div className="max-w-7xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start justify-between gap-x-4">
      <div className="w-5/6">
        <h2 className="text-3xl font-bold tracking-tight">
          {selectedCategoryName
            ? `${selectedCategoryName} Gönderileri`
            : "Gönderiler"}
        </h2>
        <BlogList posts={posts} />
      </div>
      <aside className="sticky top-8 shrink-0 lg:max-w-sm w-full">
        <Sidebar
          categories={categories}
          selectedCategory={resolvedSearchParams.category}
        />
      </aside>
    </div>
  );
};

export default BlogPage;
