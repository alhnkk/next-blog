import {
  Book,
  Search,
  Settings,
  Inbox,
  Folder,
  Users,
  PlusCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import UserNav from "@/components/user-nav";

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem className="">
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image
                  src="/logo.jpeg"
                  alt="logo"
                  width={24}
                  height={24}
                  className="aspect-square rounded-full"
                />
                <span className="group-data-[collapsible=icon]:hidden text-lg font-semibold">
                  Jurnalize
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
            
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="border border-border justify-center my-2"
                  asChild
                >
                  <Link href="/admin/posts/new">
                    <PlusCircle />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Yeni Gönderi
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>İÇERİK</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/posts">
                    <Book />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Gönderiler
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Folder />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Kategoriler
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Search />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Arama
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>YÖNETİM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/users">
                    <Users />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Üyeler
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Inbox />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Mesajlar
                    </span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>10</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Ayarlar
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem  className="mx-auto my-3">
            <UserNav />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
