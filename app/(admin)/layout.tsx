import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppSidebar from "@/components/admin/app-sidebar";
import AdminNavbar from "@/components/admin/admin-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Session Control
  if (!session) {
    redirect("/login");
  }

  // Role Control
  if (session.user.role !== "admin") {
      redirect("/unauthorized");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
          <AdminNavbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};
export default AdminLayout;
