"use client"

import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Upload, X, Loader2} from "lucide-react"
import Image from "next/image"
import {useState, useRef} from "react"
import {validateImageFile, compressImage, getOptimizedCloudinaryUrl} from "@/lib/image-utils"


interface ImageUploadProps {
    onImagesUpdated: (urls: string[]) => void
    currentImageUrls?: string[]
    maxImages?: number
    productId?: string // Product ID for organizing uploads
}

export function ImageUpload({
                                onImagesUpdated,
                                currentImageUrls = [],
                                maxImages = 3,
                                productId
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

        // Use validation utility
        const validation = validateImageFile(file)
        if (!validation.valid) {
            alert(validation.error)
            return
        }

        setIsUploading(true)

        try {
            // Compress image before upload
            const compressedBlob = await compressImage(file)

            const formData = new FormData()
            formData.append('file', compressedBlob, file.name)

            // Use temporary ID if productId not provided
            const uploadProductId = productId || `temp-${Date.now()}`
            formData.append('productId', uploadProductId)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.error || 'Échec du téléchargement'
                alert(errorMessage)
                return
            }

            const data = await response.json()
            onImagesUpdated([...currentImageUrls, data.url])
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Échec du téléchargement de l\'image')
        } finally {
            setIsUploading(false)
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
                                src={getOptimizedCloudinaryUrl(url, 200)}
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
                                <X className="h-3 w-3"/>
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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Téléchargement...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4"/>
                                Ajouter une image
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, JPEG ou WEBP (max. 5MB) - Automatiquement optimisé en WebP
                    </p>
                </div>
            )}
        </div>
    )
}