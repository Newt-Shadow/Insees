import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // CSP: Using basic strict settings. 
  // Note: We might need to relax 'script-src' if using extensive external scripts (Analytis, etc.)
  // For now, allowing 'unsafe-inline' and 'unsafe-eval' is often necessary for Next.js in dev/some prod setups unless strict nonce is fully wired.
  // Given "load immediately" and "top grade", we aim for balance.
  // Ideally: script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://res.cloudinary.com https://public.blob.vercel-storage.com https://images.unsplash.com https://logo.clearbit.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;
  
  // Replace newlines with spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();
 
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
 
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  // Strict Transport Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // X-DNS-Prefetch-Control
  response.headers.set(
    'X-DNS-Prefetch-Control',
    'on'
  );

  // X-Frame-Options
  response.headers.set(
    'X-Frame-Options',
    'DENY'
  );

  // X-Content-Type-Options
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );

  // Referrer-Policy
  response.headers.set(
    'Referrer-Policy',
    'origin-when-cross-origin'
  );

  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );
 
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
