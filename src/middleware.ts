import { NextRequest, NextResponse } from 'next/server';

// CSRF protection + minimal security headers for /api/**.
//
// Same-origin enforcement on state-changing methods (POST/PUT/PATCH/DELETE):
// the browser-supplied Origin header must strictly match request.nextUrl.origin.
// No Referer fallback (browser fetch POSTs always send Origin; Referer is
// attacker-controlled on cross-origin form posts and would weaken the check).
//
// Pass-through for safe methods (GET/HEAD/OPTIONS), with the same security
// headers attached so all /api responses benefit.

const PASS_THROUGH_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function buildSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
  };
  if (process.env.NODE_ENV === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }
  return headers;
}

export function middleware(req: NextRequest): NextResponse {
  const securityHeaders = buildSecurityHeaders();
  const method = req.method.toUpperCase();

  if (PASS_THROUGH_METHODS.has(method)) {
    return NextResponse.next({ headers: securityHeaders });
  }

  const origin = req.headers.get('origin');
  const expected = req.nextUrl.origin;

  if (!origin || origin !== expected) {
    return NextResponse.json(
      { error: 'CSRF' },
      { status: 403, headers: securityHeaders },
    );
  }

  return NextResponse.next({ headers: securityHeaders });
}

export const config = {
  matcher: ['/api/:path*'],
};
