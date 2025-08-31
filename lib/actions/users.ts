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
        bio: true,
        location: true,
        phone: true,
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

// GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        bio: true,
        location: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Kullanıcı bulunamadı",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: "Kullanıcı bilgileri alınırken hata oluştu",
    };
  }
}

// UPDATE USER PROFILE
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    location?: string;
    phone?: string;
    image?: string;
  }
) {
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

    const updatedUser = await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        phone: true,
        updatedAt: true,
      },
    });

    revalidatePath("/user");

    return {
      success: true,
      data: updatedUser,
      message: "Profil başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: "Profil güncellenirken hata oluştu",
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