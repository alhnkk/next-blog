"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Palette, Hash, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateCategory, deleteCategory } from "@/lib/actions/categories";
import { generateSlug } from "@/lib/utils/slug";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#64748b", "#6b7280", "#374151"
];

interface EditCategoryEditorProps {
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      posts: number;
    };
  };
}

export function EditCategoryEditor({ category }: EditCategoryEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    color: category.color || "#3b82f6",
    icon: category.icon || ""
  });


  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      // Sadece slug boşsa otomatik oluştur
      ...(prev.slug === generateSlug(prev.name) && { slug: generateSlug(value) })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Kategori adı gereklidir");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug gereklidir");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateCategory(category.id, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon.trim() || undefined
      });

      if (result.success) {
        toast.success(result.message || "Kategori başarıyla güncellendi");
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Kategori güncellenirken hata oluştu");
      }
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (category._count.posts > 0) {
      toast.error("Bu kategoriye ait gönderiler bulunduğu için silinemez");
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteCategory(category.id);

      if (result.success) {
        toast.success(result.message || "Kategori başarıyla silindi");
        router.push("/admin/categories");
      } else {
        toast.error(result.error || "Kategori silinirken hata oluştu");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/?category=${formData.slug}`, "_blank");
    } else {
      toast.error("Önce kategori slug&apos;ını oluşturun");
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Kategori Düzenle</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(category.createdAt).toLocaleDateString("tr-TR")} tarihinde oluşturuldu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={category._count.posts > 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>&quot;{category.name}&quot;</strong> kategorisini silmek istediğinizden emin misiniz? 
                  Bu işlem geri alınamaz.
                  {category._count.posts > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                      <strong>Uyarı:</strong> Bu kategoriye ait {category._count.posts} gönderi bulunmaktadır. 
                      Önce bu gönderileri başka kategorilere taşıyın veya silin.
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={category._count.posts > 0 || isDeleting}
                >
                  {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            disabled={!formData.slug}
          >
            <Eye className="h-4 w-4 mr-2" />
            Önizle
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ana Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Kategori Adı *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Kategori adını girin"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /
                    </span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="kategori-slug"
                      className="rounded-l-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    URL&apos;de görünecek kategori adresi
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Kategori açıklaması (isteğe bağlı)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="icon">İkon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="İkon adı (isteğe bağlı)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lucide React ikon adı (örn: folder, tag, star)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* İstatistikler */}
            <Card>
              <CardHeader>
                <CardTitle>İstatistikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {category._count.posts}
                    </div>
                    <div className="text-sm text-blue-600">Gönderi</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor((Date.now() - new Date(category.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-green-600">Gün Önce</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Renk Seçimi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Kategori Rengi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: formData.color }}
                  />
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 font-mono text-sm"
                    placeholder="#3b82f6"
                  />
                </div>

                <div>
                  <Label className="text-sm">Hazır Renkler</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                          formData.color === color ? 'border-gray-900' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Önizleme */}
            <Card>
              <CardHeader>
                <CardTitle>Önizleme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: formData.color }}
                    />
                    <div>
                      <div className="font-medium">
                        {formData.name || "Kategori Adı"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        /{formData.slug || "kategori-slug"}
                      </div>
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded">
                      {formData.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}