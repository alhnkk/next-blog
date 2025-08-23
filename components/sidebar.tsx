import {
    BrainCog,
    Clapperboard,
    Newspaper,
    NotebookPen,
    Pen,
    SquareActivity,
  } from "lucide-react";
  

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
    {
      name: "Edebiyat",
      totalPosts: 10,
      icon: Pen,
      background: "bg-indigo-500/25",
      color: "text-indigo-500/25",
    },
    {
      name: "Sinema",
      totalPosts: 5,
      icon: Clapperboard,
      background: "bg-amber-500/25",
      color: "text-amber-500/25",
    },
    {
      name: "Gündem",
      totalPosts: 8,
      icon: Newspaper,
      background: "bg-emerald-500/25",
      color: "text-emerald-500/25",
    },
    {
      name: "Günlük",
      totalPosts: 12,
      icon: NotebookPen,
      background: "bg-rose-500/25",
      color: "text-rose-500/25",
    },
    {
      name: "Psikoloji",
      totalPosts: 15,
      icon: BrainCog,
      background: "bg-cyan-500/25",
      color: "text-cyan-500/25",
    },
    {
      name: "Felsefe",
      totalPosts: 20,
      icon: SquareActivity,
      background: "bg-teal-500/25",
      color: "text-teal-500/25",
    },
   
  ];

const Sidebar = () => {
  return (
    <div className="ml-16">
    <h3 className="text-3xl font-bold tracking-tight">Kategoriler</h3>
    <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
      {categories.map((category) => (
        <div
          key={category.name}
          className={cn(
            "flex items-center justify-between gap-2 bg-muted p-3 rounded-md bg-opacity-15 dark:bg-opacity-25",
            category.background
          )}
        >
          <div className="flex items-center gap-3">
            <category.icon className={cn("h-5 w-5", category.color)} />
            <span className="font-medium">{category.name}</span>
          </div>
          <Badge className="px-1.5 rounded-full">
            {category.totalPosts}
          </Badge>
        </div>
      ))}
    </div>
  </div>
  )
}

export default Sidebar