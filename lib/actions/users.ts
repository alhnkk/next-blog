"use server";

import { prismadb } from "../prismadb";
import { revalidatePath } from "next/cache";

// GET ALL USERS
export async function getUsers() {
  try {
    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "Failed to fetch users",
    };
  }
}

// DELETE USER
export async function deleteUser(userId: string) {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Kullanıcı bulunamadı",
      };
    }

    // Kullanıcıyı sil
    await prismadb.user.delete({
      where: {
        id: userId,
      },
    });

    // Cache'i yenile
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "Kullanıcı başarıyla silindi",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Kullanıcı silinirken hata oluştu",
    };
  }
}

