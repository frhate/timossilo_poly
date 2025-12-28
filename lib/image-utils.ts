export const IMAGE_VALIDATION = {
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DISPLAY_MAX_WIDTH: 300,
  // Add compression settings
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 1200,
  QUALITY: 0.85,
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only image files are allowed.`,
    }
  }

  if (file.size > IMAGE_VALIDATION.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${IMAGE_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
    }
  }

  return { valid: true }
}

export function getOptimizedCloudinaryUrl(url: string, width?: number): string {
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return url

  const transformations = [
    'f_auto',
    'q_auto',
    width ? `w_${width}` : 'w_1000',
    'c_scale',
  ].join(',')

  return url.slice(0, uploadIndex + 8) + transformations + '/' + url.slice(uploadIndex + 8)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

// Add image compression function
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > IMAGE_VALIDATION.MAX_WIDTH) {
            height = (height * IMAGE_VALIDATION.MAX_WIDTH) / width
            width = IMAGE_VALIDATION.MAX_WIDTH
          }
        } else {
          if (height > IMAGE_VALIDATION.MAX_HEIGHT) {
            width = (width * IMAGE_VALIDATION.MAX_HEIGHT) / height
            height = IMAGE_VALIDATION.MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Compression failed"))
            }
          },
          "image/jpeg",
          IMAGE_VALIDATION.QUALITY
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}