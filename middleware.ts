import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Log environment variables in preview (for debugging)
  if (process.env.VERCEL_ENV === "preview") {
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log("NEXT_PUBLIC_AI_SEARCH_ENABLED:", process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/:path*",
}
