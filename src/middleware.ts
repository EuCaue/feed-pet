import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const isMobile = /mobile/i.test(ua);
  const res = NextResponse.next();
  res.cookies.set("isMobile", isMobile ? "true" : "false");
  return res;
}
