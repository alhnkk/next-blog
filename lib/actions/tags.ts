"use server";

import { prismadb } from "@/lib/prismadb";
import { PostStatus } from "@/lib/generated/prisma";

// GET POPULAR TAGS
export async function getPopularTags(limit: number = 10) {
  try {
    // ✅ OPTIMIZED: Tüm postları getirmek yerine aggregate kullan
    const popularTags = await prismadb.$queryRaw<{ tag: string; count: bigint }[]>`
      SELECT tag, COUNT(*) as count
      FROM (
        SELECT UNNEST(tags) as tag
        FROM post
        WHERE status = 'PUBLISHED'
      ) tag_unnest
      GROUP BY tag
      ORDER BY count DESC
      LIMIT ${limit}
    `;

    return {
      success: true,
      data: popularTags.map((row) => ({
        name: row.tag,
        count: Number(row.count),
      })),
    };
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    // Fallback: Eğer raw query çalışmazsa, alternatif yol
    try {
      const posts = await prismadb.post.findMany({
        where: {
          status: 'PUBLISHED',
          tags: {
            isEmpty: false,
          },
        },
        select: {
          tags: true,
        },
      });

      const tagCounts: Record<string, number> = {};
      
      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

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
    } catch (fallbackError) {
      console.error("Error in fallback tag fetching:", fallbackError);
      return {
        success: false,
        error: "Popüler etiketler getirilirken hata oluştu",
      };
    }
  }
}