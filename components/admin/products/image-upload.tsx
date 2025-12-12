"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { validateImageFile } from "@/lib/image-utils"
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImageUrl?: string
}

export function ImageUpload({ onImageUploaded, currentImageUrl }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(currentImageUrl || "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setError("")
    setSuccess("")

    // Show preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      onImageUploaded(data.url)
      setSuccess(`تم رفع الصورة بنجاح! تم الضغط بنسبة ${data.compressionRatio}%`)

      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "فشل رفع الصورة")
      setImagePreview("")
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setImagePreview("")
    onImageUploaded("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="space-y-3">
      <Label>صورة المنتج</Label>

      {!imagePreview ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 cursor-pointer transition-colors">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
              <p className="text-sm font-medium">
                {uploading ? "جاري رفع الصورة..." : "انقر لرفع صورة"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP, GIF (الحد الأقصى: 5MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

