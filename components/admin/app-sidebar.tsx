"use client";

import {
  Book,
  Settings,
  Inbox,
  Folder,
  Users,
  PlusCircle,
  MessageSquare,
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
import { useState, useEffect } from "react";
import { getUnreadMessageCount } from "@/lib/actions/messages";

const AppSidebar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadMessageCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error loading unread message count:", error);
      }
    };

    loadUnreadCount();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
                  <Link href="/admin/categories">
                    <Folder />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Kategoriler
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/comments">
                    <MessageSquare />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Yorumlar
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
                  <Link href="/admin/messages">
                    <Inbox />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Mesajlar
                    </span>
                  </Link>
                </SidebarMenuButton>
                {unreadCount > 0 && (
                  <SidebarMenuBadge className="bg-red-500 text-white">
                    {unreadCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/settings">
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
          <SidebarMenuItem className="mx-auto my-3">
            <UserNav />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
