import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Let login page through
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const authCookie = request.cookies.get('admin_session')
    
    // Simple check: if cookie doesn't exist or isn't our expected value
    // In a real app we'd verify a JWT, but for a simple personal portfolio
    // this is a sufficient lightweight barrier.
    if (!authCookie || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
