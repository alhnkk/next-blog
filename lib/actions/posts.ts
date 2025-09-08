"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@/lib/generated/prisma";

// Types for post operations
export interface CreatePostData {
  title: string;
  content?: string;
  slug: string;
  excerpt?: string;
  featured?: boolean;
  featuredImageUrl?: string;
  status?: PostStatus;
  tags?: string[];
  authorId: string;
  categoryId?: number;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  featured?: boolean;
  featuredImageUrl?: string;
  status?: PostStatus;
  tags?: string[];
  categoryId?: number;
}

// GET ALL POSTS
export async function getPosts() {
  try {
    const posts = await prismadb.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        featuredImageUrl: true,
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
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      error: "Gönderiler getirilirken hata oluştu",
    };
  }
}

// GET PUBLISHED POSTS (for public use)
export async function getPublishedPosts() {
  try {
    const posts = await prismadb.post.findMany({
      where: {
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
    console.error("Error fetching published posts:", error);
    return {
      success: false,
      error: "Yayınlanan gönderiler getirilirken hata oluştu",
    };
  }
}

// GET POSTS BY AUTHOR
export async function getPostsByAuthor(authorId: string) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        status: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
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
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    return {
      success: false,
      error: "Yazar gönderileri getirilirken hata oluştu",
    };
  }
}

// GET SINGLE POST BY ID
export async function getPostById(postId: number) {
  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        featuredImageUrl: true,
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
        comments: {
          where: {
            approved: true,
            parentId: null, // Only top-level comments
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
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
              select: {
                id: true,
                content: true,
                createdAt: true,
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
            createdAt: "desc",
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
        error: "Gönderi bulunamadı",
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      error: "Gönderi getirilirken hata oluştu",
    };
  }
}

// GET POST BY SLUG
export async function getPostBySlug(slug: string) {
  try {
    const post = await prismadb.post.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        featuredImageUrl: true,
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
        comments: {
          where: {
            approved: true,
            parentId: null,
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
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
              select: {
                id: true,
                content: true,
                createdAt: true,
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
            createdAt: "desc",
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
        error: "Gönderi bulunamadı",
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return {
      success: false,
      error: "Gönderi getirilirken hata oluştu",
    };
  }
}

// CREATE POST
export async function createPost(data: CreatePostData) {
  try {
    // Check if slug already exists
    const existingPost = await prismadb.post.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingPost) {
      return {
        success: false,
        error: "Bu slug zaten kullanılıyor",
      };
    }

    // Verify author exists
    const author = await prismadb.user.findUnique({
      where: {
        id: data.authorId,
      },
    });

    if (!author) {
      return {
        success: false,
        error: "Yazar bulunamadı",
      };
    }

    // Verify category exists if provided
    if (data.categoryId) {
      const category = await prismadb.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        return {
          success: false,
          error: "Kategori bulunamadı",
        };
      }
    }

    const post = await prismadb.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        excerpt: data.excerpt,
        featured: data.featured || false,
        featuredImageUrl: data.featuredImageUrl,
        status: data.status || PostStatus.DRAFT,
        tags: data.tags || [],
        authorId: data.authorId,
        categoryId: data.categoryId,
      },
      select: {
        id: true,
        title: true,
        content: true,
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
            email: true,
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
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return {
      success: true,
      data: post,
      message: "Gönderi başarıyla oluşturuldu",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: "Gönderi oluşturulurken hata oluştu",
    };
  }
}

// UPDATE POST
export async function updatePost(postId: number, data: UpdatePostData) {
  try {
    const existingPost = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!existingPost) {
      return {
        success: false,
        error: "Gönderi bulunamadı",
      };
    }

    // Check if new slug already exists (if slug is being updated)
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prismadb.post.findUnique({
        where: {
          slug: data.slug,
        },
      });

      if (slugExists) {
        return {
          success: false,
          error: "Bu slug zaten kullanılıyor",
        };
      }
    }

    // Verify category exists if provided
    if (data.categoryId) {
      const category = await prismadb.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        return {
          success: false,
          error: "Kategori bulunamadı",
        };
      }
    }

    const updatedPost = await prismadb.post.update({
      where: {
        id: postId,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.slug && { slug: data.slug }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.featuredImageUrl !== undefined && { featuredImageUrl: data.featuredImageUrl }),
        ...(data.status && { status: data.status }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        content: true,
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
            email: true,
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
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existingPost.slug}`);
    if (data.slug && data.slug !== existingPost.slug) {
      revalidatePath(`/blog/${data.slug}`);
    }

    return {
      success: true,
      data: updatedPost,
      message: "Gönderi başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: "Gönderi güncellenirken hata oluştu",
    };
  }
}

// DELETE POST
export async function deletePost(postId: number) {
  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        slug: true,
      },
    });

    if (!post) {
      return {
        success: false,
        error: "Gönderi bulunamadı",
      };
    }

    await prismadb.post.delete({
      where: {
        id: postId,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return {
      success: true,
      message: "Gönderi başarıyla silindi",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: "Gönderi silinirken hata oluştu",
    };
  }
}

// TOGGLE POST FEATURED STATUS
export async function togglePostFeatured(postId: number) {
  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        featured: true,
        slug: true,
      },
    });

    if (!post) {
      return {
        success: false,
        error: "Gönderi bulunamadı",
      };
    }

    const updatedPost = await prismadb.post.update({
      where: {
        id: postId,
      },
      data: {
        featured: !post.featured,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        featured: true,
        slug: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return {
      success: true,
      data: updatedPost,
      message: `Gönderi ${
        updatedPost.featured ? "öne çıkarıldı" : "öne çıkarılmaktan çıkarıldı"
      }`,
    };
  } catch (error) {
    console.error("Error toggling post featured:", error);
    return {
      success: false,
      error: "Gönderi öne çıkarma durumu değiştirilirken hata oluştu",
    };
  }
}

// UPDATE POST STATUS
export async function updatePostStatus(postId: number, status: PostStatus) {
  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        slug: true,
      },
    });

    if (!post) {
      return {
        success: false,
        error: "Gönderi bulunamadı",
      };
    }

    const updatedPost = await prismadb.post.update({
      where: {
        id: postId,
      },
      data: {
        status: status,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        slug: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    const statusMessages = {
      [PostStatus.DRAFT]: "taslak olarak kaydedildi",
      [PostStatus.PUBLISHED]: "yayınlandı",
      [PostStatus.ARCHIVED]: "arşivlendi",
    };

    return {
      success: true,
      data: updatedPost,
      message: `Gönderi ${statusMessages[status]}`,
    };
  } catch (error) {
    console.error("Error updating post status:", error);
    return {
      success: false,
      error: "Gönderi durumu güncellenirken hata oluştu",
    };
  }
}

// GET FEATURED POSTS
export async function getFeaturedPosts(limit: number = 5) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        featured: true,
        status: PostStatus.PUBLISHED,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
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
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return {
      success: false,
      error: "Öne çıkan gönderiler getirilirken hata oluştu",
    };
  }
}

// SEARCH POSTS
export async function searchPosts(query: string, status?: PostStatus) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  hasSome: [query],
                },
              },
            ],
          },
          ...(status ? [{ status: status }] : []),
        ],
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
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error searching posts:", error);
    return {
      success: false,
      error: "Gönderi arama sırasında hata oluştu",
    };
  }
}

// GET POSTS BY CATEGORY
export async function getPostsByCategory(
  categoryId: number,
  status?: PostStatus
) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        categoryId: categoryId,
        ...(status && { status: status }),
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
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return {
      success: false,
      error: "Kategori gönderileri getirilirken hata oluştu",
    };
  }
}

// GET POSTS BY CATEGORY SLUG
export async function getPostsByCategorySlug(
  categorySlug: string,
  status?: PostStatus
) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        ...(status && { status: status }),
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        excerpt: true,
        featured: true,
        featuredImageUrl: true,
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
    console.error("Error fetching posts by category slug:", error);
    return {
      success: false,
      error: "Kategori gönderileri getirilirken hata oluştu",
    };
  }
}

// GET POSTS BY TAG
export async function getPostsByTag(tag: string, status?: PostStatus) {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        tags: {
          has: tag,
        },
        ...(status && { status: status }),
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
