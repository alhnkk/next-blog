"use server";

import { prismadb } from "../prismadb";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

// TOGGLE POST LIKE
export async function togglePostLike(postId: number) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Beğenmek için giriş yapmalısınız",
      };
    }

    // Post var mı kontrol et
    const post = await prismadb.post.findUnique({
      where: { id: postId },
      select: { id: true, status: true, slug: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Gönderi bulunamadı",
      };
    }

    if (post.status !== "PUBLISHED") {
      return {
        success: false,
        error: "Bu gönderiyi beğenemezsiniz",
      };
    }

    // Mevcut beğeni var mı kontrol et
    const existingLike = await prismadb.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // Beğeniyi kaldır
      await prismadb.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Güncel beğeni sayısını al
      const likeCount = await prismadb.like.count({
        where: { postId: postId },
      });

      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/");

      return {
        success: true,
        data: {
          liked: false,
          likeCount: likeCount,
        },
        message: "Beğeni kaldırıldı",
      };
    } else {
      // Beğeni ekle
      await prismadb.like.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });

      // Güncel beğeni sayısını al
      const likeCount = await prismadb.like.count({
        where: { postId: postId },
      });

      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/");

      return {
        success: true,
        data: {
          liked: true,
          likeCount: likeCount,
        },
        message: "Gönderi beğenildi",
      };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return {
      success: false,
      error: "Beğeni işlemi sırasında hata oluştu",
    };
  }
}

// GET POST LIKE STATUS
export async function getPostLikeStatus(postId: number) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return {
        success: true,
        data: {
          liked: false,
          likeCount: 0,
        },
      };
    }

    // Kullanıcının beğenisi var mı kontrol et
    const userLike = await prismadb.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    // Toplam beğeni sayısını al
    const likeCount = await prismadb.like.count({
      where: { postId: postId },
    });

    return {
      success: true,
      data: {
        liked: !!userLike,
        likeCount: likeCount,
      },
    };
  } catch (error) {
    console.error("Error getting post like status:", error);
    return {
      success: false,
      error: "Beğeni durumu alınırken hata oluştu",
    };
  }
}

// GET LIKED POSTS BY USER
export async function getLikedPostsByUser(userId?: string) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return {
        success: false,
        error: "Kullanıcı bulunamadı",
      };
    }

    const likedPosts = await prismadb.like.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            status: true,
            tags: true,
            featured: true,
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
                likes: true,
                comments: {
                  where: {
                    approved: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: likedPosts.map(like => like.post),
    };
  } catch (error) {
    console.error("Error getting liked posts:", error);
    return {
      success: false,
      error: "Beğenilen gönderiler alınırken hata oluştu",
    };
  }
}

// GET POST LIKES WITH USERS
export async function getPostLikes(postId: number, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      prismadb.like.findMany({
        where: { postId: postId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prismadb.like.count({
        where: { postId: postId },
      }),
    ]);

    return {
      success: true,
      data: {
        likes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error getting post likes:", error);
    return {
      success: false,
      error: "Beğeniler alınırken hata oluştu",
    };
  }
}