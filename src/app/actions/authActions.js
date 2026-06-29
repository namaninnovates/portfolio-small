'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { getJwtKey } from '@/lib/auth'

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
    let loginSuccess = false;
    try {
      // Generate secure signed JWT
      const token = await new SignJWT({ authenticated: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(getJwtKey())

      const cookieStore = await cookies()
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })
      
      loginSuccess = true;
    } catch (error) {
      console.error('Login error:', error)
      return { error: 'Server configuration error. Check server logs.' }
    }

    if (loginSuccess) {
      redirect('/admin')
    }
  }

  return { error: 'Invalid password' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
