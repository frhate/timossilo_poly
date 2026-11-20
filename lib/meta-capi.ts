/**
 * Server-side Meta Conversions API (CAPI) helpers.
 *
 * IMPORTANT: this module must only ever be imported from server code
 * (server actions, route handlers, server components). It reads
 * `META_CONVERSIONS_API_ACCESS_TOKEN`, which must never be exposed to the
 * browser. Never rename that variable to `NEXT_PUBLIC_*`.
 *
 * Env vars used:
 *   META_CONVERSIONS_API_ACCESS_TOKEN  (required, server-only)
 *   META_PIXEL_ID                      (optional, falls back to the public id)
 *   NEXT_PUBLIC_META_PIXEL_ID          (fallback)
 *   NEXT_PUBLIC_FACEBOOK_PIXEL_ID      (fallback)
 *   META_CAPI_TEST_EVENT_CODE          (optional, e.g. TEST12345 for Test Events)
 *   META_CAPI_API_VERSION              (optional, defaults to v21.0)
 */

import { createHash } from "crypto"
import { cookies, headers } from "next/headers"

const DEFAULT_PIXEL_ID = "1409111558024279"

function resolvePixelId(): string {
  return String(
    process.env.META_PIXEL_ID ||
      process.env.NEXT_PUBLIC_META_PIXEL_ID ||
      process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
      DEFAULT_PIXEL_ID,
  )
    .trim()
    .replace(/[^\d]/g, "")
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex")
}

/** Lowercase, strip accents and punctuation — Meta's expected hash input. */
function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
}

/**
 * Meta expects international format without symbols. Algerian local numbers
 * start with 0 (e.g. 0550123456) and must become 213550123456.
 */
function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.startsWith("213")) return digits
  if (digits.startsWith("0")) return `213${digits.replace(/^0+/, "")}`
  return digits
}

export interface MetaCapiUserData {
  email?: string | null
  phone?: string | null
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  externalId?: string | null
}

export interface MetaCapiContent {
  id: string
  quantity: number
  item_price: number
}

export interface MetaPurchaseCapiInput extends MetaCapiUserData {
  /** Must match the browser eventID exactly so Meta deduplicates. */
  eventId: string
  value: number
  currency?: string
  orderId?: string
  contentIds?: string[]
  contents?: MetaCapiContent[]
  numItems?: number
  eventSourceUrl?: string
}

function buildUserData(input: MetaCapiUserData): Record<string, unknown> {
  const userData: Record<string, unknown> = {}

  if (input.email) {
    const em = input.email.trim().toLowerCase()
    if (em) userData.em = [sha256(em)]
  }

  if (input.phone) {
    const ph = normalizePhone(input.phone)
    if (ph) userData.ph = [sha256(ph)]
  }

  const nameParts =
    input.fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  const firstName = input.firstName ?? nameParts[0]
  const lastName =
    input.lastName ??
    (nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined)

  if (firstName) {
    const fn = normalizeText(firstName)
    if (fn) userData.fn = [sha256(fn)]
  }
  if (lastName) {
    const ln = normalizeText(lastName)
    if (ln) userData.ln = [sha256(ln)]
  }

  if (input.city) {
    const ct = normalizeText(input.city)
    if (ct) userData.ct = [sha256(ct)]
  }
  if (input.state) {
    const st = normalizeText(input.state)
    if (st) userData.st = [sha256(st)]
  }
  if (input.zip) {
    const zp = input.zip.toLowerCase().replace(/[\s-]/g, "")
    if (zp) userData.zp = [sha256(zp)]
  }

  const country = (input.country || "dz").trim().toLowerCase()
  if (country) userData.country = [sha256(country)]

  if (input.externalId) {
    const externalId = input.externalId.trim()
    if (externalId) userData.external_id = [sha256(externalId)]
  }

  return userData
}

/**
 * Sends a server-side Purchase event that matches the browser pixel event.
 *
 * Never throws: a CAPI failure must not break order creation. Errors are only
 * logged so they show up in `pm2 logs`.
 */
export async function sendMetaPurchaseToConversionsApi(
  input: MetaPurchaseCapiInput,
): Promise<void> {
  try {
    const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN?.trim()
    const pixelId = resolvePixelId()

    if (!accessToken) {
      console.warn(
        "[Meta CAPI] Purchase not sent: META_CONVERSIONS_API_ACCESS_TOKEN is not set.",
      )
      return
    }
    if (!pixelId) {
      console.warn("[Meta CAPI] Purchase not sent: pixel id is missing.")
      return
    }

    const value = Number(input.value)
    const currency = String(input.currency || "DZD")
      .trim()
      .toUpperCase()

    if (!Number.isFinite(value) || value <= 0) {
      console.warn(
        "[Meta CAPI] Purchase not sent: value must be a number greater than 0.",
        input.value,
      )
      return
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      console.warn(
        "[Meta CAPI] Purchase not sent: currency must be a 3-letter ISO code.",
        currency,
      )
      return
    }

    const requestHeaders = await headers()
    const userData = buildUserData(input)

    const clientIp =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      undefined
    const clientUserAgent = requestHeaders.get("user-agent") || undefined

    if (clientIp) userData.client_ip_address = clientIp
    if (clientUserAgent) userData.client_user_agent = clientUserAgent

    // Browser cookies improve event match quality. These are NOT hashed.
    try {
      const cookieStore = await cookies()
      const fbp = cookieStore.get("_fbp")?.value
      const fbc = cookieStore.get("_fbc")?.value
      if (fbp) userData.fbp = fbp
      if (fbc) userData.fbc = fbc
    } catch {
      // Ignore: cookies are unavailable outside a request context.
    }

    const eventSourceUrl =
      input.eventSourceUrl ||
      requestHeaders.get("referer") ||
      "https://timossilo-polymobile.com/checkout"

    const customData: Record<string, unknown> = {
      value: Math.round(value * 100) / 100,
      currency,
    }
    if (input.orderId) customData.order_id = input.orderId
    if (input.contentIds?.length) {
      customData.content_ids = input.contentIds
      customData.content_type = "product"
    }
    if (input.contents?.length) customData.contents = input.contents
    if (typeof input.numItems === "number") customData.num_items = input.numItems

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: "website",
          event_source_url: eventSourceUrl,
          user_data: userData,
          custom_data: customData,
        },
      ],
      access_token: accessToken,
    }

    const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim()
    if (testEventCode) payload.test_event_code = testEventCode

    const apiVersion = process.env.META_CAPI_API_VERSION?.trim() || "v21.0"
    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      console.error(
        `[Meta CAPI] Purchase failed (${response.status}):`,
        body.slice(0, 500),
      )
      return
    }

    const result = (await response.json().catch(() => null)) as {
      events_received?: number
      fbtrace_id?: string
    } | null

    console.log("[Meta CAPI] Purchase sent:", {
      eventId: input.eventId,
      value: customData.value,
      currency,
      eventsReceived: result?.events_received,
      fbtraceId: result?.fbtrace_id,
    })
  } catch (error) {
    console.error("[Meta CAPI] Purchase request error:", error)
  }
}
