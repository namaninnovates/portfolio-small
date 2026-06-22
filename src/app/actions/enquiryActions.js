'use server'

import { prisma } from '@/lib/prisma'
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

    await prisma.enquiry.create({ data })
    return { success: true }
  } catch (error) {
    console.error('Failed to submit enquiry:', error)
    return { error: 'Failed to submit your enquiry. Please try again later.' }
  }
}

export async function deleteEnquiry(id) {
  try {
    await prisma.enquiry.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete enquiry:', error)
    return { error: 'Failed to delete enquiry' }
  }
}
