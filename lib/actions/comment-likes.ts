"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// TOGGLE COMMENT LIKE
export async function toggleCommentLike(commentId: number) {
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

    // Comment var mı kontrol et
    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: { id: true, postId: true, post: { select: { slug: true } } },
    });

    if (!comment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    // Mevcut beğeni var mı kontrol et
    const existingLike = await prismadb.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: commentId,
        },
      },
    });

    if (existingLike) {
      // Beğeniyi kaldır
      await prismadb.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Güncel beğeni sayısını al
      const likeCount = await prismadb.commentLike.count({
        where: { commentId: commentId },
      });

      revalidatePath(`/blog/${comment.post.slug}`);
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
      await prismadb.commentLike.create({
        data: {
          userId: session.user.id,
          commentId: commentId,
        },
      });

      // Güncel beğeni sayısını al
      const likeCount = await prismadb.commentLike.count({
        where: { commentId: commentId },
      });

      revalidatePath(`/blog/${comment.post.slug}`);
      revalidatePath("/");

      return {
        success: true,
        data: {
          liked: true,
          likeCount: likeCount,
        },
        message: "Yorum beğenildi",
      };
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return {
      success: false,
      error: "Beğeni işlemi sırasında hata oluştu",
    };
  }
}

// GET COMMENT LIKE STATUS
export async function getCommentLikeStatus(commentId: number) {
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
    const userLike = await prismadb.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: commentId,
        },
      },
    });

    // Toplam beğeni sayısını al
    const likeCount = await prismadb.commentLike.count({
      where: { commentId: commentId },
    });

    return {
      success: true,
      data: {
        liked: !!userLike,
        likeCount: likeCount,
      },
    };
  } catch (error) {
    console.error("Error getting comment like status:", error);
    return {
      success: false,
      error: "Beğeni durumu alınırken hata oluştu",
    };
  }
}

// GET COMMENT LIKES WITH USERS
export async function getCommentLikes(commentId: number, page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      prismadb.commentLike.findMany({
        where: { commentId: commentId },
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
      prismadb.commentLike.count({
        where: { commentId: commentId },
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
    console.error("Error getting comment likes:", error);
    return {
      success: false,
      error: "Beğeniler alınırken hata oluştu",
    };
  }
}
