"use client"

/**
 * Central Meta (Facebook) Pixel helpers.
 *
 * Manual Advanced Matching:
 *   fbq("init", PIXEL_ID, { em: "...", ph: "...", ... })
 *
 * The browser pixel hashes `em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country`,
 * `external_id`, `db` and `ge` automatically with SHA-256 before sending them
 * to Meta. We only normalise the values (lowercase email, digits-only phone
 * with country code, no punctuation in names/cities, ...).
 *
 * Never pre-hash these values here: passing an already hashed value makes the
 * pixel hash it a second time and the match will fail.
 */

const FALLBACK_PIXEL_ID = "1409111558024279"

export const META_PIXEL_ID = String(
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
    FALLBACK_PIXEL_ID,
)
  .trim()
  .replace(/[^\d]/g, "")

export const META_ADVANCED_MATCHING_STORAGE_KEY = "meta_advanced_matching"

export interface AdvancedMatchingData {
  email?: string | null
  phone?: string | null
  firstName?: string | null
  lastName?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  externalId?: string | null
  dateOfBirth?: string | null
  gender?: string | null
}

type Fbq = (...args: any[]) => void

type AdvancedMatchingPayload = Record<string, string>

const COUNTRY_ALIASES: Record<string, string> = {
  dz: "dz",
  dza: "dz",
  algeria: "dz",
  algerie: "dz",
  "algérie": "dz",
  "الجزائر": "dz",
}

/** Removes diacritics and punctuation, keeps letters/numbers (Arabic included). */
function compact(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
}

export function normalizeMetaEmail(value?: string | null): string | undefined {
  const email = value?.trim().toLowerCase()
  return email && email.includes("@") ? email : undefined
}

export function normalizeMetaCountry(value?: string | null): string | undefined {
  const country = value?.trim().toLowerCase()
  if (!country) return undefined
  return COUNTRY_ALIASES[country] ?? compact(country)
}

/**
 * Meta expects the phone number with its country code and without `+`, spaces,
 * dashes or leading zeros. Algerian numbers (`05 xx xx xx xx`) are converted to
 * `2135xxxxxxxx` so they match the phone number stored in the customer's Meta
 * profile.
 */
export function normalizeMetaPhone(
  value?: string | null,
  country?: string | null,
): string | undefined {
  if (!value) return undefined

  let digits = value.replace(/\D/g, "")
  if (!digits) return undefined

  if (digits.startsWith("00")) {
    digits = digits.slice(2)
  }

  if (normalizeMetaCountry(country) === "dz" && !digits.startsWith("213")) {
    if (digits.startsWith("0")) {
      digits = `213${digits.slice(1)}`
    } else if (digits.length === 9) {
      digits = `213${digits}`
    }
  }

  return digits
}

function normalizeMetaName(value?: string | null): string | undefined {
  const name = value?.trim()
  if (!name) return undefined

  const cleaned = compact(name)
  return cleaned || undefined
}

