import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Skip all internal Next.js paths and static files:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, static assets (*.svg, *.png, etc.)
     * - /api/version (public health check)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/version|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
