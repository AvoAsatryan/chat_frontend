import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('access_token');

  
    // Check if access_token cookie exists and is not empty
    if (!accessToken || accessToken.value === '') {
      // Redirect to login page on missing or empty token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    // If token is present, continue with the request
    return NextResponse.next();
  }
  
  // Optional: Configure middleware for specific routes or globally
  export const config = {
    // Match all routes (optional, adjust as needed)
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