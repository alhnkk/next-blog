"use client";

import { useEffect, useState } from "react";
import { enhanceContentWithInternalLinks } from "@/lib/utils/internal-links";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  name: string;
  count: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
}

interface EnhancedContentProps {
  content: string;
  categories: Category[];
  popularTags: Tag[];
  relatedPosts: Post[];
  currentPostId: number;
  className?: string;
}

export function EnhancedContent({
  content,
  categories,
  popularTags,
  relatedPosts,
  currentPostId,
  className = ""
}: EnhancedContentProps) {
  const [enhancedContent, setEnhancedContent] = useState(content);

  useEffect(() => {
    try {
      const enhanced = enhanceContentWithInternalLinks(
        content,
        categories,
        popularTags,
        relatedPosts,
        currentPostId
      );
      setEnhancedContent(enhanced);
    } catch (error) {
      console.error("İç link enhancement hatası:", error);
      setEnhancedContent(content);
    }
  }, [content, categories, popularTags, relatedPosts, currentPostId]);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: enhancedContent }}
      />
      
      <style jsx global>{`
        .internal-link {
          position: relative;
        }
        
        .internal-link:hover {
          text-decoration: underline;
        }
        
        .internal-link:after {
          content: "";
          font-size: 0.75em;
          margin-left: 2px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
