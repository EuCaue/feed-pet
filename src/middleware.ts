import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const isMobile = /mobile/i.test(ua);
  request.cookies.set("isMobile", isMobile ? "true" : "false");
  return await updateSession(request);
}
export const config = {
  matcher: [
    /*     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
