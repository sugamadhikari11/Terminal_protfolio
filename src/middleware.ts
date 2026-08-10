import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Match SITE_URL in src/lib/site.ts — apex only */
const CANONICAL_HOST = "sugamadhikari.com.np";

/**
 * Canonicalize the public host so Google indexes one URL shape.
 * Trailing-slash → no-slash is already handled by Next (308).
 * http → https is handled at Cloudflare / the edge.
 */
export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  if (hostname === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    // Prefer absolute Location for crawlers behind proxies
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip Next internals and common static files.
     * Still run on HTML routes so www → apex applies site-wide.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|glb|pdf|txt|xml)$).*)",
  ],
};
