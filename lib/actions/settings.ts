"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export interface SettingsData {
  siteName: string;
  siteDescription?: string;
  siteLogo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface Settings {
  id: number;
  siteName: string;
  siteDescription: string | null;
  siteLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSettings() {
  try {
    let settings = await prismadb.settings.findFirst();
    
    if (!settings) {
      // İlk kez çalıştırılıyorsa varsayılan ayarları oluştur
      settings = await prismadb.settings.create({
        data: {
          siteName: "Next Blog",
          siteDescription: "Modern blog platformu",
          primaryColor: "#3b82f6",
          secondaryColor: "#1e40af",
          accentColor: "#f59e0b",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
        },
      });
    }

    return { success: true, settings };
  } catch (error) {
    console.error("Ayarları getirme hatası:", error);
    return { success: false, error: "Ayarlar getirilirken bir hata oluştu." };
  }
}

export async function updateSettings(data: SettingsData) {
  try {
    let settings = await prismadb.settings.findFirst();
    
    if (!settings) {
      // Ayarlar yoksa oluştur
      settings = await prismadb.settings.create({
        data: {
          siteName: data.siteName,
          siteDescription: data.siteDescription || null,
          siteLogo: data.siteLogo || null,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
        },
      });
    } else {
      // Mevcut ayarları güncelle
      settings = await prismadb.settings.update({
        where: { id: settings.id },
        data: {
          siteName: data.siteName,
          siteDescription: data.siteDescription || null,
          siteLogo: data.siteLogo || null,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, settings };
  } catch (error) {
    console.error("Ayar güncelleme hatası:", error);
    return { success: false, error: "Ayarlar güncellenirken bir hata oluştu." };
  }
}

export async function resetSettings() {
  try {
    const defaultSettings = {
      siteName: "Next Blog",
      siteDescription: "Modern blog platformu",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
    };

    let settings = await prismadb.settings.findFirst();
    
    if (!settings) {
      settings = await prismadb.settings.create({
        data: defaultSettings,
      });
    } else {
      settings = await prismadb.settings.update({
        where: { id: settings.id },
        data: defaultSettings,
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, settings };
  } catch (error) {
    console.error("Ayar sıfırlama hatası:", error);
    return { success: false, error: "Ayarlar sıfırlanırken bir hata oluştu." };
  }
}
