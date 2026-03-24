import { NextResponse } from 'next/server';

const validCountries = ['us', 'gb', 'es', 'mx'];
const validLangs = ['en', 'es'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is missing country/lang segments
  const segments = pathname.split('/').filter(Boolean);
  
  const isPathMissingLocale = !validCountries.includes(segments[0]) || !validLangs.includes(segments[1]);

  if (isPathMissingLocale) {
    // Basic redirection to /us/en if no locale is present
    // You could also parse headers here to determine a better default
    return NextResponse.redirect(new URL(`/us/en${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static, images, etc.)
    '/((?!_next|api|static|.*\\..*).*)',
  ],
};
