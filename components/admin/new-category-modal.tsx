"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Palette, Plus } from "lucide-react";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions/categories";
import { generateSlug } from "@/lib/utils/slug";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#64748b", "#6b7280", "#374151"
];

export function NewCategoryModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3b82f6",
    icon: ""
  });


  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3b82f6",
      icon: ""
    });
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
      const result = await createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon.trim() || undefined
      });

      if (result.success) {
        toast.success(result.message || "Kategori başarıyla oluşturuldu");
        setOpen(false);
        resetForm();
        // Sayfayı yenile
        window.location.reload();
      } else {
        toast.error(result.error || "Kategori oluşturulurken hata oluştu");
      }
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Kategori Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir kategori oluşturmak için aşağıdaki bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon - Temel Bilgiler */}
            <div className="space-y-4">
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
            </div>

            {/* Sağ Kolon - Renk ve Önizleme */}
            <div className="space-y-4">
              {/* Renk Seçimi */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4" />
                  Kategori Rengi
                </Label>
                
                <div className="flex items-center gap-3 mb-4">
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
              </div>

              {/* Önizleme */}
              <div>
                <Label className="mb-3 block">Önizleme</Label>
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
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}