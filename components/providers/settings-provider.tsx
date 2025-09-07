"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSettings, Settings as SettingsType } from "@/lib/actions/settings";

interface SettingsContextType {
  settings: SettingsType | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const result = await getSettings();
      if (result.success && result.settings) {
        setSettings(result.settings);
      }
    } catch (error) {
      console.error("Settings yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
