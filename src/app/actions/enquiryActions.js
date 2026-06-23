'use server'

import { db } from '@/lib/db'
import { enquiries } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createEnquiry(formData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      projectType: formData.get('projectType'),
      budget: formData.get('budget'),
      description: formData.get('description'),
    }

    if (!data.name || !data.email || !data.projectType || !data.budget || !data.description) {
      return { error: 'All fields are required.' }
    }

    await db.insert(enquiries).values(data)
    return { success: true }
  } catch (error) {
    console.error('Failed to submit enquiry:', error)
    return { error: 'Failed to submit your enquiry. Please try again later.' }
  }
}

export async function deleteEnquiry(id) {
  try {
    await db.delete(enquiries).where(eq(enquiries.id, id))
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete enquiry:', error)
    return { error: 'Failed to delete enquiry' }
  }
}
