"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
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

interface PopularTag {
  name: string;
  count: number;
}

interface SidebarProps {
  categories: Category[];
  popularTags?: PopularTag[];
  selectedCategory?: string;
  selectedTag?: string;
}

const Sidebar = ({ categories, popularTags = [], selectedCategory, selectedTag }: SidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategory === categorySlug) {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
      params.delete("tag");
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedTag === tagName) {
      params.delete("tag");
    } else {
      params.set("tag", tagName);
      params.delete("category");
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  if (categories.length === 0) {
    return (
      <div className="pl-8 border-l border-border/50">
        <p className="text-sm text-muted-foreground">Henüz kategori bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="pl-8 border-l border-border/50 space-y-8">
      {/* Kategoriler */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Kategoriler</p>
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.slug;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={cn(
                  "flex items-center justify-between text-sm cursor-pointer transition-colors",
                  isSelected 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{category.name}</span>
                <span className="text-xs text-muted-foreground/70">{category._count.posts}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Popüler Etiketler */}
      {popularTags.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Etiketler</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {popularTags.map((tag) => {
              const isSelected = selectedTag === tag.name;
              return (
                <span
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={cn(
                    "text-xs cursor-pointer transition-colors",
                    isSelected 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  #{tag.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Reklam Alanı */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Reklam</p>
        <div className="border border-dashed border-border/60 rounded-sm p-4 flex flex-col items-center justify-center min-h-[180px] bg-muted/20">
          <span className="text-xs text-muted-foreground/50">Reklam alanı</span>
          <span className="text-[10px] text-muted-foreground/30 mt-1 font-mono">300 × 250</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);