"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Settings, 
  Palette, 
  Image as ImageIcon, 
  Save, 
  RotateCcw,
  Eye,
  Upload
} from "lucide-react";
import Image from "next/image";
import { 
  getSettings, 
  updateSettings, 
  resetSettings,
  SettingsData,
  Settings as SettingsType
} from "@/lib/actions/settings";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SettingsData>({
    siteName: "",
    siteDescription: "",
    siteLogo: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const result = await getSettings();
      if (result.success && result.settings) {
        setSettings(result.settings);
        setFormData({
          siteName: result.settings.siteName,
          siteDescription: result.settings.siteDescription || "",
          siteLogo: result.settings.siteLogo || "",
          primaryColor: result.settings.primaryColor,
          secondaryColor: result.settings.secondaryColor,
          accentColor: result.settings.accentColor,
          backgroundColor: result.settings.backgroundColor,
          textColor: result.settings.textColor,
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings(formData);
      if (result.success && result.settings) {
        setSettings(result.settings);
        toast({
          title: "Başarılı",
          description: "Ayarlar başarıyla güncellendi.",
        });
      } else {
        toast({
          title: "Hata",
          description: result.error || "Ayarlar güncellenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const result = await resetSettings();
      if (result.success && result.settings) {
        setSettings(result.settings);
        setFormData({
          siteName: result.settings.siteName,
          siteDescription: result.settings.siteDescription || "",
          siteLogo: result.settings.siteLogo || "",
          primaryColor: result.settings.primaryColor,
          secondaryColor: result.settings.secondaryColor,
          accentColor: result.settings.accentColor,
          backgroundColor: result.settings.backgroundColor,
          textColor: result.settings.textColor,
        });
        toast({
          title: "Başarılı",
          description: "Ayarlar varsayılan değerlere sıfırlandı.",
        });
      } else {
        toast({
          title: "Hata",
          description: result.error || "Ayarlar sıfırlanırken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar sıfırlanırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Ayarları</h1>
          <p className="text-muted-foreground">
            Sitenizin genel ayarlarını yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Sıfırla
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Görünüm
          </TabsTrigger>
          <TabsTrigger value="media">
            <ImageIcon className="h-4 w-4 mr-2" />
            Medya
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genel Bilgiler</CardTitle>
              <CardDescription>
                Sitenizin temel bilgilerini düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="siteName">Site Adı</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="Site adını girin"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  placeholder="Site açıklamasını girin"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Renk Ayarları</CardTitle>
              <CardDescription>
                Sitenizin renk temasını özelleştirin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Ana Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">İkincil Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      placeholder="#1e40af"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Vurgu Rengi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => handleInputChange("accentColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => handleInputChange("accentColor", e.target.value)}
                      placeholder="#f59e0b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Arka Plan Rengi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Metin Rengi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => handleInputChange("textColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.textColor}
                      onChange={(e) => handleInputChange("textColor", e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Renk Önizlemesi */}
              <div className="mt-6">
                <Label>Renk Önizlemesi</Label>
                <div 
                  className="p-6 rounded-lg border mt-2"
                  style={{ 
                    backgroundColor: formData.backgroundColor,
                    color: formData.textColor 
                  }}
                >
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: formData.primaryColor }}
                  >
                    {formData.siteName || "Site Adı"}
                  </h3>
                  <p className="text-sm mb-4 opacity-80">
                    {formData.siteDescription || "Site açıklaması"}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Ana Buton
                    </button>
                    <button 
                      className="px-4 py-2 rounded border text-sm"
                      style={{ 
                        borderColor: formData.secondaryColor,
                        color: formData.secondaryColor 
                      }}
                    >
                      İkincil Buton
                    </button>
                    <span 
                      className="px-2 py-1 rounded text-sm"
                      style={{ 
                        backgroundColor: formData.accentColor + "20",
                        color: formData.accentColor 
                      }}
                    >
                      Vurgu
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medya Ayarları</CardTitle>
              <CardDescription>
                Site logosu ve medya dosyalarını yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="siteLogo">Site Logosu URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="siteLogo"
                    value={formData.siteLogo}
                    onChange={(e) => handleInputChange("siteLogo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Yükle
                  </Button>
                </div>
                {formData.siteLogo && (
                  <div className="mt-2">
                    <Label>Logo Önizlemesi</Label>
                    <div className="mt-1 p-4 border rounded-lg">
                      <Image 
                        src={formData.siteLogo} 
                        alt="Logo önizlemesi" 
                        width={128}
                        height={64}
                        className="max-h-16 max-w-32 object-contain"
                        quality={80}
                        sizes="128px"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
