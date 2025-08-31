"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePost } from "@/lib/actions/posts"
import { PostStatus } from "@/lib/generated/prisma"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import RichTextEditor from "@/components/admin/text-editor"
import {
  Save,
  Send,
  Calendar,
  User,
  Plus,
  X,
  Menu,
} from "lucide-react"
import { Textarea } from "../ui/textarea"

interface EditPostEditorProps {
  post: {
    id: number;
    title: string;
    content: string | null;
    slug: string;
    excerpt: string | null;
    featured: boolean;
    status: PostStatus;
    tags: string[];
    authorId: string;
    categoryId: number | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      bio: string | null;
    };
    category: {
      id: number;
      name: string;
      slug: string;
      description: string | null;
      color: string | null;
      icon: string | null;
    } | null;
  };
}

export function EditPostEditor({ post }: EditPostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content || "")
  const [slug, setSlug] = useState(post.slug)
  const [excerpt, setExcerpt] = useState(post.excerpt || "")
  const [tags, setTags] = useState<string[]>(post.tags)
  const [newTag, setNewTag] = useState("")
  const [category, setCategory] = useState(post.categoryId?.toString() || "")
  const [status, setStatus] = useState(post.status)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)



  // Title değiştiğinde slug'ı otomatik güncelle (opsiyonel)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Edit modunda slug'ı otomatik değiştirmiyoruz, kullanıcı isterse manuel değiştirebilir
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }



  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updatePost(post.id, {
        title,
        content,
        slug,
        excerpt,
        tags,
        categoryId: category ? parseInt(category) : undefined,
        status,
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
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      const result = await updatePost(post.id, {
        title,
        content,
        slug,
        excerpt,
        tags,
        categoryId: category ? parseInt(category) : undefined,
        status: PostStatus.PUBLISHED,
      })

      if (result.success) {
        toast.success("Gönderi yayınlandı!")
        router.push("/admin/posts")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusText = () => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return "Yayınlandı"
      case PostStatus.DRAFT:
        return "Taslak"
      case PostStatus.ARCHIVED:
        return "Arşivlendi"
      default:
        return "Taslak"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return "bg-green-400"
      case PostStatus.DRAFT:
        return "bg-orange-400"
      case PostStatus.ARCHIVED:
        return "bg-gray-400"
      default:
        return "bg-orange-400"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 lg:max-w-4xl mx-auto">
            {/* Document Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4 dark:bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${getStatusColor()} rounded-full`}></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{getStatusText()}</span>
                  <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                    Son güncelleme: {new Date(post.updatedAt).toLocaleDateString("tr-TR")}
                  </span>
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
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Kaydet</span>
                  </Button>
                  {status !== PostStatus.PUBLISHED && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                      onClick={handlePublish}
                      disabled={isLoading}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Yayınla</span>
                    </Button>
                  )}
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
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kategori Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Edebiyat</SelectItem>
                        <SelectItem value="2">Teknoloji</SelectItem>
                        <SelectItem value="3">Tasarım</SelectItem>
                        <SelectItem value="4">İş Dünyası</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString("tr-TR")} tarihinde oluşturuldu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{post.author.name} tarafından</span>
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
                      onKeyDown={(e) => e.key === "Enter" && addTag()}}
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
                  <div className="text-green-700 dark:text-green-400 text-xs mt-1">https://yourblog.com/{slug}</div>
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