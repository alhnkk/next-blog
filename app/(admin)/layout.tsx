import AppSidebar from "@/components/admin/app-sidebar";
import Navbar from "@/components/admin/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="en">
      <body className="flex">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
};
export default AdminLayout;
