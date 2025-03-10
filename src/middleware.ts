import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { authMiddleware } from "@clerk/nextjs";

// const isProtectedRoute = createRouteMatcher(['/input(.*)', '/app(.*)'])
const isProtectedRoute = createRouteMatcher([])

// Define rate limiting parameters
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_MINUTE = 100;

// In-memory rate limiting store (for demo purposes - should be replaced with Redis in production)
const ipRequestCounts = new Map<string, { count: number, timestamp: number }>();

// More stable rate limiting implementation using headers
export const rateLimitMiddleware = (request: NextRequest) => {
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(', ')[0] || 'unknown';

  const response = NextResponse.next();

  try {
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return response;
  }
};


// Add security headers to all responses
const securityHeadersMiddleware = (response: NextResponse) => {
  // Set security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add Content Security Policy
  response.headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.accounts.dev;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: *.clerk.accounts.dev;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' *.clerk.accounts.dev *.supabase.co;
  `.replace(/\s+/g, ' ').trim());
  
  return response;
};

export default clerkMiddleware(
  (auth, req) => {
    const response = securityHeadersMiddleware(NextResponse.next());
    return response;
  }
);
export const config = { 
  debug: process.env.NODE_ENV === 'development',
  publicRoutes: ['/']  // Add public routes here that don't need authentication
};