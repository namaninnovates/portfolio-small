'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(prevState, formData) {
  const password = formData.get('password')
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin' // Fallback for local testing
  
  if (!password) {
    return { error: 'Please fill in this field' }
  }

  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
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
