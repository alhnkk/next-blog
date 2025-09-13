"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload, X, Link, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next"
import { toast } from "sonner"

interface ImageUploadProps {
  onImageSelect?: (file: File | null, url?: string, altText?: string) => void
  currentImage?: string
  currentAltText?: string
  className?: string
  requireAltText?: boolean
}

export function ImageUpload({ onImageSelect, currentImage, currentAltText, className, requireAltText = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState(currentAltText || "")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // ImageKit authentication function
  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth")
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }
      const data = await response.json()
      const { signature, expire, token, publicKey } = data
      return { signature, expire, token, publicKey }
    } catch (error) {
      console.error("Authentication error:", error)
      throw new Error("Authentication request failed")
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (requireAltText && !altText.trim()) {
      toast.error("Alt text alanı zorunludur")
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)

    // Upload to ImageKit
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create new abort controller
      abortControllerRef.current = new AbortController()

      // Get authentication parameters
      const authParams = await authenticator()
      const { signature, expire, token, publicKey } = authParams

      // Upload file to ImageKit
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setUploadProgress((event.loaded / event.total) * 100)
        },
        abortSignal: abortControllerRef.current.signal,
      })

      // Update preview with ImageKit URL
      setPreview(uploadResponse.url || null)
      onImageSelect?.(null, uploadResponse.url, altText)
      toast.success("Görsel başarıyla yüklendi!")
    } catch (error) {
      console.error("Upload error:", error)
      
      if (error instanceof ImageKitAbortError) {
        toast.error("Yükleme iptal edildi")
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Geçersiz istek: " + error.message)
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Ağ hatası: " + error.message)
      } else if (error instanceof ImageKitServerError) {
        toast.error("Sunucu hatası: " + error.message)
      } else {
        toast.error("Yükleme sırasında hata oluştu")
      }
      
      // Reset preview on error
      setPreview(null)
      onImageSelect?.(null, undefined, "")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      abortControllerRef.current = null
    }
  }

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      if (requireAltText && !altText.trim()) {
        toast.error("Alt text alanı zorunludur")
        return
      }
      setPreview(imageUrl)
      onImageSelect?.(null, imageUrl, altText)
      setImageUrl("")
    }
  }

  const removeImage = () => {
    // Cancel ongoing upload if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    setPreview(null)
    setImageUrl("")
    setAltText("")
    setUploadProgress(0)
    setIsUploading(false)
    onImageSelect?.(null, undefined, "")
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
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Yükleniyor... %{Math.round(uploadProgress)}</p>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={removeImage}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isUploading}
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
            <div className="space-y-3">
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
                disabled={isUploading || (requireAltText && !altText.trim())}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Yükleniyor... %{Math.round(uploadProgress)}
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Görsel yüklemek için tıklayın
                    </span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Görsel URL'si girin..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim() || (requireAltText && !altText.trim())}
                className="w-full"
              >
                Ekle
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Alt Text Field - Always visible */}
      <div className="mt-3 space-y-2">
        <Label htmlFor="alt-text" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Alt Text {requireAltText && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="alt-text"
          placeholder="Görseli açıklayın..."
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Görsel açıklaması SEO ve erişilebilirlik için önemlidir.
        </p>
      </div>
    </div>
  )
}