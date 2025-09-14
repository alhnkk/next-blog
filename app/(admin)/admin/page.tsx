"use client";

import Image from "next/image";
import Link from "next/link";
import { CirclePlus, Folder, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { AppBarChart } from "@/components/admin/app-bar-chart";
import AppPieChart from "@/components/admin/app-pie-chart";
import CardList from "@/components/admin/card-list";
import { RecentComments } from "@/components/admin/recent-comments";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { theme } = useTheme();
  
  const backgroundImage = theme === "light" 
    ? "https://images.pexels.com/photos/313563/sand-pattern-wave-texture-313563.jpeg"
    : "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg";

  return <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
    <div className="relative grid rounded-md lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <Image 
      className="absolute grayscale-75 rounded-md z-0"
      src={backgroundImage}
      alt="Dashboard Background" 
      fill 
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
      {/* <AppAreaChart /> */}
      <Image 
      className="rounded-full z-0 flex m-auto"
      src="/logo.jpeg" 
      alt="Dashboard Background" 
      width={256}
      height={256}
      />
      <div className="grid grid-cols-10 z-50 gap-4 items-end m-4">
        <Link href="/admin/posts/new" className="col-span-4">
          <Button className="w-full bg-background/80 p-4 rounded-md h-24 text-foreground hover:text-background">
            <CirclePlus />
            Yeni Gönderi Ekle
          </Button>
        </Link>
        <Link href="/admin/messages" className="col-span-3">
          <Button className="w-full bg-background/80 p-4 rounded-md h-24 text-foreground hover:text-background">
            <MessageCircle />
            Mesajları Görüntüle
          </Button>
        </Link>
        <Link href="/admin/categories" className="col-span-3">
          <Button className="w-full bg-background/80 p-4 rounded-md h-24 text-foreground hover:text-background">
            <Folder />
            Kategori Yönetimi
          </Button>
        </Link>
        
      </div>

    </div>
    <div className="bg-primary-foreground p-4 rounded-md"><CardList title="Son Üyeler" /></div>
    <div className="bg-primary-foreground p-4 rounded-md"><AppPieChart /></div>
    <div className="bg-primary-foreground p-4 rounded-md"><RecentComments /></div>
    <div className="bg-primary-foreground p-4 rounded-md lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <AppBarChart />
    </div>
    <div className="bg-primary-foreground p-4 rounded-md"><CardList title="Son Mesajlar" /></div>
  </div>
};

export default AdminDashboard;
