'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only'
const key = new TextEncoder().encode(JWT_SECRET)

export async function loginAction(prevState, formData) {
  const password = formData.get('password')
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin' // Fallback for local testing
  
  if (!password) {
    return { error: 'Please fill in this field' }
  }

  if (password === adminPassword) {
    // Generate secure signed JWT
    const token = await new SignJWT({ authenticated: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)

    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    redirect('/admin')
  }

  return { error: 'Invalid password' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
