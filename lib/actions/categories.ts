"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

// GET ALL CATEGORIES WITH POST COUNTS
export async function getCategories() {
  try {
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
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Kategoriler getirilirken hata oluştu",
    };
  }
}

// GET SINGLE CATEGORY BY ID
export async function getCategoryById(categoryId: number) {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
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
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Kategori bulunamadı",
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return {
      success: false,
      error: "Kategori getirilirken hata oluştu",
    };
  }
}

// GET CATEGORY BY SLUG
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        slug: slug,
      },
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
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Kategori bulunamadı",
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return {
      success: false,
      error: "Kategori getirilirken hata oluştu",
    };
  }
}

// CREATE CATEGORY
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  try {
    // Check if slug already exists
    const existingCategory = await prismadb.category.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        error: "Bu slug zaten kullanılıyor",
      };
    }

    // Check if name already exists
    const existingName = await prismadb.category.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingName) {
      return {
        success: false,
        error: "Bu kategori adı zaten kullanılıyor",
      };
    }

    const category = await prismadb.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        color: data.color,
        icon: data.icon,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    
    // ✅ Cache tag'lerini invalidate et
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidateTag(CACHE_TAGS.POSTS);

    return {
      success: true,
      data: category,
      message: "Kategori başarıyla oluşturuldu",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: "Kategori oluşturulurken hata oluştu",
    };
  }
}

// UPDATE CATEGORY
export async function updateCategory(
  categoryId: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  try {
    const existingCategory = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: "Kategori bulunamadı",
      };
    }

    // Check if new slug already exists (if slug is being updated)
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await prismadb.category.findUnique({
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

    // Check if new name already exists (if name is being updated)
    if (data.name && data.name !== existingCategory.name) {
      const nameExists = await prismadb.category.findUnique({
        where: {
          name: data.name,
        },
      });

      if (nameExists) {
        return {
          success: false,
          error: "Bu kategori adı zaten kullanılıyor",
        };
      }
    }

    const updatedCategory = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.icon !== undefined && { icon: data.icon }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    
    // ✅ Cache tag'lerini invalidate et
    revalidateTag(CACHE_TAGS.CATEGORIES);
    revalidateTag(CACHE_TAGS.POSTS);

    return {
      success: true,
      data: updatedCategory,
      message: "Kategori başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: "Kategori güncellenirken hata oluştu",
    };
  }
}

// DELETE CATEGORY
export async function deleteCategory(categoryId: number) {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Kategori bulunamadı",
      };
    }

    // Check if category has posts
    if (category._count.posts > 0) {
      return {
        success: false,
        error: "Bu kategoriye ait gönderiler bulunduğu için silinemez",
      };
    }

    await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    
    // ✅ Cache tag'lerini invalidate et
    revalidateTag(CACHE_TAGS.CATEGORIES);

    return {
      success: true,
      message: "Kategori başarıyla silindi",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: "Kategori silinirken hata oluştu",
    };
  }
}