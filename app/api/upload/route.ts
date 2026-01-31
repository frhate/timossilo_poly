import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { promises as fs } from "fs"
import path from "path"

// Configuration
const BASE_UPLOAD_PATH = process.env.BASE_UPLOAD_PATH || "/var/www/uploads/products"
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://timossilo-polymobile.com/uploads/products"

// Image validation and compression
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const COMPRESSED_MAX_WIDTH = 1200
const COMPRESSED_MAX_HEIGHT = 1200
const QUALITY = 80 // JPEG quality

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 },
      )
    }

    // Create product directory if it doesn't exist
    const productDir = path.join(BASE_UPLOAD_PATH, productId)
    await fs.mkdir(productDir, { recursive: true })

    // Read and process image
    const buffer = await file.arrayBuffer()
    const originalSize = buffer.byteLength


    // Optimize image to WebP (best compression)
    const webpBuffer = await sharp(buffer)
      .resize(COMPRESSED_MAX_WIDTH, COMPRESSED_MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toBuffer()

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^/.]+$/, "")
    const filename = `${sanitizedName}-${timestamp}.webp`
    const filepath = path.join(productDir, filename)

    // Write optimized image to disk
    await fs.writeFile(filepath, webpBuffer)

    // Calculate compression ratio
    const compressedSize = webpBuffer.length
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

    // Generate public URL
    const publicUrl = `${PUBLIC_BASE_URL}/${productId}/${filename}`

    return NextResponse.json({
      url: publicUrl,
      filename,
      originalSize,
      compressedSize,
      compressionRatio,
      type: "image/webp",
      productId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
