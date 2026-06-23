'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only'
const key = new TextEncoder().encode(JWT_SECRET)

export async function loginAction(prevState, formData) {
  const password = formData.get('password')
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  
  if (!password) {
    return { error: 'Please fill in this field' }
  }

  if (!adminPasswordHash) {
    console.error('ADMIN_PASSWORD_HASH is not set in environment variables');
    return { error: 'Authentication is currently unavailable' }
  }

  const isValid = bcrypt.compareSync(password, adminPasswordHash)

  if (isValid) {
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
