# Novel Editor Entegrasyon Rehberi

Bu rehber, mevcut Next.js projenize Novel rich text editor'ını nasıl entegre edeceğinizi ve tüm özelliklerini nasıl kullanacağınızı adım adım açıklamaktadır.

Novel, Notion-style modern bir editör olup React 19 ile tam uyumludur ve Shadcn/ui ile mükemmel entegrasyon sağlar.

## 1. Kurulum

### Gerekli Paketleri Yükleyin

```bash
npm install novel @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-typography @tiptap/extension-link @tiptap/extension-image
npm install @tiptap/extension-code-block-lowlight @tiptap/extension-color
npm install @tiptap/extension-text-style @tiptap/extension-list-item
```

## 2. Temel Kurulum

### 2.1 Novel Editor Component'i Oluşturun

`components/novel-editor.tsx` dosyasını oluşturun:

```tsx
"use client";

import { Editor } from "novel";
import { useState } from "react";

interface NovelEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function NovelEditor({
  initialContent = "",
  onChange,
  placeholder = "İçeriğinizi yazın...",
  editable = true,
  className = "",
}: NovelEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleUpdate = (editor: any) => {
    const html = editor.getHTML();
    setContent(html);
    onChange?.(html);
  };

  return (
    <div className={`novel-editor ${className}`}>
      <Editor
        defaultValue={initialContent}
        onUpdate={handleUpdate}
        disableLocalStorage={true}
        editable={editable}
        className="min-h-[200px] w-full"
        editorProps={{
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            placeholder: placeholder,
          },
        }}
      />
    </div>
  );
}
```

## 3. Gelişmiş Novel Editor Konfigürasyonu

### 3.1 Özelleştirilmiş Novel Editor

`components/advanced-novel-editor.tsx` dosyasını oluşturun:

```tsx
"use client";

import { Editor } from "novel";
import { useState } from "react";
import { defaultExtensions } from "novel/extensions";
import { slashCommand, suggestionItems } from "novel/extensions";

interface AdvancedNovelEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  showCharacterCount?: boolean;
  maxCharacters?: number;
}

export default function AdvancedNovelEditor({
  initialContent = "",
  onChange,
  placeholder = "İçeriğinizi yazın... '/' ile komutları görebilirsiniz",
  editable = true,
  className = "",
  showCharacterCount = false,
  maxCharacters = 5000,
}: AdvancedNovelEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [characterCount, setCharacterCount] = useState(0);

  const handleUpdate = (editor: any) => {
    const html = editor.getHTML();
    const text = editor.getText();

    setContent(html);
    setCharacterCount(text.length);
    onChange?.(html);
  };

  // Özel extensions
  const extensions = [
    ...defaultExtensions,
    slashCommand,
    // Diğer özel extension'lar buraya eklenebilir
  ];

  return (
    <div className={`novel-editor-advanced ${className}`}>
      <Editor
        defaultValue={initialContent}
        onUpdate={handleUpdate}
        disableLocalStorage={true}
        editable={editable}
        extensions={extensions}
        className="min-h-[300px] w-full border rounded-lg"
        editorProps={{
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full p-4",
            placeholder: placeholder,
          },
        }}
        slashCommand={{
          suggestion: {
            items: suggestionItems,
            render: () => {
              let component: any;
              let popup: any;

              return {
                onStart: (props: any) => {
                  // Slash command popup başlatma
                },
                onUpdate: (props: any) => {
                  // Slash command güncelleme
                },
                onKeyDown: (props: any) => {
                  // Klavye olayları
                },
                onExit: () => {
                  // Çıkış
                },
              };
            },
          },
        }}
      />

      {showCharacterCount && (
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            {characterCount} / {maxCharacters} karakter
          </span>
          {characterCount > maxCharacters && (
            <span className="text-red-500">Karakter limiti aşıldı!</span>
          )}
        </div>
      )}
    </div>
  );
}
```

### 3.2 Novel'in Yerleşik Özellikleri

Novel otomatik olarak şu özellikleri sağlar:

- **Slash Commands**: `/` ile başlayan komutlar
- **Markdown Shortcuts**: `**bold**`, `*italic*`, `# heading` vb.
- **Bubble Menu**: Metin seçildiğinde görünen toolbar
- **Floating Menu**: Boş satırlarda görünen `+` butonu
- **Drag & Drop**: Blokları sürükleyip bırakma
- **AI Integration**: Hazır AI özellikleri

