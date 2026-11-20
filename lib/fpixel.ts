"use client"

/**
 * Backwards-compatible helpers.
 *
 * Prefer importing from `@/lib/meta-pixel` directly. These aliases keep the
 * old `lib/fpixel` API working while sharing the same normalisation and
 * advanced matching logic.
 */
export {
  META_PIXEL_ID as FB_PIXEL_ID,
  trackMetaPageView as pageview,
  trackMetaEvent as event,
} from "@/lib/meta-pixel"
