import { NextResponse } from 'next/server'

import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only'
const key = new TextEncoder().encode(JWT_SECRET)

export async function middleware(request) {
  // Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Let login page through
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const authCookie = request.cookies.get('admin_session')
    
    if (!authCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Cryptographically verify the session token
    try {
      await jwtVerify(authCookie.value, key)
      return NextResponse.next()
    } catch (error) {
      // Invalid token, signature mismatch, or expired
      const loginUrl = new URL('/admin/login', request.url)
      // Delete the invalid cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
