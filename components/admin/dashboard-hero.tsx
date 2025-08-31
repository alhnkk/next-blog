"use client";

import Image from "next/image";
import Link from "next/link";
import { CirclePlus, Folder, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const DashboardHero = () => {
  const { theme } = useTheme();

  const backgroundImage =
    theme === "light" ? "/placeholder2.jpeg" : "/placeholder.jpeg";

  return (
    <div className="relative grid rounded-md lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <Image
        className="absolute grayscale-75 rounded-md z-0"
        src={backgroundImage}
        alt="Dashboard Background"
        fill
      />
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
  );
};

export default DashboardHero;
