"use server";

import { prisma } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export interface CreateMessageData {
  name: string;
  email: string;
  subject?: string;
  content: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  content: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createMessage(data: CreateMessageData) {
  try {
    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        content: data.content,
      },
    });

    revalidatePath("/admin/messages");
    return { success: true, message };
  } catch (error) {
    console.error("Mesaj oluşturma hatası:", error);
    return { success: false, error: "Mesaj gönderilirken bir hata oluştu." };
  }
}

export async function getMessages(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.count(),
    ]);

    return {
      messages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Mesajları getirme hatası:", error);
    return { messages: [], total: 0, totalPages: 0, currentPage: 1 };
  }
}

export async function getMessageById(id: number) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return { success: false, error: "Mesaj bulunamadı." };
    }

    return { success: true, message };
  } catch (error) {
    console.error("Mesaj getirme hatası:", error);
    return { success: false, error: "Mesaj getirilirken bir hata oluştu." };
  }
}

export async function markMessageAsRead(id: number) {
  try {
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Mesaj okundu işaretleme hatası:", error);
    return { success: false, error: "Mesaj okundu işaretlenirken bir hata oluştu." };
  }
}

export async function markMessageAsReplied(id: number) {
  try {
    await prisma.message.update({
      where: { id },
      data: { replied: true },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Mesaj yanıtlandı işaretleme hatası:", error);
    return { success: false, error: "Mesaj yanıtlandı işaretlenirken bir hata oluştu." };
  }
}

export async function deleteMessage(id: number) {
  try {
    await prisma.message.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    return { success: false, error: "Mesaj silinirken bir hata oluştu." };
  }
}

export async function getRecentMessages(limit: number = 5) {
  try {
    const messages = await prisma.message.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return messages;
  } catch (error) {
    console.error("Son mesajları getirme hatası:", error);
    return [];
  }
}

export async function getUnreadMessageCount() {
  try {
    const count = await prisma.message.count({
      where: { read: false },
    });

    return count;
  } catch (error) {
    console.error("Okunmamış mesaj sayısı getirme hatası:", error);
    return 0;
  }
}