/** Splits "Ahmed Ben Ali" into first name / last name for advanced matching. */
export function splitMetaName(fullName?: string | null): {
  firstName?: string
  lastName?: string
} {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return {}
  if (parts.length === 1) return { firstName: parts[0] }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

/** Builds the object that is passed as the 3rd argument of `fbq("init", ...)`. */
export function buildMetaAdvancedMatching(
  data: AdvancedMatchingData,
): AdvancedMatchingPayload {
  const payload: AdvancedMatchingPayload = {}

  const email = normalizeMetaEmail(data.email)
  if (email) payload.em = email

  const phone = normalizeMetaPhone(data.phone, data.country)
  if (phone) payload.ph = phone

  const firstName = normalizeMetaName(data.firstName)
  if (firstName) payload.fn = firstName

  const lastName = normalizeMetaName(data.lastName)
  if (lastName) payload.ln = lastName

  const city = normalizeMetaName(data.city)
  if (city) payload.ct = city

  const state = normalizeMetaName(data.state)
  if (state) payload.st = state

  if (data.zip) {
    const zip = compact(data.zip)
    if (zip) payload.zp = zip
  }

  const country = normalizeMetaCountry(data.country)
  if (country) payload.country = country

  if (data.externalId) {
    const externalId = compact(data.externalId)
    if (externalId) payload.external_id = externalId
  }

  if (data.dateOfBirth) {
    const dateOfBirth = data.dateOfBirth.replace(/\D/g, "")
    if (dateOfBirth.length === 8) payload.db = dateOfBirth
  }

  if (data.gender) {
    const gender = data.gender.trim().toLowerCase().charAt(0)
    if (gender === "m" || gender === "f") payload.ge = gender
  }

  return payload
}

function readStoredAdvancedMatching(): AdvancedMatchingPayload {
  if (typeof window === "undefined") return {}

  try {
    const raw = window.sessionStorage.getItem(
      META_ADVANCED_MATCHING_STORAGE_KEY,
    )
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function storeAdvancedMatching(payload: AdvancedMatchingPayload) {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(
      META_ADVANCED_MATCHING_STORAGE_KEY,
      JSON.stringify(payload),
    )
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): ignore.
  }
}

/**
 * Runs `callback` as soon as the pixel queue exists. The base snippet creates
 * `window.fbq` as a queue, so calls made before fbevents.js is downloaded are
 * still delivered later.
 */
function whenFbqReady(callback: (fbq: Fbq) => void, maxAttempts = 40) {
  if (typeof window === "undefined") return

  if (typeof window.fbq === "function") {
    callback(window.fbq)
    return
  }

  let attempts = 0
  const timer = window.setInterval(() => {
    attempts += 1

    if (typeof window.fbq === "function") {
      window.clearInterval(timer)
      callback(window.fbq)
    } else if (attempts >= maxAttempts) {
      window.clearInterval(timer)
    }
  }, 100)
}

/**
 * Sends user data to the pixel through Manual Advanced Matching.
 *
 * Safe to call repeatedly: each call merges with the data already stored for
 * the session, then runs `fbq("init", PIXEL_ID, payload)` again. The pixel
 * merges advanced matching data across `init` calls.
 */
export function setAdvancedMatching(data: AdvancedMatchingData) {
  if (typeof window === "undefined") return
  if (!META_PIXEL_ID) return

  const nextPayload = {
    ...readStoredAdvancedMatching(),
    ...buildMetaAdvancedMatching(data),
  }

  if (Object.keys(nextPayload).length === 0) return

  storeAdvancedMatching(nextPayload)

  whenFbqReady((fbq) => {
    fbq("init", META_PIXEL_ID, nextPayload)
  })
}

/** Clears the data kept for the current tab (call it on logout). */
export function clearAdvancedMatching() {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.removeItem(META_ADVANCED_MATCHING_STORAGE_KEY)
  } catch {
    // Ignore unavailable storage.
  }
}

/** Re-applies the advanced matching saved during this session. */
export function restoreAdvancedMatching() {
  if (typeof window === "undefined") return

  const stored = readStoredAdvancedMatching()
  if (Object.keys(stored).length === 0) return

  whenFbqReady((fbq) => {
    fbq("init", META_PIXEL_ID, stored)
  })
}

let lastPageViewKey = ""

/** Tracks one PageView per URL, including client-side navigations. */
export function trackMetaPageView() {
  if (typeof window === "undefined") return
  if (!META_PIXEL_ID) return

  const key = `${window.location.pathname}${window.location.search}`
  if (key === lastPageViewKey) return
  lastPageViewKey = key

  whenFbqReady((fbq) => {
    fbq("track", "PageView")
  })
}

/**
 * Tracks a standard Meta event, e.g. ViewContent, AddToCart, InitiateCheckout,
 * Purchase, Lead, CompleteRegistration.
 */
export function trackMetaEvent(
  name: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === "undefined") return
  if (!META_PIXEL_ID) return

  whenFbqReady((fbq) => {
    if (eventId) {
      fbq("track", name, params, { eventID: eventId })
    } else {
      fbq("track", name, params)
    }
  })
}

/** Tracks a custom (non-standard) Meta event. */
export function trackMetaCustomEvent(
  name: string,
  params: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === "undefined") return
  if (!META_PIXEL_ID) return

  whenFbqReady((fbq) => {
    if (eventId) {
      fbq("trackCustom", name, params, { eventID: eventId })
    } else {
      fbq("trackCustom", name, params)
    }
  })
}