## 4. Gelişmiş Özellikler

### 4.1 Özel Extensions Ekleme

Novel, TipTap tabanlı olduğu için özel extension'lar ekleyebilirsiniz:

```tsx
import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/core";

// Özel bir extension örneği
const CustomHighlight = Extension.create({
  name: "customHighlight",

  addCommands() {
    return {
      setHighlight:
        (color: string) =>
        ({ commands }) => {
          return commands.setMark("highlight", { color });
        },
    };
  },
});

// Component'te kullanım
const customExtensions = [...defaultExtensions, CustomHighlight];
```

### 4.2 Resim Upload Özelliği

`lib/upload-image.ts` dosyasını oluşturun:

```tsx
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    throw error;
  }
};
```

Sonra Novel editor'da kullanın:

```tsx
import { uploadImage } from '@/lib/upload-image'

// Editor props'unda
editorProps={{
  handleDrop: (view, event, slice, moved) => {
    // Drag & drop resim upload
    const files = Array.from(event.dataTransfer?.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      imageFiles.forEach(async (file) => {
        try {
          const url = await uploadImage(file)
          // Resmi editöre ekle
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: url })
            )
          )
        } catch (error) {
          console.error('Upload error:', error)
        }
      })
      return true
    }
    return false
  },
  handlePaste: (view, event, slice) => {
    // Paste ile resim upload
    const files = Array.from(event.clipboardData?.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length > 0) {
      imageFiles.forEach(async (file) => {
        try {
          const url = await uploadImage(file)
          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.image.create({ src: url })
            )
          )
        } catch (error) {
          console.error('Upload error:', error)
        }
      })
      return true
    }
    return false
  }
}}
```

## 5. Styling ve Tema

### 5.1 Novel CSS Konfigürasyonu

Novel, Tailwind CSS ile mükemmel uyum sağlar. `globals.css` dosyanıza ekleyin:

```css
/* Novel Editor Özel Stilleri */
.novel-editor .ProseMirror {
  outline: none;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  min-height: 200px;
}

.novel-editor .ProseMirror:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

/* Dark mode desteği */
.dark .novel-editor .ProseMirror {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Placeholder stili */
.novel-editor .ProseMirror p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Bubble menu stilleri */
.novel-bubble-menu {
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 0.25rem;
}

/* Slash command menu */
.novel-slash-command {
  background: hsl(var(--popover));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
}

.novel-slash-command-item {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
}

.novel-slash-command-item:hover,
.novel-slash-command-item.is-selected {
  background: hsl(var(--accent));
}

/* Code block stilleri */
.novel-editor pre {
  background: hsl(var(--muted));
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

/* Blockquote stilleri */
.novel-editor blockquote {
  border-left: 4px solid hsl(var(--border));
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}
```

### 5.2 Tailwind Konfigürasyonu

`tailwind.config.js` dosyanızda typography plugin'ini ekleyin:

```js
module.exports = {
  // ... diğer konfigürasyonlar
  plugins: [
    require("@tailwindcss/typography"),
    // ... diğer plugin'ler
  ],
};
```

Eğer yoksa yükleyin:

```bash
npm install @tailwindcss/typography
```

## 6. Kullanım Örnekleri

### 6.1 Form ile Entegrasyon

```tsx
"use client";

import { useState } from "react";
import NovelEditor from "@/components/novel-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BlogForm() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const blogData = {
      title,
      content, // HTML formatında
      plainText: content.replace(/<[^>]*>/g, ""), // HTML tagları temizlenmiş
      wordCount: content.replace(/<[^>]*>/g, "").split(" ").length,
    };

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        console.log("Blog başarıyla kaydedildi!");
        // Reset form
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="title">Başlık</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog başlığınızı girin..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">İçerik</Label>
        <NovelEditor
          initialContent={content}
          onChange={setContent}
          placeholder="Blog içeriğinizi yazın... '/' ile komutları görebilirsiniz"
          className="min-h-[400px]"
          showCharacterCount={true}
          maxCharacters={5000}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !title.trim() || !content.trim()}
        className="w-full"
      >
        {isLoading ? "Kaydediliyor..." : "Blog Yayınla"}
      </Button>
    </form>
  );
}
```

### 6.2 Sadece Okuma Modu

