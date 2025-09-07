"use server";

import { prismadb } from "../prismadb";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

// GET COMMENTS BY POST ID
export async function getCommentsByPostId(postId: number) {
  try {
    const comments = await prismadb.comment.findMany({
      where: {
        postId: postId,
        approved: true,
        parentId: null, // Sadece ana yorumları al
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          where: {
            approved: true,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: {
                approved: true,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      success: false,
      error: "Yorumlar yüklenirken hata oluştu",
    };
  }
}

// CREATE COMMENT
export async function createComment(data: {
  content: string;
  postId: number;
  parentId?: number;
}) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Yorum yapmak için giriş yapmalısınız",
      };
    }

    // İçerik kontrolü
    if (!data.content || data.content.trim().length < 3) {
      return {
        success: false,
        error: "Yorum en az 3 karakter olmalıdır",
      };
    }

    if (data.content.length > 1000) {
      return {
        success: false,
        error: "Yorum 1000 karakterden uzun olamaz",
      };
    }

    // Post var mı kontrol et
    const post = await prismadb.post.findUnique({
      where: { id: data.postId },
      select: { id: true, status: true },
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
        error: "Bu gönderiye yorum yapılamaz",
      };
    }

    // Eğer yanıt ise, ana yorum var mı kontrol et
    if (data.parentId) {
      const parentComment = await prismadb.comment.findUnique({
        where: { id: data.parentId },
        select: { id: true, postId: true },
      });

      if (!parentComment || parentComment.postId !== data.postId) {
        return {
          success: false,
          error: "Geçersiz ana yorum",
        };
      }
    }

    const comment = await prismadb.comment.create({
      data: {
        content: data.content.trim(),
        authorId: session.user.id,
        postId: data.postId,
        parentId: data.parentId || null,
        approved: true, // Otomatik onay, admin panelinde değiştirilebilir
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/blog/[slug]`, "page");
    revalidatePath("/");

    return {
      success: true,
      data: comment,
      message: "Yorumunuz başarıyla eklendi",
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      error: "Yorum eklenirken hata oluştu",
    };
  }
}

// UPDATE COMMENT
export async function updateComment(commentId: number, content: string) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Bu işlem için giriş yapmalısınız",
      };
    }

    // İçerik kontrolü
    if (!content || content.trim().length < 3) {
      return {
        success: false,
        error: "Yorum en az 3 karakter olmalıdır",
      };
    }

    if (content.length > 1000) {
      return {
        success: false,
        error: "Yorum 1000 karakterden uzun olamaz",
      };
    }

    // Yorum var mı ve kullanıcının yorumu mu kontrol et
    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        authorId: true, 
        postId: true,
        createdAt: true,
      },
    });

    if (!comment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    if (comment.authorId !== session.user.id) {
      return {
        success: false,
        error: "Bu yorumu düzenleme yetkiniz yok",
      };
    }

    // 15 dakika sonra düzenleme yapılamaz
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.createdAt < fifteenMinutesAgo) {
      return {
        success: false,
        error: "Yorumlar sadece 15 dakika içinde düzenlenebilir",
      };
    }

    const updatedComment = await prismadb.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/blog/[slug]`, "page");

    return {
      success: true,
      data: updatedComment,
      message: "Yorumunuz başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    return {
      success: false,
      error: "Yorum güncellenirken hata oluştu",
    };
  }
}

// DELETE COMMENT
export async function deleteComment(commentId: number) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Bu işlem için giriş yapmalısınız",
      };
    }

    // Yorum var mı ve kullanıcının yorumu mu kontrol et
    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        authorId: true, 
        postId: true,
        replies: {
          select: { id: true },
        },
      },
    });

    if (!comment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    // Kullanıcı kendi yorumunu silebilir veya admin olabilir
    const user = await prismadb.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isOwner = comment.authorId === session.user.id;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: "Bu yorumu silme yetkiniz yok",
      };
    }

    // Eğer yorumun yanıtları varsa, sadece içeriği sil
    if (comment.replies.length > 0) {
      await prismadb.comment.update({
        where: { id: commentId },
        data: {
          content: "[Bu yorum silinmiştir]",
          updatedAt: new Date(),
        },
      });
    } else {
      // Yanıt yoksa tamamen sil
      await prismadb.comment.delete({
        where: { id: commentId },
      });
    }

    revalidatePath(`/blog/[slug]`, "page");

    return {
      success: true,
      message: "Yorum başarıyla silindi",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error: "Yorum silinirken hata oluştu",
    };
  }
}

// GET ALL COMMENTS FOR ADMIN
export async function getAllComments(page = 1, limit = 20) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Bu işlem için giriş yapmalısınız",
      };
    }

    // Admin kontrolü
    const user = await prismadb.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return {
        success: false,
        error: "Bu işlem için admin yetkisi gereklidir",
      };
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prismadb.comment.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prismadb.comment.count(),
    ]);

    return {
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return {
      success: false,
      error: "Yorumlar yüklenirken hata oluştu",
    };
  }
}

// APPROVE/DISAPPROVE COMMENT
export async function toggleCommentApproval(commentId: number) {
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Bu işlem için giriş yapmalısınız",
      };
    }

    // Admin kontrolü
    const user = await prismadb.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return {
        success: false,
        error: "Bu işlem için admin yetkisi gereklidir",
      };
    }

    const comment = await prismadb.comment.findUnique({
      where: { id: commentId },
      select: { id: true, approved: true },
    });

    if (!comment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    const updatedComment = await prismadb.comment.update({
      where: { id: commentId },
      data: {
        approved: !comment.approved,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/comments");
    revalidatePath(`/blog/[slug]`, "page");

    return {
      success: true,
      data: updatedComment,
      message: `Yorum ${updatedComment.approved ? "onaylandı" : "onayı kaldırıldı"}`,
    };
  } catch (error) {
    console.error("Error toggling comment approval:", error);
    return {
      success: false,
      error: "Yorum durumu değiştirilirken hata oluştu",
    };
  }
}