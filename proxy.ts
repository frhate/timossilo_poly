import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Allow public access to SEO files and API routes
  const pathname = request.nextUrl.pathname
  if (typeof pathname !== "string") {
    return NextResponse.next()
  }

  const publicPaths = [
    '/sitemap.xml',
    '/robots.txt',
    '/manifest.json',
    '/api/telegram',
    '/refund-policy',
    '/blog',
  ]

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Apply authentication for other routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

