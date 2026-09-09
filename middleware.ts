import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'greatpay-dev-secret-change-me';

export function middleware(request: NextRequest) {
  const protectedPath = request.nextUrl.pathname.startsWith('/dashboard');

  if (!protectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('greatpay_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
