"use client";

import { useEffect, useState } from "react";
import { enhanceContentWithInternalLinks } from "@/lib/utils/internal-links";

interface Post {
  id: number;
  title: string;
  slug: string;
}

interface EnhancedContentProps {
  content: string;
  relatedPosts: Post[];
  currentPostId: number;
  className?: string;
}

export function EnhancedContent({
  content,
  relatedPosts,
  currentPostId,
  className = ""
}: EnhancedContentProps) {
  const [enhancedContent, setEnhancedContent] = useState(content);

  useEffect(() => {
    try {
      // Simple HTML sanitization - just render as is for now
      // Internal links can be added client-side if needed
      setEnhancedContent(content);
    } catch (error) {
      console.error("Content rendering hatası:", error);
      setEnhancedContent(content);
    }
  }, [content]);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="leading-relaxed text-base"
        dangerouslySetInnerHTML={{ __html: enhancedContent }}
      />
      
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.2;
        }
        
        .blog-content h1 { font-size: 2em; }
        .blog-content h2 { font-size: 1.5em; }
        .blog-content h3 { font-size: 1.25em; }
        
        .blog-content p {
          margin-bottom: 1em;
          line-height: 1.7;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin-left: 2em;
          margin-bottom: 1em;
        }
        
        .blog-content li {
          margin-bottom: 0.5em;
          line-height: 1.6;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
          margin: 1.5em 0;
        }
        
        .blog-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #1e40af;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1.5em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1.5em 0;
          line-height: 1.5;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5em;
          margin: 1.5em 0;
          color: #6b7280;
          font-style: italic;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        
        .blog-content th,
        .blog-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75em;
          text-align: left;
        }
        
        .blog-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
