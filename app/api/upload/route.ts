import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
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

    const buffer = await file.arrayBuffer()
    const compressedBuffer = await sharp(buffer)
      .resize(COMPRESSED_MAX_WIDTH, COMPRESSED_MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY })
      .toBuffer()

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `product-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const blob = await put(filename, compressedBuffer, {
      access: "public",
      contentType: "image/jpeg",
    })

    // Calculate compression ratio
    const originalSize = file.size
    const compressedSize = compressedBuffer.length
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname.split("/").pop(),
      originalSize,
      compressedSize,
      compressionRatio,
      type: "image/jpeg",
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
