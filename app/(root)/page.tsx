import BlogList from "@/components/blog-list";
import Sidebar from "@/components/sidebar";

const BlogPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 lg:py-16 px-6 xl:px-0 flex flex-col lg:flex-row items-start justify-between gap-x-4">
      <div className="w-5/6">
        <h2 className="text-3xl font-bold tracking-tight">Gönderiler</h2>
        <BlogList />
      </div>
      <aside  className="sticky top-8 shrink-0 lg:max-w-sm w-full">
      <Sidebar />
      </aside>
    </div>
  );
};

export default BlogPage;
