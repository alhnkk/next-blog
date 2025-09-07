"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from "@/components/admin/text-editor"
import { createPost } from "@/lib/actions/posts"
import { getCategories } from "@/lib/actions/categories"
import { useSession } from "@/lib/auth-client"
import { PostStatus } from "@/lib/generated/prisma"
import { toast } from "sonner"
import {
  Save,
  Send,
  Calendar,
  User,
  Plus,
  X,
} from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  description?: string | null
  color?: string | null
  icon?: string | null
  _count: {
    posts: number
  }
}

export function NewPostEditor() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  
  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT)
  const [featured, setFeatured] = useState(false)
  const [featuredImageUrl, setFeaturedImageUrl] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Auth kontrolü
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories()
        if (result.success) {
          setCategories(result.data)
        } else {
          toast.error("Kategoriler yüklenirken hata oluştu")
        }
      } catch (error) {
        toast.error("Kategoriler yüklenirken hata oluştu")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isSlugManuallyEdited) {
      const generatedSlug = generateSlug(title)
      setSlug(generatedSlug)
    }
  }, [title, isSlugManuallyEdited])

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      // Turkish characters to English
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/Ğ/g, 'g')
      .replace(/Ü/g, 'u')
      .replace(/Ş/g, 's')
      .replace(/İ/g, 'i')
      .replace(/Ö/g, 'o')
      .replace(/Ç/g, 'c')
      // Remove special characters and replace spaces with hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

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
    if (url) {
      setFeaturedImageUrl(url)
    } else if (file) {
      // Handle file upload - you'd typically upload to a server here
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFeaturedImageUrl(result)
      }
      reader.readAsDataURL(file)
    } else {
      setFeaturedImageUrl("")
    }
  }

  const handleSave = async (publishStatus: PostStatus = PostStatus.DRAFT) => {
    if (!session?.user?.id) {
      toast.error("Oturum açmanız gerekiyor")
      return
    }

    if (!title.trim()) {
      toast.error("Başlık gereklidir")
      return
    }

    if (!slug.trim()) {
      toast.error("Slug gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const result = await createPost({
        title: title.trim(),
        content: content || "",
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        featured,
        status: publishStatus,
        tags,
        authorId: session.user.id,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      })

      if (result.success) {
        toast.success(result.message)
        router.push("/admin/posts")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = () => handleSave(PostStatus.PUBLISHED)

  // Loading state
  if (isPending || !session) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 max-w-4xl mx-auto overflow-y-auto">
            {/* Document Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 dark:bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Draft</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Değişiklikler Kaydedilmemiş</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSave(PostStatus.DRAFT)}
                    disabled={isSaving}
                    className="text-gray-600 border-gray-300 bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Kaydet
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Yayınla
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
                  className="text-2xl font-bold border-b border-x-0 border-t-0  bg-accent border rounded-none px-3 py-6 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</Label>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>https://yourblog.com/post/</span>
                  <Input
                    placeholder="yazi-linki"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setIsSlugManuallyEdited(true)
                    }}
                    className="text-2xl font-bold border-b border-x-0 border-t-0  bg-accent border rounded-none px-2 py-0 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
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
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">İçerik</Label>
                <RichTextEditor
                  initialContent={content}
                  onChange={setContent}
                  placeholder="Yazmaya başlayın... Markdown shortcuts kullanabilirsiniz"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-76 border-l bg-sidebar flex-shrink-0 overflow-y-auto h-full">
            <div className="p-6 space-y-6">
              {/* Publish Settings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Yayınlama</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Durum
                    </Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as PostStatus)}>
                      <SelectTrigger className="mt-1 bg-background dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostStatus.DRAFT}>Taslak</SelectItem>
                        <SelectItem value={PostStatus.PUBLISHED}>Yayınlandı</SelectItem>
                        <SelectItem value={PostStatus.ARCHIVED}>Arşivlendi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Kategori
                    </Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kategori Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>
                            Yükleniyor...
                          </SelectItem>
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            Kategori bulunamadı
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Öne Çıkar
                    </Label>
                    <Button
                      type="button"
                      variant={featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFeatured(!featured)}
                      className="h-8"
                    >
                      {featured ? "Öne Çıkarıldı" : "Öne Çıkar"}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Bugün Oluşturuldu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{session?.user?.name || "Bilinmeyen kullanıcı"}</span>
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
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
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
                  <div className="text-green-700 dark:text-green-400 text-xs mt-1">
                    https://blog.com/blog/{slug || "yazi-linki"}
                  </div>
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
