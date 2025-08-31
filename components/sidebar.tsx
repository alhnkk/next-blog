"use client";

import {
    BrainCog,
    Clapperboard,
    Newspaper,
    NotebookPen,
    Pen,
    SquareActivity,
    Hash,
  } from "lucide-react";
  
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
  };
}

interface SidebarProps {
  categories: Category[];
  selectedCategory?: string;
}

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  pen: Pen,
  clapperboard: Clapperboard,
  newspaper: Newspaper,
  notebookpen: NotebookPen,
  braincog: BrainCog,
  squareactivity: SquareActivity,
  hash: Hash,
};

const Sidebar = ({ categories, selectedCategory }: SidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedCategory === categorySlug) {
      // Aynı kategoriye tıklanırsa filtreyi kaldır
      params.delete('category');
    } else {
      // Yeni kategori seç
      params.set('category', categorySlug);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };



  if (categories.length === 0) {
    return (
      <div className="ml-16">
        <h3 className="text-3xl font-bold tracking-tight">Kategoriler</h3>
        <p className="mt-4 text-muted-foreground">Henüz kategori bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="ml-16">
      <h3 className="text-3xl font-bold tracking-tight">Kategoriler</h3>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
        {/* Kategoriler */}
        {categories.map((category) => {
          const IconComponent = category.icon ? iconMap[category.icon.toLowerCase()] || Hash : Hash;
          const isSelected = selectedCategory === category.slug;
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={cn(
                "flex items-center justify-between gap-2 p-3 rounded-md cursor-pointer hover:bg-muted/80 transition-colors",
                isSelected && "ring-2 ring-primary",
                category.color 
                  ? `bg-[${category.color}]/10 hover:bg-[${category.color}]/20`
                  : "bg-muted"
              )}
              style={{
                backgroundColor: category.color 
                  ? `${category.color}15` 
                  : undefined
              }}
            >
              <div className="flex items-center gap-3">
                <IconComponent 
                  className="h-5 w-5" 
                  style={{ 
                    color: category.color || undefined 
                  }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge className="px-1.5 rounded-full">
                {category._count.posts}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;