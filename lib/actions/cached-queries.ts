import { unstable_cache } from 'next/cache';
import { prismadb } from '@/lib/prismadb';
import { PostStatus } from '@/lib/generated/prisma';
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/cache';

// ============================================
// CACHED QUERIES - Yüksek performanslı sorgular
// ============================================

// Yayınlanan postları getir (cache'li)
export const getCachedPublishedPosts = unstable_cache(
  async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const [posts, totalCount] = await Promise.all([
      prismadb.post.findMany({
        where: {
          status: PostStatus.PUBLISHED,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featured: true,
          featuredImageUrl: true,
          featuredImageAlt: true,
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
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prismadb.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },
  ['published-posts'],
  {
    revalidate: CACHE_TIMES.MEDIUM, // 5 dakika
    tags: [CACHE_TAGS.POSTS],
  }
);

// Kategorileri getir (cache'li)
export const getCachedCategories = unstable_cache(
  async () => {
    const categories = await prismadb.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: categories,
    };
  },
  ['categories'],
  {
    revalidate: CACHE_TIMES.LONG, // 1 saat
    tags: [CACHE_TAGS.CATEGORIES],
  }
);

// Popüler tagları getir (cache'li)
export const getCachedPopularTags = unstable_cache(
  async (limit: number = 10) => {
    try {
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
    } catch {
      // Fallback
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
    }
  },
  ['popular-tags'],
  {
    revalidate: CACHE_TIMES.LONG, // 1 saat
    tags: [CACHE_TAGS.TAGS],
  }
);

// Kategori slug'ına göre postları getir (cache'li)
export const getCachedPostsByCategorySlug = unstable_cache(
  async (categorySlug: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prismadb.post.findMany({
        where: {
          category: {
            slug: categorySlug,
          },
          status: PostStatus.PUBLISHED,
        },
        select: {
          id: true,
          title: true,
          content: true,
          slug: true,
          excerpt: true,
          featured: true,
          featuredImageUrl: true,
          featuredImageAlt: true,
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
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prismadb.post.count({
        where: {
          category: {
            slug: categorySlug,
          },
          status: PostStatus.PUBLISHED,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },
  ['posts-by-category'],
  {
    revalidate: CACHE_TIMES.MEDIUM,
    tags: [CACHE_TAGS.POSTS, CACHE_TAGS.CATEGORIES],
  }
);

// Tag'e göre postları getir (cache'li)
export const getCachedPostsByTag = unstable_cache(
  async (tag: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prismadb.post.findMany({
        where: {
          tags: {
            has: tag,
          },
          status: PostStatus.PUBLISHED,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featured: true,
          featuredImageUrl: true,
          featuredImageAlt: true,
          status: true,
          tags: true,
          createdAt: true,
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
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prismadb.post.count({
        where: {
          tags: {
            has: tag,
          },
          status: PostStatus.PUBLISHED,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },
  ['posts-by-tag'],
  {
    revalidate: CACHE_TIMES.MEDIUM,
    tags: [CACHE_TAGS.POSTS, CACHE_TAGS.TAGS],
  }
);

// Post detayını getir (cache'li)
export const getCachedPostBySlug = unstable_cache(
  async (slug: string) => {
    const post = await prismadb.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        featuredImageUrl: true,
        featuredImageAlt: true,
        status: true,
        tags: true,
        authorId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            color: true,
            icon: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: 'Gönderi bulunamadı',
      };
    }

    return {
      success: true,
      data: post,
    };
  },
  ['post-by-slug'],
  {
    revalidate: CACHE_TIMES.LONG, // 1 saat
    tags: [CACHE_TAGS.POST_DETAIL],
  }
);

// İlgili postları getir (cache'li)
export const getCachedRelatedPosts = unstable_cache(
  async (postId: number, categoryId: number | null | undefined, tags: string[] = [], limit: number = 3) => {
    if (!categoryId && tags.length === 0) {
      const posts = await prismadb.post.findMany({
        where: {
          status: PostStatus.PUBLISHED,
          id: {
            not: postId,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImageUrl: true,
          featuredImageAlt: true,
          tags: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      return {
        success: true,
        data: posts,
      };
    }

    const relatedPosts = await prismadb.post.findMany({
      where: {
        AND: [
          { status: PostStatus.PUBLISHED },
          { id: { not: postId } },
          {
            OR: [
              ...(categoryId ? [{ categoryId }] : []),
              ...(tags.length > 0 ? [{ tags: { hasSome: tags } }] : []),
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImageUrl: true,
        featuredImageAlt: true,
        tags: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return {
      success: true,
      data: relatedPosts,
    };
  },
  ['related-posts'],
  {
    revalidate: CACHE_TIMES.LONG,
    tags: [CACHE_TAGS.POSTS],
  }
);

// Tüm yayınlanmış post slug'larını getir (generateStaticParams için)
export const getCachedAllPostSlugs = unstable_cache(
  async () => {
    const posts = await prismadb.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
      },
      select: {
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  },
  ['all-post-slugs'],
  {
    revalidate: CACHE_TIMES.LONG,
    tags: [CACHE_TAGS.POSTS],
  }
);

