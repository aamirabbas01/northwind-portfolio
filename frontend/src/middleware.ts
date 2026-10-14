import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isPublicRoute =
        pathname === '/' || /^\/(login|register)(\/|$)/i.test(pathname);

    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.toLowerCase() === '/login' && token) {
        return NextResponse.redirect(new URL('/Dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images/|favicon.ico).*)'],
};
