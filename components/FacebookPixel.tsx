"use client"

/**
 * Backwards-compatible alias.
 *
 * The single Meta Pixel implementation lives in `components/meta-pixel.tsx`
 * and is loaded once from `app/layout.tsx`. Keeping this re-export avoids a
 * second pixel instance (and duplicated PageView events) if the old component
 * is imported somewhere.
 */
export { default } from "@/components/meta-pixel"
