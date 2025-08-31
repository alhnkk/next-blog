"use server";

import { prismadb } from "@/lib/prismadb";
import { PostStatus } from "@/lib/generated/prisma";

// GET POPULAR TAGS
export async function getPopularTags(limit: number = 10) {
  try {
    // Tüm yayınlanmış postların etiketlerini al
    const posts = await prismadb.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        tags: {
          not: {
            equals: [],
          },
        },
      },
      select: {
        tags: true,
      },
    });

    // Etiketleri say
    const tagCounts: Record<string, number> = {};
    
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // En popüler etiketleri sırala
    const popularTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({
        name: tag,
        count,
      }));

    return {
      success: true,
      data: popularTags,
    };
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    return {
      success: false,
      error: "Popüler etiketler getirilirken hata oluştu",
    };
  }
}

// GET POSTS BY TAG
export async function getPostsByTag(tag: string) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        tags: {
          has: tag,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured: true,
        status: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                approved: true,
              },
            },
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return {
      success: false,
      error: "Etiket gönderileri getirilirken hata oluştu",
    };
  }
}