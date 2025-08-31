"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createPost } from "@/lib/actions/posts"
import { getCategories } from "@/lib/actions/categories"
import { generateSlug, isValidSlug } from "@/lib/utils/slug"
import { useSession } from "@/lib/auth-client"
import { PostStatus } from "@/lib/generated/prisma"
import RichTextEditor from "@/components/admin/text-editor"
import {
  Save,
  Send,
  Calendar,
  User,
  Plus,
  X,
  Loader2,
} from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
}

export function NewPostEditor() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT)
  const [featured, setFeatured] = useState(false)
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Auth
  const { data: session, isPending, error } = useSession()
  
  // Debug
  useEffect(() => {
    console.log("Session state:", { session, isPending, error })
  }, [session, isPending, error])
  
  // Auto-generate slug from title
  const [autoSlug, setAutoSlug] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get categories
        const categoriesResult = await getCategories()
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Hata",
          description: "Veriler yüklenirken hata oluştu",
          variant: "destructive",
        })
      }
    }
    
    loadData()
  }, [toast])

  // Auto-generate slug when title changes
  useEffect(() => {
    if (autoSlug && title) {
      const generatedSlug = generateSlug(title)
      setSlug(generatedSlug)
    }
  }, [title, autoSlug])

  const handleTitleChange = (value: string) => {
    setTitle(value)
  }

  const handleSlugChange = (value: string) => {
    setSlug(value)
    setAutoSlug(false) // Disable auto-generation when manually edited
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

  const handleSave = async (publishStatus: PostStatus = PostStatus.DRAFT) => {
    console.log("Session:", session)
    console.log("User:", session?.user)
    
    if (!session?.user) {
      toast({
        title: "Hata",
        description: "Oturum açmanız gerekiyor",
        variant: "destructive",
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Hata",
        description: "Başlık gereklidir",
        variant: "destructive",
      })
      return
    }

    if (!slug.trim()) {
      toast({
        title: "Hata",
        description: "Slug gereklidir",
        variant: "destructive",
      })
      return
    }

    if (!isValidSlug(slug)) {
      toast({
        title: "Hata",
        description: "Geçersiz slug formatı",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        status: publishStatus,
        featured,
        tags: tags.length > 0 ? tags : undefined,
        authorId: session.user.id,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      }

      const result = await createPost(postData)

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        })
        
        // Redirect to posts list or edit page
        router.push("/admin/posts")
      } else {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Hata",
        description: "Gönderi kaydedilirken hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = () => handleSave(PostStatus.PUBLISHED)

  // Show loading while session is being fetched
  if (isPending) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Oturum Açmanız Gerekiyor</h2>
          <p className="text-gray-600 dark:text-gray-400">Bu sayfaya erişmek için giriş yapmalısınız.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 max-w-4xl mx-auto">
            {/* Document Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-4 dark:bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {status === PostStatus.DRAFT ? "Taslak" : 
                     status === PostStatus.PUBLISHED ? "Yayınlandı" : "Arşivlendi"}
                  </span>
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
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Kaydet
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
                    Yayınla
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Başlık</Label>
                <Input
                  placeholder="Bir Başlık Yazın"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-2xl font-bold border-b border-x-0 border-t-0  bg-accent border rounded-none px-3 py-6 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</Label>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>https://blog.com/post/</span>
                  <Input
                    placeholder="yazi-linki"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
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
                  className="resize-none text-2xl font-bold border-b border-x-0 border-t-0  bg-accent border rounded-none px-3 py-2 h-24 focus-visible:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-background dark:text-gray-100"
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
          <div className="w-76 border flex-shrink-0 min-h-screen mt-16 mx-8">
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
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
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
                      <span>{session?.user?.name || "Senin tarafından"}</span>
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
                      placeholder="Add tag..."
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
                <div className="p-3 border border-gray-200 dark:border-gray-600 rounded bg-white ">
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
        </div>
      </div>
    </div>
  )
}
