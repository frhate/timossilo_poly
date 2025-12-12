export const IMAGE_VALIDATION = {
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DISPLAY_MAX_WIDTH: 300,
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only image files are allowed.`,
    }
  }

  // Check file size
  if (file.size > IMAGE_VALIDATION.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${IMAGE_VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
