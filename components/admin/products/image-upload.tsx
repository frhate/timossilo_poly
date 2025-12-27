"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"

interface ImageUploadProps {
  onImagesUpdated: (urls: string[]) => void
  currentImageUrls?: string[]
  maxImages?: number
}

export function ImageUpload({
  onImagesUpdated,
  currentImageUrls = [],
  maxImages = 3
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (currentImageUrls.length >= maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`)
      return
    }

    // Validate file type
    if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez PNG, JPG, JPEG ou WEBP.')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5000000) {
      alert('Le fichier est trop volumineux. Taille maximale: 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', 'products')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Échec du téléchargement')
      }

      const data = await response.json()
      onImagesUpdated([...currentImageUrls, data.secure_url])
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Échec du téléchargement de l\'image')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = currentImageUrls.filter((_, i) => i !== index)
    onImagesUpdated(newUrls)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>Images du produit ({currentImageUrls.length}/{maxImages})</Label>

      {currentImageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {currentImageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                width={200}
                height={150}
                className="rounded-lg object-cover border w-full h-32"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {currentImageUrls.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter une image
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, JPEG ou WEBP (max. 5MB)
          </p>
        </div>
      )}
    </div>
  )
}