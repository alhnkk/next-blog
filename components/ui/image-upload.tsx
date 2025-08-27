"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload, X, Link } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageSelect?: (file: File | null, url?: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ onImageSelect, currentImage, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [imageUrl, setImageUrl] = useState("")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onImageSelect?.(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setPreview(imageUrl)
      onImageSelect?.(null, imageUrl)
      setImageUrl("")
    }
  }

  const removeImage = () => {
    setPreview(null)
    setImageUrl("")
    onImageSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
        Öne Çıkan Görsel
      </Label>
      
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            onClick={removeImage}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              variant={uploadMethod === "file" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("file")}
            >
              <Upload className="h-4 w-4 mr-1" />
              Dosya
            </Button>
            <Button
              type="button"
              variant={uploadMethod === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setUploadMethod("url")}
            >
              <Link className="h-4 w-4 mr-1" />
              URL
            </Button>
          </div>

          {uploadMethod === "file" ? (
            <div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex flex-col items-center justify-center gap-2"
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Görsel yüklemek için tıklayın
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Görsel URL'si girin..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
              >
                Ekle
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}