```tsx
import NovelEditor from "@/components/novel-editor";

export default function BlogDisplay({ blog }: { blog: any }) {
  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>

      <NovelEditor
        initialContent={blog.content}
        editable={false}
        className="prose-viewer"
      />

      <div className="mt-6 text-sm text-muted-foreground">
        Yayınlanma: {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
      </div>
    </article>
  );
}
```

### 6.3 React Hook Form ile Entegrasyon

```tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import NovelEditor from "@/components/novel-editor";

const blogSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  content: z.string().min(10, "İçerik en az 10 karakter olmalı"),
  category: z.string().min(1, "Kategori seçin"),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogFormWithValidation() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    console.log("Form data:", data);
    // API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Başlık</Label>
            <Input {...field} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <div>
            <Label>İçerik</Label>
            <NovelEditor
              initialContent={field.value}
              onChange={field.onChange}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        )}
      />

      <Button type="submit">Kaydet</Button>
    </form>
  );
}
```

## 7. Veritabanı Entegrasyonu

### 7.1 Prisma Schema Güncellemesi

`prisma/schema.prisma` dosyasına HTML içerik alanı ekleyin:

```prisma
model Blog {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text // HTML içerik
  plainText String?  @db.Text // Arama için düz metin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 7.2 API Route Örneği

`app/api/blogs/route.ts`:

```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    // HTML taglarını temizleyerek düz metin oluştur
    const plainText = content.replace(/<[^>]*>/g, "");

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        plainText,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Blog oluşturulamadı" }, { status: 500 });
  }
}
```

## 8. Güvenlik Önlemleri

### 8.1 HTML Sanitization

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```tsx
import DOMPurify from "dompurify";

// İçeriği temizle
const sanitizeContent = (content: string) => {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(content);
  }
  return content;
};

// Kullanım
const cleanContent = sanitizeContent(editorContent);
```

## 9. Performans Optimizasyonu

### 9.1 Lazy Loading

```tsx
import { lazy, Suspense } from "react";

const RichTextEditor = lazy(() => import("@/components/rich-text-editor"));

export default function BlogForm() {
  return (
    <Suspense fallback={<div>Editor yükleniyor...</div>}>
      <RichTextEditor />
    </Suspense>
  );
}
```

### 9.2 Debounced Auto-save

```tsx
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";

const debouncedSave = useCallback(
  debounce(async (content: string) => {
    // Auto-save işlemi
    await fetch("/api/auto-save", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }, 1000),
  []
);

useEffect(() => {
  if (content) {
    debouncedSave(content);
  }
}, [content, debouncedSave]);
```

## 10. AI Entegrasyonu (İsteğe Bağlı)

Novel, AI özellikleri için hazır altyapı sağlar:

```tsx
import { Editor } from "novel";
import { AICommand } from "novel/extensions";

// AI komutları ile editor
<Editor
  extensions={[
    ...defaultExtensions,
    AICommand.configure({
      suggestion: {
        items: ({ query }) => {
          // AI önerilerini getir
          return [
            {
              title: "Devam Et",
              description: "AI ile metni devam ettir",
              command: ({ editor, range }) => {
                // AI API çağrısı
              },
            },
            {
              title: "Özetle",
              description: "Seçili metni özetle",
              command: ({ editor, range }) => {
                // Özet API çağrısı
              },
            },
          ];
        },
      },
    }),
  ]}
/>;
```

## 11. Troubleshooting

### Yaygın Sorunlar ve Çözümleri:

1. **Hydration Hatası**: Novel client-side component olduğundan `'use client'` direktifini kullanın
2. **Stil Sorunları**: Tailwind CSS ve typography plugin'inin yüklü olduğundan emin olun
3. **TypeScript Hataları**: Novel'in tip tanımları otomatik gelir
4. **Resim Upload**: Backend API endpoint'i oluşturmayı unutmayın
5. **Extension Çakışması**: Özel extension'lar eklerken mevcut olanlarla çakışma kontrolü yapın

### Performance İpuçları:

- Büyük içerikler için lazy loading kullanın
- Resim optimizasyonu yapın
- Debounced auto-save implementasyonu ekleyin
- Content caching stratejisi uygulayın

Bu rehber ile Novel Editor'ı projenize başarıyla entegre edebilir ve modern bir yazma deneyimi sağlayabilirsiniz. Novel'in Notion-style arayüzü ve güçlü özellikleri sayesinde kullanıcılarınız profesyonel içerikler oluşturabilir.
