import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    // 1. Grab the token from cookies
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    //console.log(`[MIDDLEWARE LOG] Path: ${pathname} | Has Token: ${!!token}`);

    // 2. Exact match check for your target uppercase path route
    const isDashboardRoute = pathname.startsWith('/Dashboard');

    // 3. If accessing /Dashboard and there is no token, bounce to login
    if (isDashboardRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. If logged in and hitting login page, redirect straight to dashboard
    if ((pathname.toLowerCase() === '/login') && token) {
        return NextResponse.redirect(new URL('/Dashboard', request.url));
    }

    return NextResponse.next();
}

// 5. Ensure the matcher captures the root path structure completely
export const config = {
    matcher: ['/Dashboard/:path*', '/login', '/'],
};
