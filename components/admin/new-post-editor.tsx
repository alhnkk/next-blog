"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Eye,
  Save,
  Send,
  Calendar,
  User,
  ImageIcon,
  Link,
  Bold,
  Italic,
  List,
  AlignLeft,
  MoreHorizontal,
  Plus,
  X,
  Menu,
} from "lucide-react"

export function NewPostEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("draft")
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageSelect = (file: File | null, url?: string) => {
    setFeaturedImage(file)
    setFeaturedImageUrl(url || "")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 lg:max-w-4xl mx-auto overflow-y-auto">
            {/* Document Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 dark:bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Draft</span>
                  <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Değişiklikler Kaydedilmemiş</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-gray-600 border-gray-300 bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-800 hidden sm:flex"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Kaydet</span>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Yayınla</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Başlık</Label>
                <Input
                  placeholder="Bir Başlık Yazın"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl lg:text-2xl font-bold border-b border-x-0 border-t-0 bg-accent border rounded-none px-3 py-4 lg:py-6 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-xs sm:text-sm">https://yourblog.com/post/</span>
                  <Input
                    placeholder="yazi-linki"
                    className="text-lg lg:text-xl font-bold border-b border-x-0 border-t-0 bg-accent border rounded-none px-2 py-2 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Özet</Label>
                <Textarea
                  placeholder="Kısa bir açıklama yazın..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="resize-none text-base lg:text-lg font-medium border-b border-x-0 border-t-0 bg-accent border rounded-none px-3 py-2 h-20 lg:h-24 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
                />
              </div>

              {/* Featured Image - Mobile Only */}
              <div className="lg:hidden">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={featuredImageUrl}
                />
              </div>

              {/* Content */}
              <div className="">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İçerik</Label>

                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 p-2 border border-gray-200 dark:border-gray-700 bg-sidebar overflow-x-auto">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0"></div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0"></div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder="Yazmaya başlayın"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="resize-none h-48 lg:h-64 text-sm leading-relaxed border-gray-200 dark:border-gray-700 border-t-0 rounded-none focus-visible:ring-1 focus-visible:ring-accent/30 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={`
            fixed lg:relative inset-y-0 right-0 z-50 w-80 lg:w-76 
            border-l bg-sidebar flex-shrink-0 overflow-y-auto 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            min-h-screen lg:min-h-full
          `}>
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 lg:p-6 space-y-6">
              {/* Featured Image - Desktop Only */}
              <div className="hidden lg:block">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={featuredImageUrl}
                />
              </div>

              {/* Publish Settings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Yayınlama</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Durum
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="mt-1 bg-background dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Paylaş</SelectItem>
                        <SelectItem value="scheduled">Zamanlandı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Kategori
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kategori Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Edebiyat</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Bugün Oluşturuldu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>Senin tarafından</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Etiketler</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Etiket ekle..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1 text-sm"
                    />
                    <Button
                      onClick={addTag}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer flex items-center gap-1"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Preview */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">SEO Önizleme</h3>
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-background">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">
                    {title || "Başlıksız"}
                  </div>
                  <div className="text-green-700 dark:text-green-400 text-xs mt-1">https://yourblog.com/yazi-linki</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                    {excerpt || "Henüz açıklama yok."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
